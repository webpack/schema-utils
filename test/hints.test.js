const { stringHints } = require("../src/util/hints");

/**
 * Test cases in format [0] schema, [1] hints without 'not' logic, [2] hints with 'not' logic
 */
const testCases = [
  [
    {
      format: "[0-9]*",
      minLength: 10,
    },
    ["should be longer than 9 characters", 'should match format "[0-9]*"'],
    [
      "should be shorter than 11 characters",
      'should not match format "[0-9]*"',
    ],
  ],
  [
    {
      maxLength: 10,
      minLength: 1,
    },
    ["should be shorter than 11 characters"],
    ["should be longer than 9 characters"],
  ],
  [
    {
      pattern: "phone",
    },
    ['should match pattern "phone"'],
    ['should not match pattern "phone"'],
  ],
  [
    {
      format: "date",
      formatMaximum: "01.01.2022",
      formatExclusiveMaximum: "01.01.2022",
    },
    ['should match format "date"', 'should be < "01.01.2022"'],
    ['should not match format "date"', 'should be >= "01.01.2022"'],
  ],
];

describe("hints", () => {
  for (const testCase of testCases) {
    it(JSON.stringify(testCase[0]), () => {
      const [input, withoutNot, withNot] = testCase;
      const computedWithoutNot = stringHints(input, true);
      const computedWithNot = stringHints(input, false);

      expect(computedWithNot).toEqual(expect.arrayContaining(withNot));
      expect(computedWithoutNot).toEqual(expect.arrayContaining(withoutNot));
    });
  }
});
