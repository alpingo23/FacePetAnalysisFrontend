// If text-encoding doesn't work, you can create a custom polyfill in a file called textPolyfill.js

// textPolyfill.js
class CustomTextEncoder {
    encode(string) {
      const utf8 = unescape(encodeURIComponent(string));
      const result = new Uint8Array(utf8.length);
      for (let i = 0; i < utf8.length; i++) {
        result[i] = utf8.charCodeAt(i);
      }
      return result;
    }
  }
  
  class CustomTextDecoder {
    decode(bytes) {
      const chars = [];
      for (let i = 0; i < bytes.length; i++) {
        chars.push(String.fromCharCode(bytes[i]));
      }
      return decodeURIComponent(escape(chars.join('')));
    }
  }
  
  // Export the polyfills
  export const TextEncoder = typeof global.TextEncoder !== 'undefined' ? global.TextEncoder : CustomTextEncoder;
  export const TextDecoder = typeof global.TextDecoder !== 'undefined' ? global.TextDecoder : CustomTextDecoder;
  
  // Then in your index.js file:
  /*
  import { TextEncoder, TextDecoder } from './textPolyfill';
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  */