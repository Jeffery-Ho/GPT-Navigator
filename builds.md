# Builds

## Build Rule

- Build number uses plain integers from `1` to `999`, sorted by numeric order.
- Every code or documentation modification must record a new build.
- Bug fix updates the last version segment, for example `0.1.0` to `0.1.1`.
- Feature update updates the middle version segment, for example `0.1.0` to `0.2.0`.
- Major update updates the first version segment, for example `0.1.0` to `1.0.0`.
- Version update type must be declared by the user before recording a build.
- After each build is recorded, confirm the build number and version with the user.

## 38

- Date: 2026-06-07
- Version: 0.10.2
- Summary: README now highlights the latest marker filtering and liquid glass features.
- Notes: Rewrites README into a concise GitHub-facing overview and updates the displayed version.

## 37

- Date: 2026-06-07
- Version: 0.10.1
- Summary: Settings menu controls now follow an Arco Design inspired style.
- Notes: Refines settings input, checkbox, reset button, spacing, text hierarchy, and hover states with Arco-like tokens while retaining the liquid glass menu shell.

## 36

- Date: 2026-06-07
- Version: 0.10.0
- Summary: Settings can filter marker heading levels per platform.
- Notes: Adds per-platform H1/H2/H3 marker type filters in the settings menu, preserves at least one enabled level, and migrates old configs with defaults.

## 35

- Date: 2026-06-07
- Version: 0.9.9
- Summary: Marker list wheel scrolling now uses the plugin maximum width as its hit area.
- Notes: Adds a non-click-blocking wheel hit test across the right-side plugin width so users can scroll the marker list without aiming directly at a marker pill.

## 34

- Date: 2026-06-05
- Version: 0.9.8
- Summary: Settings input focus and reset button strokes are removed.
- Notes: Removes the yellow focused outline from settings inputs and strips the glass outline stroke from the reset button.

## 33

- Date: 2026-06-05
- Version: 0.9.7
- Summary: Settings controls now better match the liquid glass styling.
- Notes: Removes the settings trigger outline stroke, sets settings inputs and reset button to #f5f5f5, and strengthens the settings menu glass material.

## 32

- Date: 2026-06-05
- Version: 0.9.6
- Summary: Marker list content now right-aligns with the collapse button.
- Notes: Keeps a right-side shadow buffer outside the marker content edge so marker pills align with the toggle while glass shadows remain unclipped.

## 31

- Date: 2026-06-05
- Version: 0.9.5
- Summary: Settings button hover now matches the collapse button pale blue state.
- Notes: Reuses the collapse button hover color for the settings trigger to avoid the dark liquid-glass hover.

## 30

- Date: 2026-06-05
- Version: 0.9.4
- Summary: Inactive markers now use a white glass background.
- Notes: Replaces the grey inactive marker fill with a translucent white material to better match liquid glass styling.

## 29

- Date: 2026-06-05
- Version: 0.9.3
- Summary: Settings menu and inputs now participate in the liquid glass material.
- Notes: Adds the menu panel and settings inputs to the per-element liquid glass filter pipeline.

## 28

- Date: 2026-06-05
- Version: 0.9.2
- Summary: Marker list scrolling no longer clips marker glass shadows.
- Notes: Adds a compensated shadow buffer around the marker list scroll area.

## 27

- Date: 2026-06-05
- Version: 0.9.1
- Summary: Liquid glass now follows the nikdelvin data-URL displacement filter approach.
- Notes: Generates per-element SVG displacement filters from element size and observes glass controls with ResizeObserver.

## 26

- Date: 2026-06-05
- Version: 0.9.0
- Summary: Liquid glass styling now uses a local JS-injected SVG filter enhancement.
- Notes: Adds a hidden SVG filter with turbulence, displacement, and blur, while retaining the pure CSS glass fallback and avoiding WebGL, canvas, and third-party dependencies.

## 25

- Date: 2026-06-05
- Version: 0.8.1
- Summary: Marker pills and the collapse toggle no longer show grey outline strokes.
- Notes: Keeps the glass shadow and material blur while removing the 1px border-like stroke from marker and toggle surfaces.

## 24

- Date: 2026-06-05
- Version: 0.8.0
- Summary: Markers and navigation buttons now use pure CSS glass material styling.
- Notes: Adds backdrop blur, saturation, translucent fills, and inner highlights while preserving inactive, hover, and active color semantics.

## 23

- Date: 2026-06-05
- Version: 0.7.8
- Summary: Settings reset hover state now uses marker-like pale blue contrast.
- Notes: Applies the same visible hover/focus color in dark and light menu themes.

