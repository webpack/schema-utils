const Ajv = require('ajv');
const errors = require('ajv-errors');
const keywords = require('ajv-keywords');

const ajv = new Ajv({
  allErrors: true,
  jsonPointers: true,
});
errors(ajv);
keywords(ajv, ['instanceof', 'typeof']);

module.exports = ajv;
