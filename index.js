// index.js
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// TextEncoder/TextDecoder polyfill (axios için gerekli olabilir)
import { TextEncoder, TextDecoder } from 'fast-text-encoding';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

AppRegistry.registerComponent(appName, () => App);