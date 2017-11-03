class ValidationError extends Error {
  constructor(errors, name) {
    super();

    this.name = 'ValidationError';

    this.message = `Validation Error\n\n${name || ''} Invalid Options\n\n`;

    errors.forEach((err) => {
      this.message += `options${err.dataPath} ${err.message}\n`;
    });

    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);

    return this;
  }
}

export default ValidationError;
