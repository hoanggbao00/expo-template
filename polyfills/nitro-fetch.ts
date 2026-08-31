import {fetch as nitroFetch, Headers as NitroHeaders, Request as NitroRequest, Response as NitroResponse} from 'react-native-nitro-fetch';
 
globalThis.fetch = nitroFetch;
globalThis.Headers = NitroHeaders;
globalThis.Request = NitroRequest;
globalThis.Response = NitroResponse;