import {
  ValidationError,
  disableValidation,
  enableValidation,
  needValidate,
  validate,
} from "../src/index";

// eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {any} EXPECTED_ANY */

import schemaTitleBrone from "./fixtures/schema-title-broken.json";
import schemaTitle from "./fixtures/schema-title.json";
import schema from "./fixtures/schema.json";

describe("api", () => {
  /**
   * Loads a fresh copy of `schema-utils`, as if the process had been started with
   * `process.env.SKIP_VALIDATION` set to `value` - the variable is read when the module is loaded.
   * @param {string | undefined} value value of `process.env.SKIP_VALIDATION`
   * @param {(api: EXPECTED_ANY) => void} fn receives the freshly loaded module
   * @returns {void}
   */
  function withSkipValidation(value, fn) {
    const oldValue = process.env.SKIP_VALIDATION;
    const set = (newValue) => {
      if (typeof newValue === "undefined") {
        delete process.env.SKIP_VALIDATION;
      } else {
        process.env.SKIP_VALIDATION = newValue;
      }
    };

    set(value);

    try {
      jest.isolateModules(() => {
        fn(require("../src/index"));
      });
    } finally {
      set(oldValue);
      // the state is shared with the already loaded copy, reload so it matches the environment again
      jest.isolateModules(() => {
        require("../src/index");
      });
    }
  }

  it("should export validate and ValidateError", () => {
    expect(typeof validate).toBe("function");
    expect(typeof ValidationError).toBe("function");
  });

  it("should work", () => {
    let errored;

    try {
      validate(schema, { minimumWithTypeNumber: 5 });
    } catch (err) {
      errored = err;
    }

    expect(errored).toBeUndefined();
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
        { name: "NAME", baseDataPath: "BaseDataPath" },
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
        { c: { d: "e" } },
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
        {},
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
        {},
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
        {},
      );
    } catch (error) {
      if (error.name !== "ValidationError") {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it('should allow to disable validation using "process.env.SKIP_VALIDATION"', () => {
    withSkipValidation("y", ({ validate: freshValidate }) => {
      let errored;

      try {
        freshValidate(schemaTitle, { foo: "bar" }, { name: "NAME" });
      } catch (error) {
        errored = error;
      }

      expect(errored).toBeUndefined();
    });
  });

  it('should allow to disable validation using "process.env.SKIP_VALIDATION" #2', () => {
    withSkipValidation("YeS", ({ validate: freshValidate }) => {
      let errored;

      try {
        freshValidate(schemaTitle, { foo: "bar" }, { name: "NAME" });
      } catch (error) {
        errored = error;
      }

      expect(errored).toBeUndefined();
    });
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

  it('should read "process.env.SKIP_VALIDATION" when loaded, not on every validation', () => {
    enableValidation();

    try {
      process.env.SKIP_VALIDATION = "y";

      let errored;

      try {
        validate(schemaTitle, { foo: "bar" }, { name: "NAME" });
      } catch (error) {
        errored = error;
      }

      // the already loaded copy keeps the value it read when it was loaded
      expect(errored).toBeDefined();
    } finally {
      enableValidation();
    }
  });

  it("should share the state with other copies of `schema-utils`", () => {
    try {
      disableValidation();

      jest.isolateModules(() => {
        // another copy, as if a dependency depended on a different version

        const api = require("../src/index");

        expect(api.needValidate()).toBe(false);

        api.enableValidation();
      });

      // turning it back on in the other copy turns it back on here
      expect(needValidate()).toBe(true);
    } finally {
      enableValidation();
    }
  });

  it("should allow to enable and disable validation using API", () => {
    withSkipValidation("unknown", (api) =>
      expect(api.needValidate()).toBe(true),
    );
    withSkipValidation("no", (api) => expect(api.needValidate()).toBe(true));
    withSkipValidation("yes", (api) => expect(api.needValidate()).toBe(false));

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
