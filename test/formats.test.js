import { validate } from "../src";
import { comparators, withComparators } from "../src/util/formats";

import { getCheck } from "./helpers/precompiled";

const runtime = require("../src/runtime");

/**
 * @param {number | undefined} result result of a comparator
 * @returns {-1 | 0 | 1 | undefined} sign of the result
 */
function sign(result) {
  return typeof result === "number"
    ? /** @type {-1 | 0 | 1} */ (Math.sign(result))
    : result;
}

describe("formats", () => {
  describe("comparators", () => {
    it.each([
      // The Unix epoch is a valid timestamp
      ["date-time", "1970-01-01T00:00:00Z", "1970-01-01T00:00:00Z", 0],
      ["date-time", "1970-01-02T00:00:00Z", "1970-01-01T00:00:00Z", 1],
      ["date-time", "1969-12-31T23:59:59Z", "1970-01-01T00:00:00Z", -1],
      // Fractions of a second are compared digit by digit, beyond milliseconds
      [
        "date-time",
        "1969-12-31T23:59:59.9991Z",
        "1969-12-31T23:59:59.9999Z",
        -1,
      ],
      ["date-time", "2016-02-06T12:00:00.5Z", "2016-02-06T12:00:00.50Z", 0],
      ["date-time", "2016-02-06T12:00:00Z", "2016-02-06T12:00:00.000Z", 0],
      ["date-time", "2016-02-06T12:00:00.0001Z", "2016-02-06T12:00:00Z", 1],
      // Time zones
      ["date-time", "2016-02-06T14:00:00+02:00", "2016-02-06T12:00:00Z", 0],
      ["date-time", "2016-02-06T11:30:00-01:00", "2016-02-06T12:00:00Z", 1],
      ["date-time", "2016-02-06t12:00:00z", "2016-02-06T12:00:00Z", 0],
      ["date-time", "2016-02-06T14:00:00+02", "2016-02-06T12:00:00Z", 0],
      // Years before 100 are not mapped to the 1900s
      ["date-time", "0099-01-01T00:00:00Z", "1999-01-01T00:00:00Z", -1],
      ["iso-date-time", "2016-02-06 12:00:00", "2016-02-06T12:00:00", 0],
      ["iso-date-time", "2016-02-07T00:00:00", "2016-02-06T23:59:59.999", 1],
      ["iso-date-time", "1970-01-01T00:00:00.00001", "1970-01-01T00:00:00", 1],
      ["time", "12:00:00.1Z", "12:00:00.10Z", 0],
      ["time", "12:00:00.0001Z", "12:00:00Z", 1],
      ["time", "14:00:00+02:00", "12:00:00Z", 0],
      // `iso-time` compares the digits as written
      ["iso-time", "09:00:00.1Z", "09:00:00.10Z", 0],
      ["iso-time", "09:00:00.09Z", "09:00:00.10Z", -1],
      ["iso-time", "09:00:00.100", "09:00:00.1", 0],
      ["iso-time", "09:00:01", "09:00:00.999", 1],
    ])("%s should compare %s with %s", (format, a, b, expected) => {
      expect(sign(comparators[format](a, b))).toBe(expected);
      expect(sign(comparators[format](b, a))).toBe(
        expected === 0 ? 0 : -expected,
      );
    });

    it.each([
      ["date-time", "2016-02-06T12:00:00Z", 0],
      ["date-time", "2016-02-06T12:00:00Z", 5],
      ["iso-date-time", "2016-02-06T12:00:00", 5],
      ["iso-date-time", "2016-02-06T12:00:00", null],
      ["date-time", "2016-02-06T12:00:00Z", "not a date-time"],
      ["date-time", "2016-02-06", "2016-02-06T12:00:00Z"],
      ["date-time", "2016-2-6T12:00:00Z", "2016-02-06T12:00:00Z"],
      ["date-time", "2016-02-06T12:00Z", "2016-02-06T12:00:00Z"],
      ["time", "12:00:00Z", "noon"],
      ["iso-time", "09:00:00", {}],
    ])("%s should not compare %j with %j", (format, a, b) => {
      expect(comparators[format](a, b)).toBeUndefined();
      expect(comparators[format](b, a)).toBeUndefined();
    });

    it("should keep the other formats and the validation of the formats", () => {
      const { fullFormats } = require("ajv-formats/dist/formats");

      const formats = withComparators(fullFormats);

      expect(Object.keys(formats)).toEqual(Object.keys(fullFormats));
      expect(formats.date).toBe(fullFormats.date);
      expect(formats["date-time"].validate).toBe(
        fullFormats["date-time"].validate,
      );
      expect(formats["date-time"].compare).toBe(comparators["date-time"]);
    });

    it("should use the exact comparators in the runtime of a precompiled check", () => {
      expect(runtime.formats["iso-time"].compare).toBe(comparators["iso-time"]);
      expect(runtime.formats).toBe(runtime.formats);
    });
  });

  describe("limits", () => {
    /**
     * @param {string} format format
     * @param {Record<string, string | number | boolean>} limits limit keywords
     * @returns {import("../src/validate").Schema} schema
     */
    function getSchema(format, limits) {
      return {
        type: "object",
        properties: { value: { type: "string", format, ...limits } },
      };
    }

    const cases = [
      // The Unix epoch
      [
        "date-time",
        { formatMaximum: "1970-01-01T00:00:00Z", formatExclusiveMaximum: true },
        [
          ["1969-12-31T23:59:59Z", true],
          ["1970-01-01T00:00:00Z", false],
          ["1970-01-02T00:00:00Z", false],
        ],
      ],
      [
        "date-time",
        { formatMinimum: "1970-01-01T00:00:00Z" },
        [
          ["1969-12-31T23:59:59Z", false],
          ["1970-01-01T00:00:00Z", true],
        ],
      ],
      // Fractions of a second beyond milliseconds
      [
        "date-time",
        {
          formatMaximum: "1969-12-31T23:59:59.9999Z",
          formatExclusiveMaximum: true,
        },
        [
          ["1969-12-31T23:59:59.9991Z", true],
          ["1969-12-31T23:59:59.9999Z", false],
        ],
      ],
      // Equal fractions of a second written with different digits
      [
        "iso-time",
        { formatMaximum: "09:00:00.10Z", formatExclusiveMaximum: true },
        [
          ["09:00:00.09Z", true],
          ["09:00:00.1Z", false],
          ["09:00:00.10Z", false],
        ],
      ],
      [
        "iso-time",
        { formatMaximum: "09:00:00.10Z" },
        [
          ["09:00:00.100Z", true],
          ["09:00:00.1001Z", false],
        ],
      ],
      // A limit that is not a string is not compared, and does not throw
      ["iso-date-time", { formatMaximum: 5 }, [["2016-02-06T12:00:00", true]]],
    ];

    describe.each(cases)("%s with %j", (format, limits, values) => {
      const schema = getSchema(format, limits);

      it.each(values)("should validate %j as %s", async (value, valid) => {
        let error;

        try {
          validate(schema, { value }, { name: "Test" });
        } catch (err) {
          error = err;
        }

        if (valid) {
          expect(error).toBeUndefined();
        } else {
          expect(error).toBeDefined();
          expect(error.name).toBe("ValidationError");
        }

        const check = await getCheck(schema);

        expect(check({ value })).toBe(valid);
      });
    });
  });
});
