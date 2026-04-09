# Device Compatibility Strategy

## Objective
Make the site usable and stable across modern browsers, old iOS Safari, and old Android WebViews without sacrificing the current full experience on capable devices.

## Guiding Principles
- Keep the original experience intact for modern devices.
- Add graceful fallback paths for weak or legacy environments.
- Prefer capability detection over browser-name checks.
- Reduce runtime errors first, then optimize performance.

## Delivery Model
Use two entries:
- index.html: full feature version (current experience).
- index-adaptive.html: reduced/safe version for legacy devices.

Optional server-side routing in server.js:
- Route / to index-adaptive.html when user-agent is clearly legacy.
- Serve index.html otherwise.

Manual fallback must always remain available:
- /index-adaptive.html for direct access and QA testing.

## Compatibility Risks Identified
1. ES module-only dependency boot path.
2. Optional chaining usage in runtime code.
3. CSS and JS usage of :has selectors.
4. Heavy animation loops and physics cost on low-power devices.
5. Audio autoplay/gesture restrictions on iOS.
6. Dependence on external CDNs (fonts/libs) in unstable networks.

## Strategy by Layer
### 1) JavaScript Safety Layer
- Replace optional chaining in critical paths with defensive checks.
- Wrap non-essential feature blocks in try/catch guards.
- Add a global fail-safe logger for recoverable UI errors.

### 2) CSS Fallback Layer
- Remove hard dependency on :has by toggling helper classes via JS.
- Keep older-safe CSS equivalents before advanced selectors.
- Limit expensive visual effects in adaptive mode.

### 3) Runtime Feature Detection
On startup, compute a capability profile.

Suggested checks:
- Supports modules.
- Supports modern selectors used by the app.
- Supports requestAnimationFrame smoothly.
- Hardware/memory hints where available.

Profile levels:
- full: all effects and interactions enabled.
- reduced: disable expensive loops and visual effects.
- safe: minimal interactions, no physics-heavy behavior.

### 4) Adaptive Experience Rules
In index-adaptive.html:
- Disable or simplify:
  - physics-based falling cakes,
  - continuous laser/raycast loops,
  - heavy particle trails,
  - high-frequency mouse effects.
- Keep core content and navigation:
  - modals,
  - galleries,
  - contact and order forms,
  - essential audio only after explicit user interaction.

### 5) Asset and Dependency Hardening
- Preconnect to required CDNs.
- Add fallback font stack if Google Fonts fail.
- Consider bundling critical libraries locally (especially physics dependency).
- Lazy-load non-critical assets.

### 6) Audio Policy Compliance
- Start all audio only after user gesture.
- Handle play() promise rejections silently with UI state update.
- In safe mode, default to muted until explicitly enabled.

## Implementation Plan
### Phase 1: Stabilize Core
- Remove legacy-breaking syntax from startup code.
- Replace :has-dependent logic with class toggles.
- Add error guards around optional effects.

### Phase 2: Build Adaptive Entry
- Create index-adaptive.html as reduced/safe profile baseline.
- Share same content structure, but strip expensive effects.
- Keep CSS overrides in a dedicated adaptive block/file.

### Phase 3: Detection + Routing
- Add capability detector in both entries.
- Optional: add UA-assisted server routing in server.js.
- Keep manual override query support:
  - ?mode=full
  - ?mode=reduced
  - ?mode=safe

### Phase 4: Verify and Tune
- Test on real legacy devices when possible.
- Tune thresholds for reduced/safe profile.
- Log observed failures and patch progressively.

## Minimum Test Matrix
### Browsers/Platforms
- iOS Safari 12+
- Android WebView (older OEM versions)
- Chrome (latest)
- Safari (latest)
- Firefox (latest)

### Scenarios
- First load on slow network.
- Modal open/close loops.
- Tattoo lightbox open/close and escape paths.
- Contact and cake form navigation/submission.
- Audio toggle and first user gesture behavior.
- Orientation changes and resize handling.

## Success Criteria
- No startup crash on legacy targets.
- Core navigation and forms work on all target devices.
- Legacy devices maintain stable frame rate with reduced/safe profile.
- Modern devices keep current full experience unchanged.

## Recommended File Additions
- index-adaptive.html
- adaptive.css (or adaptive overrides section)
- capability.js (shared detection/profile logic)
- optional: route logic update in server.js

## Notes
This strategy is intentionally non-destructive: it preserves your existing index.html behavior and adds an adaptive lane for compatibility and resilience.
