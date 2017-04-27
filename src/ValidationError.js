class ValidationError extends Error {
  constructor(err, name) {
    super(err);

    this.err = err;
    this.stack = false;

    this.message = `Validation Error\n\n${name || ''} Invalid Options\n\n`;

    err.forEach((msg) => {
      this.message += `options${msg.dataPath} ${msg.message}\n`;
    });

    return this;
  }
}

export default ValidationError;
