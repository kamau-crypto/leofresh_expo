module.exports = function (api) {
    api.cache(true);
    
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            // Only keep essential plugins
            "react-native-paper/babel",
            // Uncomment only if using reanimated
            // "react-native-reanimated/plugin",
        ],
    };
};
