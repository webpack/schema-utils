import { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';
import { ErrorObject } from 'ajv';

declare namespace SchemaUtils {
  type Schema = JSONSchema4 | JSONSchema6 | JSONSchema7;
  type SchemaUtilErrorObject = ErrorObject & {
    children?: SchemaUtilErrorObject[];
  };
  type PostFormatter = (
    formattedError: string,
    error: SchemaUtilErrorObject
  ) => string;

  interface ValidationErrorConfiguration {
    name: string;
    baseDataPath: string;
    postFormatter: PostFormatter;
  }

  class ValidationError extends Error {
    constructor(
      errors: Array<SchemaUtilErrorObject>,
      schema: Schema,
      configuration?: Partial<ValidationErrorConfiguration>
    );

    name: string;
    errors: Array<SchemaUtilErrorObject>;
    schema: Schema;
    headerName: string;
    baseDataPath: string;
    postFormatter: PostFormatter | null;
    message: string;
  }
}

declare const validate: {
  (
    schema: SchemaUtils.Schema,
    options: Array<object> | object,
    configuration?: Partial<SchemaUtils.ValidationErrorConfiguration>
  ): void;
  ValidateError: typeof SchemaUtils.ValidationError;
  ValidationError: typeof SchemaUtils.ValidationError;
};

export = validate;
