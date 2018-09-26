/* eslint-disable
  strict,
  no-param-reassign
*/

'use strict';

class ValidationError extends Error {
  constructor(errors, name) {
    super();

    this.name = 'ValidationError';

    this.message = `${name || ''} Invalid Options\n\n`;

    this.errors = errors.map((err) => {
      err.dataPath = err.dataPath.replace(/\//g, '.');

      return err;
    });

    this.errors.forEach((err) => {
      this.message += ValidationError.format(err);
    });

    Error.captureStackTrace(this, this.constructor);
  }

  static format(err) {
    if (err.keyword === 'additionalProperties') {
      return `options${err.schemaPath} ${err.message}: ${
        err.params.additionalProperty
      }\n`;
    }

    return `options${err.dataPath} ${err.message}\n`;
  }
}

module.exports = ValidationError;
