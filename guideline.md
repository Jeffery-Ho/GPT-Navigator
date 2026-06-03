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

## Toggle Button Rule

- The collapse toggle should include the extension icon in a 32px shell, using a 96px image resource for high-density displays.
- Keep the icon decorative for assistive technology; the button label comes from the action text and `aria-expanded`.
- Keep the collapse toggle background in a pale blue, Polaris-like tone, separate from the settings trigger color.

## Config Storage Rule

- Persist front-end settings in `chrome.storage.sync` with `gpt-paragraph-nav-config`.
- Use one shared config for all supported sites.
- When sync config is empty, migrate valid legacy `localStorage` config without deleting the legacy value.
