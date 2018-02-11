import format from './format';

class ValidationError extends Error {
  constructor(errors, name) {
    super();

    this.name = 'ValidationError';

    this.message = `${name || ''} Invalid Options\n\n`;

    errors.forEach((err) => {
      this.message += `${format(err)}`;
    });

    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ValidationError;
