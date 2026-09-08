/** @type {import("jest").Config} */
const config = {
  // Jest 29 changed these defaults, they are set explicitly so the snapshots match the ones the
  // older Jest CI installs for the older versions of Node.js writes
  snapshotFormat: {
    escapeString: false,
    printBasicPrototype: false,
  },
};

module.exports = config;
