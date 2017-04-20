class ValidationError extends Error {
  constructor(err, name) {
    super(err);

    this.err = err;
    this.message = `${name || ''} Options Validation Error\n\n`;

    err.forEach((msg) => {
      this.message += `options${msg.dataPath} ${msg.message}\n`;
    });
  }
}

export default ValidationError;
