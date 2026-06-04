# Builds

## Build Rule

- Build number uses plain integers from `1` to `999`, sorted by numeric order.
- Every code or documentation modification must record a new build.
- Bug fix updates the last version segment, for example `0.1.0` to `0.1.1`.
- Feature update updates the middle version segment, for example `0.1.0` to `0.2.0`.
- Major update updates the first version segment, for example `0.1.0` to `1.0.0`.
- Version update type must be declared by the user before recording a build.
- After each build is recorded, confirm the build number and version with the user.

## 10

- Date: 2026-06-04
- Version: 0.3.1
- Summary: Settings action buttons are restyled with visible dark text and borders on the light settings menu.
- Notes: Fixes `同步设置` and `重置配置` appearing too faint to notice.

## 9

- Date: 2026-06-04
- Version: 0.3.0
- Summary: Settings menu adds `同步设置` to manually reload synced config from `chrome.storage.sync`.
- Notes: This button syncs settings only; source code updates still require Git outside the extension and then reloading the extension.

## 8

- Date: 2026-06-04
- Version: 0.2.0
- Summary: Settings sync is rebuilt around an MV3 background service worker and a fixed Manifest public key for stable unpacked extension IDs.
- Notes: Only the public key is committed; no private key or sensitive user data is stored in the repository.

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
