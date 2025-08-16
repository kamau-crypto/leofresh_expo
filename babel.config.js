module.exports = function (api) {
	api.cache(true);
	return {
		presets: [
			[
				"babel-preset-expo",
				{
					unstable_transformImportMeta: true,
					jsxRuntime: "automatic",
					// Enable tree shaking for ES modules
					modules: false,
				},
			],
		],
		plugins: [
			// Enable tree shaking for lodash
			[
				"babel-plugin-lodash",
				{
					id: ["lodash", "recompose"],
				},
			],
		],
		env: {},
	};
};
