const Range = require('./Range');

module.exports.stringHints = function stringHints(schema, logic) {
  const hints = [];

  if (typeof schema.minLength === 'number' && schema.minLength > 1) {
    hints.push(
      `should${logic ? ' not' : ''} be shorter than ${
        schema.minLength
      } characters`
    );
  }

  if (typeof schema.maxLength === 'number') {
    hints.push(
      `should${logic ? ' not' : ''} be longer than ${
        schema.maxLength
      } character${schema.maxLength > 1 ? 's' : ''}`
    );
  }

  if (schema.pattern) {
    hints.push(
      `should${logic ? '' : ' not'} match pattern ${JSON.stringify(
        schema.pattern
      )}`
    );
  }

  if (schema.format) {
    hints.push(
      `should${logic ? '' : ' not'} match format ${JSON.stringify(
        schema.format
      )}`
    );
  }

  if (schema.formatMinimum) {
    hints.push(
      `should${logic ? '' : ' not'} be ${
        schema.formatExclusiveMinimum ? '>' : '>='
      } ${JSON.stringify(schema.formatMinimum)}`
    );
  }

  if (schema.formatMaximum) {
    hints.push(
      `should${logic ? '' : ' not'} be ${
        schema.formatExclusiveMaximum ? '<' : '<='
      } ${JSON.stringify(schema.formatMaximum)}`
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
