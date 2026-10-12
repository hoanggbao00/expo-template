import {
  fetch as nitroFetch,
  Headers as NitroHeaders,
  Request as NitroRequest,
  Response as NitroResponse,
} from "react-native-nitro-fetch";

// Faster drop-in replacement for the built-in fetch (Cronet/URLSession-backed).
// See: https://github.com/margelo/react-native-nitro-fetch
globalThis.fetch = nitroFetch as typeof fetch;
globalThis.Headers = NitroHeaders as typeof Headers;
globalThis.Request = NitroRequest as unknown as typeof Request;
globalThis.Response = NitroResponse as unknown as typeof Response;
