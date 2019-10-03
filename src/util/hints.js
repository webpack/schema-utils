const Range = require('./Range');

module.exports.stringHints = function stringHints(schema, logic) {
  const hints = [];
  const currentSchema = { ...schema };

  if (!logic) {
    const tmpLength = currentSchema.minLength;
    const tmpFormat = currentSchema.formatMinimum;
    const tmpExclusive = currentSchema.formatExclusiveMaximum;

    currentSchema.minLength = currentSchema.maxLength;
    currentSchema.maxLength = tmpLength;
    currentSchema.formatMinimum = currentSchema.formatMaximum;
    currentSchema.formatMaximum = tmpFormat;
    currentSchema.formatExclusiveMaximum = !currentSchema.formatExclusiveMinimum;
    currentSchema.formatExclusiveMinimum = !tmpExclusive;
  }

  if (
    typeof currentSchema.minLength === 'number' &&
    currentSchema.minLength > 1
  ) {
    const length = currentSchema.minLength - 1;
    hints.push(
      `should be longer than ${length} character${length > 1 ? 's' : ''}`
    );
  }

  if (typeof currentSchema.maxLength === 'number') {
    const length = currentSchema.maxLength + 1;
    hints.push(
      `should be shorter than ${length} character${length > 1 ? 's' : ''}`
    );
  }

  if (currentSchema.pattern) {
    hints.push(
      `should${logic ? '' : ' not'} match pattern ${JSON.stringify(
        currentSchema.pattern
      )}`
    );
  }

  if (currentSchema.format) {
    hints.push(
      `should${logic ? '' : ' not'} match format ${JSON.stringify(
        currentSchema.format
      )}`
    );
  }

  if (currentSchema.formatMinimum) {
    hints.push(
      `should be ${
        currentSchema.formatExclusiveMinimum ? '>' : '>='
      } ${JSON.stringify(currentSchema.formatMinimum)}`
    );
  }

  if (currentSchema.formatMaximum) {
    hints.push(
      `should be ${
        currentSchema.formatExclusiveMaximum ? '<' : '<='
      } ${JSON.stringify(currentSchema.formatMaximum)}`
    );
  }

  return hints;
};

module.exports.numberHints = function numberHints(schema, logic) {
  const hints = [];
  const range = new Range();

  if (typeof schema.minimum === 'number') {
    range.left(schema.minimum);
  }

  if (typeof schema.exclusiveMinimum === 'number') {
    range.left(schema.exclusiveMinimum, true);
  }

  if (typeof schema.maximum === 'number') {
    range.right(schema.maximum);
  }

  if (typeof schema.exclusiveMaximum === 'number') {
    range.right(schema.exclusiveMaximum, true);
  }

  const rangeFormat = range.format(logic);

  if (rangeFormat) {
    hints.push(rangeFormat);
  }

  if (typeof schema.multipleOf === 'number') {
    hints.push(
      `should${logic ? '' : ' not'} be multiple of ${schema.multipleOf}`
    );
  }

  return hints;
};