## 22

- Date: 2026-06-05
- Version: 0.7.7
- Summary: Active marker list scrolling now persists briefly after marker clicks.
- Notes: Re-applies active marker visibility while the host page settles, without permanently fighting manual marker-list scrolling.

## 21

- Date: 2026-06-05
- Version: 0.7.6
- Summary: Inactive markers now use one consistent default grey background.
- Notes: Removes per-item opacity variation while keeping hover and active colors unchanged.

## 20

- Date: 2026-06-05
- Version: 0.7.5
- Summary: Floating active marker clicks now keep a smooth page scroll effect.
- Notes: Preserves one-click behavior by starting page scrolling before marker-list scrolling and focus updates.

## 19

- Date: 2026-06-05
- Version: 0.7.4
- Summary: Floating active marker clicks now jump the page anchor immediately with one click.
- Notes: Runs the page anchor jump before marker-list scrolling and keeps focus from scrolling the page again.

## 18

- Date: 2026-06-05
- Version: 0.7.3
- Summary: Floating active marker now returns both the marker list and the page anchor to the selected heading.
- Notes: Keeps the selected marker active while off-screen and preserves the floating marker 20pt above the visible marker list bottom.

## 17

- Date: 2026-06-05
- Version: 0.7.2
- Summary: Active marker selection now persists after click and uses the floating marker only when the selected marker leaves the screen.
- Notes: Positions the floating active marker 20pt above the visible marker list bottom.

## 16

- Date: 2026-06-05
- Version: 0.7.1
- Summary: Clicked marker highlighting now stays unique and persists while the marker list is scrolled.
- Notes: Uses internal marker keys for active matching and shows a clickable bottom floating active marker 20pt above the visible list bottom only when the active item is fully outside the browser viewport.

## 15

- Date: 2026-06-04
- Version: 0.7.0
- Summary: Marker lists now default to top-down display from below the page header.
- Notes: Removes automatic bottom scroll when headings are added.

## 14

- Date: 2026-06-04
- Version: 0.6.0
- Summary: Qianwen pages are supported with assistant body H1-H3 markers and first-video title markers.
- Notes: Adds `www.qianwen.com` and `qianwen.com` extension matches.

## 13

- Date: 2026-06-04
- Version: 0.5.0
- Summary: Kimi pages are supported with assistant body H1-H2 markers.
- Notes: Adds `www.kimi.com` and `kimi.com` extension matches while excluding Kimi share page titles from markers.

## 12

- Date: 2026-06-04
- Version: 0.4.0
- Summary: Yuanbao pages are supported with H1-H2 body markers and video big-card title markers.
- Notes: Adds `yb.tencent.com` and `yuanbao.tencent.com` extension matches.

## 11

- Date: 2026-06-04
- Version: 0.3.2
- Summary: Settings menu hover guard keeps the menu open while moving through the left-side blank area.
- Notes: Bug fix for premature menu close when moving from the settings trigger toward the settings menu.

## 7

- Date: 2026-06-03
- Version: 0.1.0
- Summary: MIT license added, changes published to GitHub, and release zip prepared.
- Notes: Release tag is `v0.1.0-build.7`.

## 6

- Date: 2026-06-03
- Version: 0.1.0
- Summary: Version/build text is placed to the right of sync status with `12pt` spacing.
- Notes: Version unchanged because no version update type was declared for this layout adjustment.

## 5

- Date: 2026-06-03
- Version: 0.1.0
- Summary: Settings menu shows the loaded extension version and build.
- Notes: The value comes from Manifest `version_name`.

## 4

- Date: 2026-06-03
- Version: 0.1.0
- Summary: Settings menu is layered above heading markers.
- Notes: Version unchanged because no version update type was declared for this overlay fix.

## 3

- Date: 2026-06-03
- Version: 0.1.0
- Summary: Sync status labels now read `同步已启用` and `同步未启用`.
- Notes: Version unchanged because no version update type was declared for this text-only change.

## 2

- Date: 2026-06-03
- Version: 0.1.0
- Summary: Settings menu shows `chrome.storage.sync` availability status.
- Notes: Green `同步已启用` means sync storage access succeeded; grey `同步未启用` means unavailable or failed.

## 1

- Date: 2026-06-03
- Version: 0.1.0
- Summary: Polaris for Web now persists front-end settings through `chrome.storage.sync`.
- Notes: Reload the unpacked extension in each browser after pulling this code build.
