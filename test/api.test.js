import {
  validate,
  ValidationError,
  enableValidation,
  disableValidation,
  needValidate,
} from "../src/index";

import schema from "./fixtures/schema.json";
import schemaTitle from "./fixtures/schema-title.json";
import schemaTitleBrone from "./fixtures/schema-title-broken.json";

describe("api", () => {
  it("should export validate and ValidateError", () => {
    expect(typeof validate).toBe("function");
    expect(typeof ValidationError).toBe("function");
  });

  it("should work", () => {
    validate(schema, { minimumWithTypeNumber: 5 });
  });

  it("should work when options will be changed", () => {
    expect.assertions(1);

    const options = { minimumWithTypeNumber: 5 };

    validate(schema, options);

    options.minimumWithTypeNumber = 1;

    try {
      validate(schema, options);
    } catch (error) {
      expect(error).toBeDefined();
    }

    options.minimumWithTypeNumber = 120;

    validate(schema, options);
  });

  it("should get configuration from schema", () => {
    try {
      validate(schemaTitle, { foo: "bar" });
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it('should prefer configuration over "title"', () => {
    try {
      validate(
        schemaTitle,
        { foo: "bar" },
        { name: "NAME", baseDataPath: "BaseDataPath" }
      );
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it('should prefer configuration over "title" #1', () => {
    try {
      validate(schemaTitle, { foo: "bar" }, { name: "NAME" });
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it('should prefer configuration over "title" #2', () => {
    try {
      validate(schemaTitle, { foo: "bar" }, { baseDataPath: "BaseDataPath" });
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it('should use default values when "title" is broken', () => {
    try {
      validate(schemaTitleBrone, { foo: "bar" });
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it("should work with required properties", () => {
    try {
      validate(
        {
          type: "object",
          properties: {
            c: {
              type: "object",
              properties: {
                d: {
                  type: "string",
                },
                e: {
                  type: "string",
                },
              },
              additionalProperties: true,
              required: ["d", "e"],
            },
          },
        },
        { c: { d: "e" } }
      );
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it("should work with required properties #2", () => {
    try {
      validate(
        {
          type: "object",
          properties: {},
          required: ["d", "e"],
        },
        {}
      );
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it("should work with minProperties properties", () => {
    try {
      validate(
        {
          type: "object",
          properties: {},
          minProperties: 1,
        },
        {}
      );
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it("should work with anyOf", () => {
    try {
      validate(
        {
          type: "object",
          properties: { foo: { type: "number" } },
          unevaluatedProperties: false,
          anyOf: [
            {
              required: ["bar"],
              properties: { bar: { type: "number" } },
            },
            {
              required: ["baz"],
              properties: { baz: { type: "number" } },
            },
          ],
        },
        {}
      );
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it('should allow to disable validation using "process.env.SKIP_VALIDATION"', () => {
    const oldValue = process.env.SKIP_VALIDATION;

    let errored;

    process.env.SKIP_VALIDATION = "y";

    try {
      validate(schemaTitle, { foo: "bar" }, { name: "NAME" });
    } catch (error) {
      errored = error;
    }

    expect(errored).toBeUndefined();

    process.env.SKIP_VALIDATION = oldValue;
  });

  it('should allow to disable validation using "process.env.SKIP_VALIDATION" #2', () => {
    const oldValue = process.env.SKIP_VALIDATION;

    let errored;

    process.env.SKIP_VALIDATION = "YeS";

    try {
      validate(schemaTitle, { foo: "bar" }, { name: "NAME" });
    } catch (error) {
      errored = error;
    }

    expect(errored).toBeUndefined();

    process.env.SKIP_VALIDATION = oldValue;
  });

  it('should allow to enable validation using "process.env.SKIP_VALIDATION"', () => {
    const oldValue = process.env.SKIP_VALIDATION;

    process.env.SKIP_VALIDATION = "n";

    try {
      validate(schemaTitle, { foo: "bar" }, { name: "NAME" });
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }

    process.env.SKIP_VALIDATION = oldValue;
  });

  it('should allow to enable validation using "process.env.SKIP_VALIDATION" #2', () => {
    const oldValue = process.env.SKIP_VALIDATION;

    process.env.SKIP_VALIDATION = " FaLse ";

    try {
      validate(schemaTitle, { foo: "bar" }, { name: "NAME" });
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }

    process.env.SKIP_VALIDATION = oldValue;
  });

  it("should allow to disable validation using API", () => {
    let errored;

    disableValidation();

    try {
      validate(schemaTitle, { foo: "bar" }, { name: "NAME" });
    } catch (error) {
      errored = error;
    }

    expect(errored).toBeUndefined();

    enableValidation();
  });

  it("should allow to enable validation using API", () => {
    disableValidation();
    enableValidation();

    try {
      validate(schemaTitle, { foo: "bar" }, { name: "NAME" });
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it.only("should allow to enable and disable validation using API", () => {
    process.env.SKIP_VALIDATION = "unknown";
    expect(needValidate()).toBe(true);

    process.env.SKIP_VALIDATION = "no";
    expect(needValidate()).toBe(true);

    process.env.SKIP_VALIDATION = "yes";
    expect(needValidate()).toBe(false);

    enableValidation();
    expect(process.env.SKIP_VALIDATION).toBe("n");

    process.env.SKIP_VALIDATION = "undefined";

    enableValidation();
    expect(needValidate()).toBe(true);

    disableValidation();
    expect(needValidate()).toBe(false);
    enableValidation();

    enableValidation();
    enableValidation();
    expect(needValidate()).toBe(true);

    enableValidation();
    disableValidation();
    expect(needValidate()).toBe(false);
    enableValidation();

    enableValidation();
    expect(process.env.SKIP_VALIDATION).toBe("n");

    disableValidation();
    expect(process.env.SKIP_VALIDATION).toBe("y");
    enableValidation();
    expect(process.env.SKIP_VALIDATION).toBe("n");
  });
});
