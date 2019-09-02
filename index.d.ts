import {JSONSchema4, JSONSchema6, JSONSchema7} from 'json-schema';
import {ErrorObject} from 'ajv';

type Schema = JSONSchema4 | JSONSchema6 | JSONSchema7;
type PostFormatter = (formattedError: string, error: ErrorObject) => string;

declare namespace SchemaUtils {
  class ValidateError extends Error {
    constructor(errors: Array<ErrorObject>, schema: Schema, configuration?: Partial<ValidateErrorConfiguration>);

    name: string;
    errors: Array<ErrorObject>;
    schema: Schema;
    headerName: string;
    baseDataPath: string;
    postFormatter: PostFormatter | null;
    message: string;
  }

  interface ValidateErrorConfiguration {
    name: string,
    baseDataPath: string,
    postFormatter: PostFormatter
  }
}

declare var validate: {
  (schema: Schema, options: Array<object> | object, configuration?: Partial<SchemaUtils.ValidateErrorConfiguration>): void;
  ValidateError: typeof SchemaUtils.ValidateError
}

export = validate;
