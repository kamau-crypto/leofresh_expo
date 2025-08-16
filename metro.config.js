const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable tree shaking optimizations
config.transformer = {
  ...config.transformer,
  minifierPath: require.resolve("metro-minify-esbuild"),
  minifierConfig: {
    // Enable dead code elimination
    dead_code: true,
    // Remove unused imports
    drop_console: true, // Set to true in production to remove console.logs
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
    // Enable pure function calls optimization
    pure_funcs: [],
    // Enable pure getters optimization
    pure_getters: true,
    // Enable unsafe optimizations (be careful with this)
    unsafe: false,
    // Enable unsafe comparisons
    unsafe_comps: false,
    treeShaking: true,
    // Enable unsafe function optimization
    unsafe_Function: false,
    // Enable unsafe math optimization
    unsafe_math: false,
    // Enable unsafe methods optimization
    unsafe_methods: false,
    // Enable unsafe proto optimization
    unsafe_proto: false,
    // Enable unsafe regexp optimization
    unsafe_regexp: false,
    // Enable unsafe undefined optimization
    unsafe_undefined: false,
  },
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: true,
    },
  }),
};

// Configure resolver for better tree shaking
config.resolver = {
  ...config.resolver,
  // Enable symlinks resolution
  symlinks: true,
  // Prefer ES modules for better tree shaking
  resolverMainFields: ["react-native", "browser", "main"],
  // Enable platform-specific extensions
  platforms: ["ios", "android", "native", "web"],
};

// Production-specific optimizations
if (process.env.NODE_ENV === "production") {
  // Enable more aggressive minification in production
  config.transformer.minifierConfig = {
    ...config.transformer.minifierConfig,
    drop_console: true, // Remove console.logs in production
    drop_debugger: true, // Remove debugger statements
    pure_funcs: [
      "console.log",
      "console.info",
      "console.debug",
      "console.warn",
    ],
  };
}

module.exports = config;
