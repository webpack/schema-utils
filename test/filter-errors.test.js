import { validate } from "../src";

/**
 * @param {object} schema schema
 * @param {object} options options
 * @returns {import("../src/validate").SchemaUtilErrorObject[]} reported errors
 */
function getErrors(schema, options) {
  try {
    validate(schema, options);
  } catch (error) {
    if (error.name !== "ValidationError") {
      throw error;
    }

    return error.errors;
  }

  throw new Error("Validation didn't fail");
}

/**
 * @param {object} schema schema
 * @param {object} options options
 * @returns {string} error message
 */
function getMessage(schema, options) {
  try {
    validate(schema, options);
  } catch (error) {
    if (error.name !== "ValidationError") {
      throw error;
    }

    return error.message;
  }

  throw new Error("Validation didn't fail");
}

describe("filter errors", () => {
  it("should not nest errors of a property inside errors of a sibling property with a shorter name", () => {
    const schema = {
      type: "object",
      properties: {
        foobar: { type: "string" },
        foo: { type: "string" },
      },
    };

    const message = getMessage(schema, { foobar: 1, foo: 1 });

    expect(message).toContain("configuration.foobar should be a string.");
    expect(message).toContain("configuration.foo should be a string.");
  });

  it("should not nest errors of a nested property inside errors of an unrelated property", () => {
    const schema = {
      type: "object",
      properties: {
        a: { type: "object", properties: { b: { type: "string" } } },
        b: { type: "array", items: { type: "string" } },
      },
    };

    const message = getMessage(schema, { a: { b: 1 }, b: 1 });

    expect(message).toContain("configuration.a.b should be a string.");
    expect(message).toContain("configuration.b should be an array");
  });

  it("should nest errors of nested properties inside errors of their parent", () => {
    const schema = {
      type: "object",
      properties: {
        a: {
          anyOf: [
            { type: "object", properties: { b: { type: "string" } } },
            { type: "string" },
          ],
        },
      },
    };

    const errors = getErrors(schema, { a: { b: 1 } });

    expect(errors).toHaveLength(1);
    expect(errors[0].keyword).toBe("anyOf");
    expect(errors[0].instancePath).toBe("/a");
    expect(errors[0].children.map((error) => error.instancePath)).toContain(
      "/a/b",
    );
  });

  it("should nest sibling errors reported for the same instance path", () => {
    const schema = {
      type: "object",
      additionalProperties: false,
      properties: { a: { type: "string" } },
    };

    const options = {};

    for (let i = 0; i < 10; i++) {
      options[`unknown${i}`] = 1;
    }

    const errors = getErrors(schema, options);

    expect(errors).toHaveLength(1);
    expect(errors[0].children).toHaveLength(9);
    expect(
      errors[0].children.every(
        (error) => typeof error.children === "undefined",
      ),
    ).toBe(true);
  });

  // `filterErrors` used to be quadratic in the amount of reported errors, so a large invalid
  // configuration was enough to lock up the process for minutes
  it("should filter a large amount of sibling errors in a reasonable time", () => {
    const schema = {
      type: "object",
      additionalProperties: false,
      properties: { a: { type: "string" } },
    };

    const options = {};

    for (let i = 0; i < 40000; i++) {
      options[`unknown${i}`] = 1;
    }

    const start = process.hrtime.bigint();
    const errors = getErrors(schema, options);
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6;

    expect(errors).toHaveLength(1);
    expect(errors[0].children).toHaveLength(39999);
    expect(elapsed).toBeLessThan(5000);
  }, 30000);

  it("should filter a large amount of errors with distinct instance paths in a reasonable time", () => {
    const schema = {
      type: "object",
      properties: {
        list: {
          type: "array",
          items: { anyOf: [{ type: "string" }, { type: "boolean" }] },
        },
      },
    };

    const options = { list: Array.from({ length: 40000 }, () => 1) };

    const start = process.hrtime.bigint();
    const errors = getErrors(schema, options);
    const elapsed = Number(process.hrtime.bigint() - start) / 1e6;

    expect(errors).toHaveLength(40000);
    expect(elapsed).toBeLessThan(5000);
  }, 30000);
});
