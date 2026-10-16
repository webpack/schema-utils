#!/usr/bin/env node

/* eslint-disable no-console */

require("../dist/cli")
  .default(process.argv.slice(2), { log: console.log, error: console.error })
  .then((exitCode) => {
    process.exitCode = exitCode;
  });
