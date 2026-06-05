# Polaris for Web Guidelines

## Heading Marker Rule

- Only recognize and render `gpt-paragraph-nav__marker level-1`, `level-2`, and `level-3`.
- Do not recognize, count, or render `level-4` markers.
- `usableHeadings` must contain only heading items whose `level <= 3`.
- Future changes to heading extraction must preserve this rule unless the user explicitly asks to change it.
- Kimi pages must only render assistant Markdown body headings up to `H2`.
- Kimi share page titles such as `.share-title` must not render as markers.
- Qianwen pages may render assistant Markdown body headings up to `H3`.
- Qianwen video lists may render one `level-2` marker using the first visible video title only.
- Yuanbao pages must only render Markdown body headings up to `H2`.
- Yuanbao video big-card titles may render as `level-2` markers.

## Assistant Container Rule

- Detect the current chat site from `window.location.hostname`.
- Do not add a manual UI switch for choosing the assistant container source.
- Use site-specific assistant containers first, then fall back to generic Markdown containers.
- On Kimi, prefer assistant containers under `.segment-assistant .markdown`.
- On Qianwen, prefer assistant containers under `[class*="message-select-wrapper-answer"] .qk-markdown`.
- On Yuanbao, prefer AI response containers under `data-conv-speaker="ai"` and include `hyc-common-markdown` content plus video big-card titles.

## Floating Tooltip Rule

- The marker list must default to top-down display from below the page header.
- Do not auto-scroll the marker list to the bottom during initial render or heading growth.
- The right-side navigation container must leave enough horizontal room for marker tooltips.
- Do not constrain the list to marker width if tooltip labels need to extend left into the page.
- Transparent layout space must not block clicks in the ChatGPT content area.
- Keep marker hover in a pale blue tone, and marker selected state in a stronger blue, not orange.
- Only the clicked active marker may use the selected blue state.
- Active marker matching must use an internal marker key, not the heading DOM id.
- Marker focus must not add a separate visual highlight.
- If the active marker is fully outside the browser viewport, show one clickable floating active marker 20pt above the bottom of the visible marker list.
- Clicking the floating active marker must return the marker list to the selected marker and jump the page anchor to the selected heading.
- Floating active marker clicks must start page anchor scrolling before scrolling or focusing the marker list.
- Keep the settings menu layered above heading markers.
- The settings menu may use a limited transparent hover guard while open; it must not intercept page clicks when the menu is closed.

## Toggle Button Rule

- The collapse toggle should include the extension icon in a 32px shell, using a 96px image resource for high-density displays.
- Keep the icon decorative for assistive technology; the button label comes from the action text and `aria-expanded`.
- Keep the collapse toggle background in a pale blue, Polaris-like tone, separate from the settings trigger color.

## Config Storage Rule

- Persist front-end settings in `chrome.storage.sync` with `gpt-paragraph-nav-config`.
- Use one shared config for all supported sites.
- Show sync status in the settings menu: green dot with `同步已启用` after successful sync storage access, grey dot with `同步未启用` when unavailable or failed.
- Show the loaded extension `version_name` in the settings menu as read-only version/build information.
- Place version/build text to the right of sync status with `12pt` spacing.
- When sync config is empty, migrate valid legacy `localStorage` config without deleting the legacy value.

## Version And Build Rule

- Build number uses plain integers from `1` to `999`, sorted by numeric order.
- Every code or documentation modification must record a new build.
- Bug fix updates the last version segment, feature update updates the middle segment, and major update updates the first segment.
- Ask the user to declare the update type before changing the version.
- After each build is recorded, confirm the build number and version with the user.
