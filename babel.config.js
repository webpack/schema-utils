const SUPPORTED_BABEL_VERSIONS = "^7.0.0 || ^8.0.0";

module.exports = (api) => {
  api.assertVersion(SUPPORTED_BABEL_VERSIONS);
  api.cache(true);

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          // The package is CommonJS - Babel 8 keeps ECMAScript modules by default when the
          // caller does not say what it supports, which `@babel/cli` does not
          modules: "commonjs",
          targets: {
            node: "10.13.0",
          },
        },
      ],
    ],
  };
};
