import humanize from '../src/util/humanize';

const words = [
  ['dash-case', 'dash case'],
  ['_snake_case', 'snake case'],
  ['snake-case', 'snake case'],
  ['PascalCase', 'pascal case'],
  ['_12Integers', '12 integers'],
  ['awesomeStringFormat13', 'awesome string format13'],
  ['camelCase', 'camel case'],
];

describe('humanize', () => {
  words.forEach(([provided, expected]) => {
    it(provided, () => {
      expect(humanize(provided)).toEqual(expected);
    });
  });
});
