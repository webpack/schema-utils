const humanize = require("../src/util/humanize");

const words = [
  ["dash-case", "dash case"],
  ["_snake_case", "snake case"],
  ["snake-case", "snake case"],
  ["PascalCase", "pascal case"],
  ["_12Integers", "12 integers"],
  ["awesomeStringFormat13", "awesome string format13"],
  ["camelCase", "camel case"],
  ["date-time", "date time"],
  ["email", "email"],
  ["a", "a"],
  ["", ""],
];

describe("humanize", () => {
  for (const [provided, expected] of words) {
    it(JSON.stringify(provided), () => {
      expect(humanize(provided)).toBe(expected);
    });
  }
});
