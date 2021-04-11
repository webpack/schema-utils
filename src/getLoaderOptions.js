/* eslint-disable no-param-reassign */

const querystring = require('querystring');

const parseJson = require('json-parse-better-errors');

const { validate } = require('./validate');

/**
 * Parses the loader option if necessary, and validates it.
 *
 * @param {string | object | null | undefined} options a raw object, a JSON string, or a query string representing a loader option
 * @param {import("./validate").Schema | null | undefined} schema a schema to validate the option against
 * @return {object} the parsed loader option
 */
module.exports.getLoaderOptions = function getLoaderOptions(options, schema) {
  if (typeof options === 'string') {
    if (options.substr(0, 1) === '{' && options.substr(-1) === '}') {
      try {
        options = parseJson(options);
      } catch (e) {
        throw new Error(`Cannot parse string options: ${e.message}`);
      }
    } else {
      options = querystring.parse(options, '&', '=', {
        maxKeys: 0,
      });
    }
  }

  // eslint-disable-next-line no-undefined
  if (options === null || options === undefined) {
    options = {};
  }

  if (schema) {
    let name = 'Loader';
    let baseDataPath = 'options';
    let match;
    // eslint-disable-next-line no-cond-assign
    if (schema.title && (match = /^(.+) (.+)$/.exec(schema.title))) {
      [, name, baseDataPath] = match;
    }
    // @ts-expect-error
    validate(schema, options, {
      name,
      baseDataPath,
    });
  }

  // @ts-expect-error
  return options;
};
