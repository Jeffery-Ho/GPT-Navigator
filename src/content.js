(() => {
  const ROOT_ID = "gpt-paragraph-nav";
  const DEBUG_ATTR = "data-gpt-paragraph-nav";
  const HEADING_SELECTOR = "h1, h2, h3, h4";
  const ROLE_HEADING_SELECTOR = '[role="heading"][aria-level]';
  const STRONG_HEADING_SELECTOR = "p, li";
  const NUMBERED_HEADING_SELECTOR = "p, div";
  const ASSISTANT_MESSAGE_SELECTOR = '[data-message-author-role="assistant"]';
  const MARKDOWN_FALLBACK_SELECTOR = "main .markdown";
  const LIST_ID = "gpt-paragraph-nav-list";
  const QUEUE_MAX_VISIBLE = 30;
  const MIN_MARKER_OPACITY = 0.28;

  const state = {
    headings: [],
    conversationMetrics: null,
    activeHeading: null,
    observer: null,
    scheduled: 0,
    scrollScheduled: 0,
    lastDebugSignature: "",
    lastRenderedHeadingCount: 0
  };

  function getRoot() {
    let root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement("div");
      root.id = ROOT_ID;
      root.setAttribute("aria-label", "ChatGPT paragraph navigation");
      root.setAttribute("role", "navigation");
      document.documentElement.appendChild(root);
    }
    return root;
  }

  function getList(root = getRoot()) {
    let list = root.querySelector(`#${LIST_ID}`);
    if (!list) {
      list = document.createElement("div");
      list.id = LIST_ID;
      list.className = "gpt-paragraph-nav__list";
      root.appendChild(list);
    }
    return list;
  }

  function isVisible(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  }

  function getAssistantContainers() {
    const assistantMessages = Array.from(document.querySelectorAll(ASSISTANT_MESSAGE_SELECTOR))
      .filter((node) => node instanceof HTMLElement && isVisible(node));

    if (assistantMessages.length > 0) {
      return assistantMessages;
    }

    return Array.from(document.querySelectorAll(MARKDOWN_FALLBACK_SELECTOR))
      .filter((node) => node instanceof HTMLElement && isVisible(node));
  }

  function normalizeTitle(text) {
    return text.replace(/\s+/g, " ").trim();
  }

  function clampLevel(level) {
    if (Number.isNaN(level)) {
      return 2;
    }
    return Math.min(Math.max(level, 1), 4);
  }

  function headingLevelFor(element) {
    if (/^H[1-4]$/.test(element.tagName)) {
      return Number(element.tagName.slice(1));
    }
    return clampLevel(Number(element.getAttribute("aria-level")));
  }

  function makeHeadingItem(element, index, level) {
    return {
      element,
      level: clampLevel(level),
      title: normalizeTitle(element.textContent || `Heading ${index + 1}`),
      id: element.id || `gpt-paragraph-heading-${index + 1}`
    };
  }

  function markdownLevelFromText(text) {
    const match = text.match(/^(#{1,4})\s+\S/);
    return match ? match[1].length : null;
  }

  function numberedHeadingLevelFromText(text) {
    if (/^(?:第)?[一二三四五六七八九十百千万]+[、.．]\s*\S/.test(text)) {
      return 1;
    }

    return null;
  }

  function getLeadingStrong(element) {
    const firstElement = Array.from(element.childNodes)
      .find((node) => node.nodeType === Node.ELEMENT_NODE);

    if (!(firstElement instanceof HTMLElement)) {
      return null;
    }

    if (firstElement.matches("strong, b")) {
      return firstElement;
    }

    return null;
  }

  function isStandaloneStrongHeading(element) {
    const titleElement = getLeadingStrong(element);
    if (!titleElement) {
      return false;
    }

    const blockText = normalizeTitle(element.textContent || "");
    const titleText = normalizeTitle(titleElement.textContent || "");
    if (!titleText || titleText.length > 160) {
      return false;
    }

    const markdownLevel = markdownLevelFromText(blockText);
    if (markdownLevel) {
      return true;
    }

    if (/^\d{1,2}[.．、]\s+\S/.test(blockText)) {
      return false;
    }

    return blockText === titleText;
  }

  function isStandaloneNumberedHeading(element) {
    const text = normalizeTitle(element.textContent || "");
    if (!text || text.length > 180) {
      return false;
    }

    if (!numberedHeadingLevelFromText(text)) {
      return false;
    }

    const nestedBlocks = element.querySelectorAll("p, div, ul, ol, table, pre, blockquote");
    return nestedBlocks.length === 0;
  }

  function collectHeadings() {
    const containers = getAssistantContainers();
    const seen = new Set();
    const headings = [];

    containers.forEach((container) => {
      container.querySelectorAll(`${HEADING_SELECTOR}, ${ROLE_HEADING_SELECTOR}`).forEach((heading) => {
        if (heading instanceof HTMLElement && isVisible(heading) && !seen.has(heading)) {
          seen.add(heading);
          headings.push(makeHeadingItem(heading, headings.length, headingLevelFor(heading)));
        }
      });
    });

    containers.forEach((container) => {
      container.querySelectorAll(STRONG_HEADING_SELECTOR).forEach((heading) => {
        if (!(heading instanceof HTMLElement) || !isVisible(heading) || seen.has(heading)) {
          return;
        }
        if (!isStandaloneStrongHeading(heading)) {
          return;
        }

        seen.add(heading);
        const markdownLevel = markdownLevelFromText(normalizeTitle(heading.textContent || ""));
        headings.push(makeHeadingItem(heading, headings.length, markdownLevel || 2));
      });
    });

    containers.forEach((container) => {
      container.querySelectorAll(NUMBERED_HEADING_SELECTOR).forEach((heading) => {
        if (!(heading instanceof HTMLElement) || !isVisible(heading) || seen.has(heading)) {
          return;
        }
        if (!isStandaloneNumberedHeading(heading)) {
          return;
        }

        seen.add(heading);
        const level = numberedHeadingLevelFromText(normalizeTitle(heading.textContent || ""));
        headings.push(makeHeadingItem(heading, headings.length, level || 2));
      });
    });

    const usableHeadings = headings.filter((item) => item.title.length > 0 && item.level <= 3);
    debugCollection(containers, usableHeadings);
    return usableHeadings;
  }

  function debugCollection(containers, headings) {
    const metrics = getConversationMetrics(containers);
    const signature = [
      containers.length,
      document.querySelectorAll(HEADING_SELECTOR).length,
      document.querySelectorAll(ROLE_HEADING_SELECTOR).length,
      headings.length,
      Math.round(metrics.length)
    ].join(":");

    if (signature === state.lastDebugSignature) {
      return;
    }

    state.lastDebugSignature = signature;
    console.info("[GPT Paragraph Navigator] scan", {
      assistantContainers: containers.length,
      domHeadings: document.querySelectorAll(HEADING_SELECTOR).length,
      roleHeadings: document.querySelectorAll(ROLE_HEADING_SELECTOR).length,
      usableHeadings: headings.length,
      conversationLength: Math.round(metrics.length),
      titles: headings.slice(0, 8).map((heading) => heading.title)
    });
  }

  function ensureHeadingIds(headings) {
    headings.forEach((item) => {
      if (!item.element.id) {
        item.element.id = item.id;
      }
    });
  }

  function getConversationMetrics(containers) {
    const visibleContainers = containers.filter(isVisible);
    if (!visibleContainers.length) {
      return getDocumentMetrics();
    }

    const positions = visibleContainers.map((container) => {
      const rect = container.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY
      };
    });

    const top = Math.min(...positions.map((position) => position.top));
    const bottom = Math.max(...positions.map((position) => position.bottom));
    if (bottom <= top) {
      return getDocumentMetrics();
    }

    return {
      top,
      bottom,
      length: bottom - top
    };
  }

  function getDocumentMetrics() {
    const documentHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight
    );
    return {
      top: 0,
      bottom: documentHeight,
      length: documentHeight
    };
  }

  function markerWidthFor(title) {
    const characterCount = Array.from(title).length;
    return Math.max(24, Math.ceil((characterCount / 50) * 24));
  }

  function markerPreviewFor(title) {
    return Array.from(title).slice(0, 16).join("");
  }

  function markerOpacityFor(index, total) {
    if (total <= 1) {
      return 1;
    }
    const progress = index / Math.max(total - 1, 1);
    return (MIN_MARKER_OPACITY + progress * (1 - MIN_MARKER_OPACITY)).toFixed(3);
  }

  function activateMarker(button) {
    const list = getList();
    list.querySelectorAll(".gpt-paragraph-nav__marker").forEach((marker) => {
      marker.classList.toggle("is-active", marker === button);
    });
  }

  function render() {
    const root = getRoot();
    const list = getList(root);
    const containers = getAssistantContainers();
    const headings = collectHeadings();
    const metrics = getConversationMetrics(containers);
    ensureHeadingIds(headings);
    state.headings = headings;
    state.conversationMetrics = metrics;
    document.documentElement.setAttribute(DEBUG_ATTR, `loaded:${headings.length}:${Math.round(metrics.length)}`);
    root.style.setProperty("--queue-visible-count", String(Math.min(headings.length || 1, QUEUE_MAX_VISIBLE)));

    root.classList.toggle("is-empty", headings.length === 0);
    list.textContent = "";

    headings.forEach((heading, index) => {
      const marker = document.createElement("button");
      marker.type = "button";
      marker.className = `gpt-paragraph-nav__marker level-${heading.level}`;
      marker.style.setProperty("--marker-width", `${markerWidthFor(heading.title)}px`);
      marker.style.setProperty("--marker-opacity", markerOpacityFor(index, headings.length));
      marker.setAttribute("aria-label", heading.title);
      marker.dataset.headingId = heading.element.id;

      const preview = document.createElement("span");
      preview.className = "gpt-paragraph-nav__preview";
      preview.textContent = markerPreviewFor(heading.title);
      marker.appendChild(preview);

      const label = document.createElement("span");
      label.className = "gpt-paragraph-nav__label";
      label.textContent = heading.title;
      marker.appendChild(label);

      marker.addEventListener("click", () => {
        heading.element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `#${encodeURIComponent(heading.element.id)}`);
        activateMarker(marker);
      });

      list.appendChild(marker);
    });

    if (headings.length > state.lastRenderedHeadingCount) {
      requestAnimationFrame(() => {
        list.scrollTop = list.scrollHeight;
      });
    }
    state.lastRenderedHeadingCount = headings.length;
    updateActiveMarker();
  }

  function scheduleRender() {
    window.clearTimeout(state.scheduled);
    state.scheduled = window.setTimeout(render, 120);
  }

  function updateActiveMarker() {
    if (!state.headings.length) {
      return;
    }

    const offset = 96;
    let active = state.headings[0];
    for (const heading of state.headings) {
      if (heading.element.getBoundingClientRect().top <= offset) {
        active = heading;
      } else {
        break;
      }
    }

    if (state.activeHeading === active.element) {
      return;
    }

    state.activeHeading = active.element;
    const list = getList();
    let activeMarker = null;
    list.querySelectorAll(".gpt-paragraph-nav__marker").forEach((marker) => {
      marker.classList.toggle("is-active", marker.dataset.headingId === active.element.id);
      if (marker.dataset.headingId === active.element.id) {
        activeMarker = marker;
      }
    });
    if (activeMarker instanceof HTMLElement) {
      activeMarker.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  function scheduleScrollWork() {
    if (state.scrollScheduled) {
      return;
    }
    state.scrollScheduled = window.requestAnimationFrame(() => {
      state.scrollScheduled = 0;
      updateActiveMarker();
    });
  }

  function start() {
    document.documentElement.setAttribute(DEBUG_ATTR, "loaded:0");
    render();

    state.observer = new MutationObserver(scheduleRender);
    state.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    window.addEventListener("scroll", scheduleScrollWork, { passive: true });
    window.addEventListener("resize", scheduleRender, { passive: true });
    console.info("[GPT Paragraph Navigator] loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
