import chalk from 'chalk';
import strip from 'strip-ansi';
import table from 'text-table';

class ValidationError extends Error {
  constructor(options) {
    super();
    // Workaround for https://github.com/istanbuljs/istanbuljs/issues/139
    this.constructor = ValidationError;
    this.__proto__ = ValidationError.prototype;
    // End Workaround
    // prettier-ignore
    this.message = chalk`${options.name}`;
    this.meta = options;
    this.meta.desc = chalk`{underline Options Validation Error}`;
    this.name = 'ValidationError';

    if (options.log) {
      this.message += `: ${this.meta.desc}`;
    } else {
      this.message += `\n\n  ${this.meta.desc}\n\n${this.format()}\n`;
    }

    Error.captureStackTrace(this, this.constructor);
  }

  format() {
    const { errors } = this.meta;
    const rows = [];
    const options = {
      align: ['', 'l', 'l'],
      stringLength(str) {
        return strip(str).length;
      },
    };

    for (const err of errors) {
      rows.push([
        '',
        chalk`{dim options}${err.dataPath}`,
        chalk`{blue ${err.message}}`,
      ]);
    }

    return table(rows, options);
  }

  // eslint-disable-next-line class-methods-use-this
  toString() {
    return `${this.message}\n\n${this.format()}`;
  }
}

export default ValidationError;
