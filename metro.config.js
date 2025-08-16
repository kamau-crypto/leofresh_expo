const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enhanced transformer configuration
config.transformer = {
	...config.transformer,
	minifierPath: require.resolve("metro-minify-esbuild"),
	minifierConfig: {
		...config.transformer.minifierConfig,
		// Enable dead code elimination
		dead_code: true,
		// Remove unused imports
		drop_console: process.env.NODE_ENV === "production", // Set to true in production to remove console.logs
		// Enable function inlining
		inline: 3,
		// Remove unused variables
		unused: true,
		// Enable constant folding
		evaluate: true,
		// Enable property access optimization
		properties: true,
		// Enable sequence optimization
		sequences: true,
		// Enable conditional optimization
		conditionals: true,
		// Enable comparison optimization
		comparisons: true,
		// Enable boolean optimization
		booleans: true,
		// Enable loop optimization
		loops: true,
		// Enable if-return optimization
		if_return: true,
		// Enable join variable declarations
		join_vars: true,
		// Enable cascade optimization
		cascade: true,
		// Enable side effect optimization
		side_effects: true,
		// Enable pure getters optimization
		pure_getters: true,
		// Enable unsafe optimizations (be careful with this)
		unsafe: false,
		// Enable unsafe comparisons
		unsafe_comps: false,
		treeShaking: true,
		// Enhanced tree shaking for common libraries
		pure_funcs: [
			"console.log",
			"console.info",
			"console.debug",
			"console.warn",
		],
	},
	getTransformOptions: async () => ({
		transform: {
			experimentalImportSupport: true,
			inlineRequires: true, // Enable inline requires optimization
		},
	}),
};

// Enhanced resolver configuration
config.resolver = {
	...config.resolver,
	// Enable symlinks resolution
	symlinks: true,
	// Prefer ES modules for better tree shaking
	resolverMainFields: ["react-native", "browser", "main"],
	// Enable platform-specific extensions
	platforms: ["ios", "android", "native", "web"],
	// Add cache configuration
	useWatchman: true,
	// Add specific extensions to resolve
	sourceExts: ["js", "jsx", "ts", "tsx", "json"],
	// Add asset extensions
	assetExts: ["png", "jpg", "jpeg", "gif", "webp", "mp4", "ttf", "otf"],
};

// Production optimizations
if (process.env.NODE_ENV === "production") {
	config.transformer.minifierConfig = {
		...config.transformer.minifierConfig,
		drop_console: true, // Remove console.logs in production
		drop_debugger: true, // Remove debugger statements
		pure_funcs: [
			"console.log",
			"console.info",
			"console.debug",
			"console.warn",
			"console.error",
		],
		mangle: {
			toplevel: true, // More aggressive name mangling
			keep_classnames: false,
			keep_fnames: false,
		},
	};

	// Enable caching in production
	config.cacheStores = [
		{
			type: "file",
		},
	];
}

module.exports = config;
