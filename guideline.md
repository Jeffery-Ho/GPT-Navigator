# GPT Paragraph Navigator Guidelines

## Heading Marker Rule

- Only recognize and render `gpt-paragraph-nav__marker level-1`.
- Do not recognize, count, or render `level-2`, `level-3`, or `level-4` markers.
- `usableHeadings` must contain only heading items whose `level === 1`.
- Future changes to heading extraction must preserve this rule unless the user explicitly asks to change it.

## Floating Tooltip Rule

- The right-side navigation container must leave enough horizontal room for marker tooltips.
- Do not constrain the list to marker width if tooltip labels need to extend left into the page.
- Transparent layout space must not block clicks in the ChatGPT content area.

## Toggle Button Rule

- The collapse toggle should include the extension icon in a 32px shell, using a 96px image resource for high-density displays.
- Keep the icon decorative for assistive technology; the button label comes from the action text and `aria-expanded`.
