import { validate } from "../src";

// eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {any} EXPECTED_ANY */

/**
 * @param {object} schema schema
 * @param {object} options options
 * @returns {Error & { errors: EXPECTED_ANY[] }} thrown error
 */
function getError(schema, options) {
  try {
    validate(schema, options);
  } catch (error) {
    if (error.name !== "ValidationError") {
      throw error;
    }

    return error;
  }

  throw new Error("Validation didn't fail");
}

/**
 * @param {number} length length
 * @returns {Record<string, number>} object with unknown properties
 */
function unknownProperties(length) {
  /** @type {Record<string, number>} */
  const options = {};

  for (let i = 0; i < length; i++) {
    options[`unknown${i}`] = 1;
  }

  return options;
}

describe("large amount of errors", () => {
  it("should list at most 100 errors and count the rest", () => {
    const schema = {
      type: "object",
      properties: { list: { type: "array", items: { type: "string" } } },
    };

    const { message, errors } = getError(schema, {
      list: Array.from({ length: 5000 }, () => 1),
    });
    const listed = message.split("\n").filter((line) => line.startsWith(" - "));

    expect(errors).toHaveLength(5000);
    expect(listed).toHaveLength(101);
    expect(listed[0]).toBe(" - configuration.list[0] should be a string.");
    expect(listed[100]).toBe(" - and 4900 more errors");
  });

  it("should list at most 100 errors of a `anyOf` and count the rest", () => {
    const schema = {
      type: "object",
      properties: {
        a: {
          anyOf: [
            {
              type: "object",
              additionalProperties: false,
              properties: { x: { type: "string" } },
            },
            { type: "string" },
          ],
        },
      },
    };

    const { message } = getError(schema, { a: unknownProperties(5000) });
    const listed = message.split("\n").filter((line) => line.includes(" * "));

    expect(listed).toHaveLength(101);
    expect(listed[100]).toContain("* and 4900 more errors");
  });

  it("should not list a count when nothing was left out", () => {
    const schema = {
      type: "object",
      properties: { list: { type: "array", items: { type: "string" } } },
    };

    const { message } = getError(schema, { list: [1, 2, 3] });

    expect(message).not.toContain("more error");
    expect(
      message.split("\n").filter((line) => line.startsWith(" - ")),
    ).toHaveLength(3);
  });

  it("should use the singular form for a single left out error", () => {
    const schema = {
      type: "object",
      properties: { list: { type: "array", items: { type: "string" } } },
    };

    const { message } = getError(schema, {
      list: Array.from({ length: 101 }, () => 1),
    });

    expect(message).toContain(" - and 1 more error");
    expect(message).not.toContain("more errors");
  });

  it("should keep the message small for a huge amount of errors", () => {
    const schema = {
      type: "object",
      properties: { list: { type: "array", items: { type: "string" } } },
    };

    const { message, errors } = getError(schema, {
      list: Array.from({ length: 200000 }, () => 1),
    });

    expect(errors).toHaveLength(200000);
    expect(message.length).toBeLessThan(100 * 1024);
  }, 30000);
});
