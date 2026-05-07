# RB-M004 — Hardest Decision

**What was the hardest decision here?**

How to implement "share QR as image" without a server-side render step.

Three approaches considered:

1. **Server-side image generation** — generate the QR PNG on the middleware, cache it, return a URL the app can pass to the share sheet. Clean for the share UX (just a URL), but adds backend complexity, requires storage, and the middleware has no reason to own image generation.

2. **SVG-to-PNG in JavaScript** — `react-native-qrcode-svg` renders SVG; there are libraries to convert SVG strings to PNG data URIs client-side. Fragile across RN versions and adds a large dependency for a narrow use case.

3. **Capture the rendered view** — `react-native-view-shot`'s `captureRef` takes a screenshot of the QR `View` as a PNG file. Works entirely on-device, no extra server calls, captures exactly what the user sees. The tradeoff is that the capture is async (100–200 ms on device) and requires a `ref` on the view with `collapsable={false}` to prevent Android from flattening it.

Chose option 3. `collapsable={false}` is the non-obvious required prop — without it, Android's view flattening optimization removes the node before `captureRef` can read it, producing either a blank image or a crash. The `collapsable` prop is documented but easy to miss.

**Share split:** two separate buttons ("Share link" / "Share QR image") rather than a single button that opens a menu. A menu would require a custom modal or action sheet; two buttons at the same visual weight are simpler, require no extra package, and are immediately scannable on a short screen.

**Permission timing:** `MediaLibrary.requestPermissionsAsync()` is called at the moment the user taps "Save to photos," not on mount. Requesting permissions on mount before the user has shown intent to save creates unnecessary friction and is rejected by both App Store and Play Store review guidelines.
