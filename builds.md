# Builds

## Build Rule

- Build number uses plain integers from `1` to `999`, sorted by numeric order.
- Every code or documentation modification must record a new build.
- Bug fix updates the last version segment, for example `0.1.0` to `0.1.1`.
- Feature update updates the middle version segment, for example `0.1.0` to `0.2.0`.
- Major update updates the first version segment, for example `0.1.0` to `1.0.0`.
- Version update type must be declared by the user before recording a build.
- After each build is recorded, confirm the build number and version with the user.

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
