(() => {
  const ROOT_ID = "gpt-paragraph-nav";
  const DEBUG_ATTR = "data-gpt-paragraph-nav";
  const HEADING_SELECTOR = "h1, h2, h3";
  const ROLE_HEADING_SELECTOR = '[role="heading"][aria-level]';
  const STRONG_HEADING_SELECTOR = "p, li";
  const NUMBERED_HEADING_SELECTOR = "p, div";
  const ASSISTANT_MESSAGE_SELECTOR = '[data-message-author-role="assistant"]';
  const DOUBAO_ASSISTANT_MESSAGE_SELECTOR = [
    ".receive-message-box",
    ".receive-message-content-block",
    ".receive-message-content-block-merge",
    '[class*="receive-message-box"]',
    '[class*="receive-message-content-block"]'
  ].join(", ");
  const MARKDOWN_FALLBACK_SELECTOR = [
    "main .markdown",
    '[class*="markdown"]',
    '[class*="md-box"]',
    '[class*="mdbox"]'
  ].join(", ");
  const CONTROLS_CLASS = "gpt-paragraph-nav__controls";
  const SETTINGS_CLASS = "gpt-paragraph-nav__settings";
  const LIST_ID = "gpt-paragraph-nav-list";
  const TOGGLE_ID = "gpt-paragraph-nav-toggle";
  const TOGGLE_LABEL_CLASS = "gpt-paragraph-nav__toggle-label";
  const TOGGLE_CHEVRON_CLASS = "gpt-paragraph-nav__toggle-chevron";
  const MIN_MARKER_OPACITY = 0.28;
  const DEFAULT_HEADER_HEIGHT = 64;
  const {
    CONFIG_STORAGE_KEY,
    CONFIG_FIELDS,
    DEFAULT_CONFIG,
    MESSAGE_TYPES,
    normalizeConfig,
    configsEqual
  } = globalThis.PolarisConfig;
  const CONVERSATION_HEADER_SELECTOR = [
    '[data-testid="conversation-header"]',
    '[data-testid="chat-header"]',
    "main header"
  ].join(", ");

  const state = {
    headings: [],
    conversationMetrics: null,
    activeHeading: null,
    observer: null,
    scheduled: 0,
    scrollScheduled: 0,
    lastDebugSignature: "",
    lastRenderedHeadingCount: 0,
    isCollapsed: false,
    collapsedListHeight: 0,
    syncEnabled: false,
    config: { ...DEFAULT_CONFIG }
  };

  function getRoot() {
    let root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement("div");
      root.id = ROOT_ID;
      root.setAttribute("aria-label", "Polaris for Web paragraph navigation");
      root.setAttribute("role", "navigation");
      document.documentElement.appendChild(root);
    }
    return root;
  }

  function getControls(root = getRoot()) {
    let controls = root.querySelector(`.${CONTROLS_CLASS}`);
    if (!controls) {
      controls = document.createElement("div");
      controls.className = CONTROLS_CLASS;
      root.prepend(controls);
    }
    return controls;
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

  function getToggleButton(root = getRoot()) {
    let button = root.querySelector(`#${TOGGLE_ID}`);
    if (!button) {
      button = document.createElement("button");
      button.id = TOGGLE_ID;
      button.type = "button";
      button.className = "gpt-paragraph-nav__toggle";
      button.addEventListener("click", () => {
        if (!state.isCollapsed) {
          state.collapsedListHeight = getList(root).offsetHeight;
        }
        state.isCollapsed = !state.isCollapsed;
        render();
      });
    }

    if (!button.querySelector(".gpt-paragraph-nav__toggle-icon")) {
      button.textContent = "";

      const icon = document.createElement("img");
      icon.className = "gpt-paragraph-nav__toggle-icon";
      icon.alt = "";
      icon.width = 32;
      icon.height = 32;
      icon.src = chrome.runtime.getURL("icons/gpt-voyager-icon-96.png");
      button.appendChild(icon);

      const label = document.createElement("span");
      label.className = TOGGLE_LABEL_CLASS;
      button.appendChild(label);

      const chevron = document.createElement("span");
      chevron.className = TOGGLE_CHEVRON_CLASS;
      chevron.setAttribute("aria-hidden", "true");
      button.appendChild(chevron);
    }
    getControls(root).appendChild(button);
    return button;
  }

  function getSettings(root = getRoot()) {
    const controls = getControls(root);
    let settings = controls.querySelector(`.${SETTINGS_CLASS}`);
    if (!settings) {
      settings = document.createElement("div");
      settings.className = SETTINGS_CLASS;

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "gpt-paragraph-nav__settings-trigger";
      trigger.textContent = "设置";
      trigger.setAttribute("aria-label", "导航设置");
      settings.appendChild(trigger);

      const menu = document.createElement("div");
      menu.className = "gpt-paragraph-nav__settings-menu";
      menu.setAttribute("role", "menu");

      const meta = document.createElement("div");
      meta.className = "gpt-paragraph-nav__settings-meta";

      const syncStatus = document.createElement("div");
      syncStatus.className = "gpt-paragraph-nav__settings-sync";
      syncStatus.setAttribute("role", "status");
      syncStatus.setAttribute("aria-live", "polite");

      const syncDot = document.createElement("span");
      syncDot.className = "gpt-paragraph-nav__settings-sync-dot";
      syncDot.setAttribute("aria-hidden", "true");
      syncStatus.appendChild(syncDot);

      const syncText = document.createElement("span");
      syncText.className = "gpt-paragraph-nav__settings-sync-text";
      syncStatus.appendChild(syncText);

      meta.appendChild(syncStatus);

      const manifest = chrome.runtime.getManifest();
      const versionStatus = document.createElement("div");
      versionStatus.className = "gpt-paragraph-nav__settings-version";
      versionStatus.textContent = manifest.version_name || `v${manifest.version}`;
      meta.appendChild(versionStatus);
      menu.appendChild(meta);

      CONFIG_FIELDS.forEach((field) => {
        const row = document.createElement("label");
        row.className = "gpt-paragraph-nav__settings-row";

        const label = document.createElement("span");
        label.textContent = field.label;
        row.appendChild(label);

        const input = document.createElement("input");
        input.type = "number";
        input.min = String(field.min);
        input.max = String(field.max);
        input.step = String(field.step);
        input.dataset.configKey = field.key;
        input.addEventListener("input", () => {
          state.config = normalizeConfig({
            ...state.config,
            [field.key]: input.value
          });
          saveConfig(state.config);
          syncSettingsInputs(settings);
          render();
        });
        row.appendChild(input);

        if (field.unit) {
          const unit = document.createElement("span");
          unit.className = "gpt-paragraph-nav__settings-unit";
          unit.textContent = field.unit;
          row.appendChild(unit);
        }

        menu.appendChild(row);
      });

      const actionGroup = document.createElement("div");
      actionGroup.className = "gpt-paragraph-nav__settings-actions";

      const syncButton = document.createElement("button");
      syncButton.type = "button";
      syncButton.className = "gpt-paragraph-nav__settings-action";
      syncButton.textContent = "同步设置";
      syncButton.addEventListener("click", async () => {
        syncButton.disabled = true;
        const nextConfig = await loadConfig();
        state.config = normalizeConfig(nextConfig);
        syncSettingsInputs(settings);
        render();
        syncButton.disabled = false;
      });
      actionGroup.appendChild(syncButton);

      const resetButton = document.createElement("button");
      resetButton.type = "button";
      resetButton.className = "gpt-paragraph-nav__settings-action";
      resetButton.textContent = "重置配置";
      resetButton.addEventListener("click", () => {
        state.config = { ...DEFAULT_CONFIG };
        saveConfig(state.config);
        syncSettingsInputs(settings);
        render();
      });
      actionGroup.appendChild(resetButton);
      menu.appendChild(actionGroup);

      settings.appendChild(menu);
      controls.prepend(settings);
    }

    syncSettingsStatus(settings);
    syncSettingsInputs(settings);
    return settings;
  }

  function setSyncEnabled(isEnabled) {
    state.syncEnabled = isEnabled;
    const settings = document.querySelector(`#${ROOT_ID} .${SETTINGS_CLASS}`);
    if (settings) {
      syncSettingsStatus(settings);
    }
  }

  function syncSettingsStatus(settings) {
    const status = settings.querySelector(".gpt-paragraph-nav__settings-sync");
    const text = settings.querySelector(".gpt-paragraph-nav__settings-sync-text");
    if (!status || !text) {
      return;
    }

    status.classList.toggle("is-enabled", state.syncEnabled);
    text.textContent = state.syncEnabled ? "同步已启用" : "同步未启用";
  }

  function loadLegacyConfig() {
    try {
      const rawConfig = window.localStorage.getItem(CONFIG_STORAGE_KEY);
      return rawConfig ? normalizeConfig(JSON.parse(rawConfig)) : null;
    } catch {
      return null;
    }
  }

  function sendConfigMessage(message) {
    if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.sendMessage) {
      setSyncEnabled(false);
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          setSyncEnabled(false);
          console.warn("[Polaris for Web] config background message failed", chrome.runtime.lastError);
          resolve(null);
          return;
        }

        setSyncEnabled(Boolean(response && response.syncEnabled));
        resolve(response || null);
      });
    });
  }

  async function loadConfig() {
    const legacyConfig = loadLegacyConfig();
    const response = await sendConfigMessage({
      type: MESSAGE_TYPES.GET_CONFIG,
      legacyConfig
    });

    if (response && response.config) {
      return normalizeConfig(response.config);
    }

    if (legacyConfig) {
      return legacyConfig;
    }

    return { ...DEFAULT_CONFIG };
  }

  function saveConfig(config) {
    sendConfigMessage({
      type: MESSAGE_TYPES.SET_CONFIG,
      config
    });
  }

  function watchConfigChanges() {
    if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.onMessage) {
      setSyncEnabled(false);
      return;
    }

    chrome.runtime.onMessage.addListener((message) => {
      if (!message || message.type !== MESSAGE_TYPES.CONFIG_CHANGED) {
        return;
      }

      setSyncEnabled(Boolean(message.syncEnabled));
      const nextConfig = normalizeConfig(message.config);
      if (configsEqual(state.config, nextConfig)) {
        return;
      }

      state.config = nextConfig;
      render();
    });
  }

  function syncSettingsInputs(settings) {
    settings.querySelectorAll("input[data-config-key]").forEach((input) => {
      const key = input.dataset.configKey;
      if (document.activeElement !== input && key in state.config) {
        input.value = String(state.config[key]);
      }
    });
  }

  function applyConfig(root) {
    root.style.setProperty("--gpt-nav-top-gap", `${state.config.topGap}px`);
    root.style.setProperty("--gpt-nav-right-offset", `${state.config.rightOffset}px`);
    root.style.setProperty("--gpt-nav-width", `calc(100vw - ${state.config.rightOffset * 2}px)`);
    root.style.setProperty("--gpt-nav-tooltip-max-width", `${state.config.tooltipMaxWidth}px`);
  }

  function isVisible(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  }

  function getConversationHeaderHeight() {
    const headers = Array.from(document.querySelectorAll(CONVERSATION_HEADER_SELECTOR))
      .filter((header) => header instanceof HTMLElement && isVisible(header))
      .map((header) => header.getBoundingClientRect())
      .filter((rect) => rect.top <= 4 && rect.bottom > 0);

    if (!headers.length) {
      return DEFAULT_HEADER_HEIGHT;
    }

    return Math.round(Math.max(...headers.map((rect) => rect.height)));
  }

  function updateHeaderOffset(root) {
    root.style.setProperty("--gpt-conversation-header-height", `${getConversationHeaderHeight()}px`);
  }

  function isDoubaoPage() {
    return window.location.hostname === "www.doubao.com" || window.location.hostname.endsWith(".doubao.com");
  }

  function getAssistantContainerSelectors() {
    return isDoubaoPage()
      ? [DOUBAO_ASSISTANT_MESSAGE_SELECTOR, ASSISTANT_MESSAGE_SELECTOR, MARKDOWN_FALLBACK_SELECTOR]
      : [ASSISTANT_MESSAGE_SELECTOR, MARKDOWN_FALLBACK_SELECTOR];
  }

  function getAssistantContainers() {
    for (const selector of getAssistantContainerSelectors()) {
      const containers = Array.from(document.querySelectorAll(selector))
        .filter((node) => node instanceof HTMLElement && isVisible(node));
      if (containers.length > 0) {
        return containers;
      }
    }

    return [];
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
    if (/^H[1-3]$/.test(element.tagName)) {
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
    const match = text.match(/^(#{1,3})\s+\S/);
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
    console.info("[Polaris for Web] scan", {
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
    applyConfig(root);
    updateHeaderOffset(root);
    getSettings(root);
    const list = getList(root);
    const toggle = getToggleButton(root);
    const containers = getAssistantContainers();
    const headings = collectHeadings();
    const metrics = getConversationMetrics(containers);
    ensureHeadingIds(headings);
    state.headings = headings;
    state.conversationMetrics = metrics;
    document.documentElement.setAttribute(DEBUG_ATTR, `loaded:${headings.length}:${Math.round(metrics.length)}`);
    root.style.setProperty("--queue-visible-count", String(Math.min(headings.length || 1, state.config.maxVisible)));

    root.classList.toggle("is-empty", headings.length === 0);
    root.classList.toggle("is-collapsed", state.isCollapsed && headings.length > 0);
    toggle.hidden = headings.length === 0;
    toggle.querySelector(`.${TOGGLE_LABEL_CLASS}`).textContent = state.isCollapsed ? "展开全部" : "收起全部";
    toggle.setAttribute("aria-expanded", String(!state.isCollapsed));
    list.style.height = state.isCollapsed && state.collapsedListHeight > 0 ? `${state.collapsedListHeight}px` : "";
    list.setAttribute("aria-hidden", String(state.isCollapsed));
    list.textContent = "";

    if (state.isCollapsed) {
      state.lastRenderedHeadingCount = headings.length;
      return;
    }

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
    requestAnimationFrame(() => {
      state.collapsedListHeight = list.offsetHeight;
    });
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

  async function start() {
    document.documentElement.setAttribute(DEBUG_ATTR, "loaded:0");
    state.config = await loadConfig();
    watchConfigChanges();
    render();

    state.observer = new MutationObserver(scheduleRender);
    state.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    window.addEventListener("scroll", scheduleScrollWork, { passive: true });
    window.addEventListener("resize", scheduleRender, { passive: true });
    console.info("[Polaris for Web] loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
