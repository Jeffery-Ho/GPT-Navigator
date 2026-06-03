# Polaris for Web Guidelines

## Heading Marker Rule

- Only recognize and render `gpt-paragraph-nav__marker level-1`, `level-2`, and `level-3`.
- Do not recognize, count, or render `level-4` markers.
- `usableHeadings` must contain only heading items whose `level <= 3`.
- Future changes to heading extraction must preserve this rule unless the user explicitly asks to change it.

## Assistant Container Rule

- Detect the current chat site from `window.location.hostname`.
- Do not add a manual UI switch for choosing the assistant container source.
- Use site-specific assistant containers first, then fall back to generic Markdown containers.

## Floating Tooltip Rule

- The right-side navigation container must leave enough horizontal room for marker tooltips.
- Do not constrain the list to marker width if tooltip labels need to extend left into the page.
- Transparent layout space must not block clicks in the ChatGPT content area.
- Keep marker hover in a pale blue tone, and marker selected state in a stronger blue, not orange.
- Keep the settings menu layered above heading markers.

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
