const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push('cjs'); // 🔄 Firebase usa .cjs internamente

// 🛠️ Aquí el fix importante:
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
