const USAGE = `Usage: schema-utils precompile [--check] <schema.json>...

Compiles every schema into a check next to it, \`options.json\` into \`options.check.js\`,
for the fourth argument of \`validate\`:

  validate(schema, options, configuration, require("./options.check.js"));

The check is an ES module when the nearest package.json has "type": "module",
the way Node.js reads a .js file there, and a CommonJS module otherwise:

  import check from "./options.check.js";

  validate(schema, options, configuration, check);

Options:
  --check  write nothing, fail when a check is missing or out of date`;

/**
 * @param {string} schemaPath path of the schema
 * @returns {string} path of its check
 */
function getCheckPath(schemaPath) {
  return `${schemaPath.replace(/\.json$/i, "")}.check.js`;
}

/**
 * @param {string} file path of a `.js` file
 * @returns {boolean} whether Node.js loads it as an ES module
 */
function isModule(file) {
  const fs = require("fs");
  const path = require("path");

  let dir = path.dirname(file);

  for (;;) {
    let content;

    try {
      content = fs.readFileSync(path.join(dir, "package.json"), "utf8");
    } catch (_err) {
      // No package.json here, look further up
    }

    if (typeof content !== "undefined") {
      try {
        return JSON.parse(content).type === "module";
      } catch (_err) {
        return false;
      }
    }

    const parent = path.dirname(dir);

    if (parent === dir) {
      return false;
    }

    dir = parent;
  }
}

/**
 * @param {string} content content
 * @returns {string} content with LF line endings and without trailing whitespace
 */
function normalize(content) {
  return content.replace(/\r\n?/g, "\n").trim();
}

/**
 * @typedef {object} CliIO
 * @property {(message: string) => void} log prints a message
 * @property {(message: string) => void} error prints an error
 */

/**
 * Runs the command line interface.
 * @param {string[]} args arguments without `node` and the script
 * @param {CliIO} io where the output goes
 * @returns {Promise<number>} exit code
 */
async function cli(args, io) {
  const [command, ...rest] = args;

  if (command === "--help" || command === "-h") {
    io.log(USAGE);

    return 0;
  }

  if (command !== "precompile") {
    io.error(command ? `Unknown command "${command}"\n\n${USAGE}` : USAGE);

    return 1;
  }

  const check = rest.includes("--check");
  const files = rest.filter((arg) => arg !== "--check");
  const unknown = files.find((arg) => arg.startsWith("-"));

  if (unknown) {
    io.error(`Unknown option "${unknown}"\n\n${USAGE}`);

    return 1;
  }

  if (files.length === 0) {
    io.error(`No schema given\n\n${USAGE}`);

    return 1;
  }

  const fs = require("fs");
  const path = require("path");
  const { pathToFileURL } = require("url");
  const precompile = require("./precompile").default;

  let exitCode = 0;

  for (const file of files) {
    const schemaPath = path.resolve(file);
    const checkPath = getCheckPath(schemaPath);
    const relativeCheckPath = path.relative(process.cwd(), checkPath);

    let code;

    try {
      const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

      // A relative `$ref` to another file resolves against the schema itself
      if (typeof schema.$id === "undefined") {
        schema.$id = pathToFileURL(schemaPath).href;
      }

      code = await precompile(schema, { esm: isModule(checkPath) });
    } catch (error) {
      io.error(
        `Cannot precompile "${file}": ${/** @type {Error} */ (error).message}`,
      );
      exitCode = 1;
      continue;
    }

    let current;

    try {
      current = fs.readFileSync(checkPath, "utf8");
    } catch (_err) {
      // Not generated yet
    }

    if (
      typeof current !== "undefined" &&
      normalize(current) === normalize(code)
    ) {
      continue;
    }

    if (check) {
      io.error(
        `"${relativeCheckPath}" is ${
          typeof current === "undefined" ? "missing" : "out of date"
        }, run "schema-utils precompile ${file}"`,
      );
      exitCode = 1;
      continue;
    }

    fs.writeFileSync(checkPath, `${code}\n`);
    io.log(`"${relativeCheckPath}" updated`);
  }

  return exitCode;
}

export default cli;
