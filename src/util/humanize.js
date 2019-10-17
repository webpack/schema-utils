/**
 * Transform provided string
 * from camelCase, PascalCase, dash-case, snake_case
 * to human readable string
 * @param {string} str provided string
 * @returns {string}
 */
module.exports = function humanize(str) {
  if (typeof str !== 'string' || str.length < 2) {
    return str;
  }
  const tryDashCase = str.split('-');

  if (tryDashCase.length !== 1) {
    return tryDashCase.join(' ').toLowerCase();
  }

  const stringWithValidStart = str[0] === '_' ? str.slice(1) : str;
  const trySnakeCase = stringWithValidStart.split('_');

  if (trySnakeCase.length !== 1) {
    return trySnakeCase.join(' ').toLowerCase();
  }

  const aUpperCase = 'A'.charCodeAt(0);
  const zUpperCase = 'Z'.charCodeAt(0);
  /** @type {string[]} */
  const words = [];

  let lastUpperCase = 0;
  let i = 1;

  /**
   * @param {string} word
   * @param {number} j
   * @returns {boolean}
   */
  function isUpperCase(word, j) {
    const code = word.charCodeAt(j);

    return code >= aUpperCase && code <= zUpperCase;
  }

  while (i < stringWithValidStart.length) {
    while (
      i < stringWithValidStart.length &&
      !isUpperCase(stringWithValidStart, i)
    )
      i += 1;

    words.push(stringWithValidStart.slice(lastUpperCase, i).toLowerCase());
    lastUpperCase = i;
    i += 1;
  }

  return words.join(' ');
};
