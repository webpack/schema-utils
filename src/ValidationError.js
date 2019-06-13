class ValidationError extends Error {
  constructor(errors, name) {
    super();

    this.name = 'ValidationError';

    this.message = `${name || ''} Invalid Options\n\n`;

    this.errors = errors.map((error) => {
      // eslint-disable-next-line no-param-reassign
      error.dataPath = error.dataPath.replace(/\//g, '.');

      return error;
    });

    this.errors.forEach((err) => {
      this.message += `options${err.dataPath} ${err.message}\n`;
    });

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ValidationError;
