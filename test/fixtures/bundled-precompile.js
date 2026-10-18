const { precompile } = require("../../src");

precompile({ type: "string", minLength: 1 }, { minify: true }).then(
  (code) => {
    const check = { exports: {} };

    // eslint-disable-next-line no-new-func
    new Function("module", code)(check);
    process.stdout.write(JSON.stringify([check.exports(""), check.exports("a")]));
  },
);
