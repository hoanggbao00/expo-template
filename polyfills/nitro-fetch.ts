// Faster drop-in replacement for the built-in fetch (Cronet/URLSession-backed).
// See: https://github.com/margelo/react-native-nitro-fetch
// `require` inside try/catch (not a static import) so a missing/broken native module cannot crash
// at startup, and the globals are patched as a group so a failure never leaves a half-patched fetch stack.
try {
  const nitro = require("react-native-nitro-fetch") as typeof import("react-native-nitro-fetch");
  const patched = {
    fetch: nitro.fetch as typeof fetch,
    Headers: nitro.Headers as typeof Headers,
    Request: nitro.Request as unknown as typeof Request,
    Response: nitro.Response as unknown as typeof Response,
  };
  if (Object.values(patched).every(Boolean)) Object.assign(globalThis, patched);
} catch {
  // Keep the built-in fetch if the native module is unavailable.
}
