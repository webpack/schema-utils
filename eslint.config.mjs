import { defineConfig } from "eslint/config";
import configs from "eslint-config-webpack/configs.js";

export default defineConfig([
  {
    extends: [configs["recommended-dirty"]],
    rules: {
      "n/prefer-node-protocol": "off",
    },
  },
  {
    files: ["bin/**/*.js"],
    rules: {
      // Node.js has always skipped the hashbang of the file it runs
      "n/no-unsupported-features/es-syntax": [
        "error",
        { ignores: ["hashbang"] },
      ],
    },
  },
]);
