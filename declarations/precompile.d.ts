export default precompile;
export type PrecompileOptions = {
  /**
   * loads a schema an external `$ref` points to
   */
  loadSchema?: ((uri: string) => Promise<AnySchemaObject>) | undefined;
};
export type Ajv = import("ajv").default;
export type AnySchemaObject = import("ajv").AnySchemaObject;
export type KeywordCxt = import("ajv").KeywordCxt;
export type Schema = import("./validate").Schema;
export type EXPECTED_ANY = any;
/**
 * @typedef {object} PrecompileOptions
 * @property {((uri: string) => Promise<AnySchemaObject>)=} loadSchema loads a schema an external `$ref` points to
 */
/**
 * Compiles a schema into the source of a CommonJS module that exports a check for it.
 * @param {Schema} schema schema
 * @param {PrecompileOptions=} options options
 * @returns {Promise<string>} source of the module
 */
declare function precompile(
  schema: Schema,
  options?: PrecompileOptions | undefined,
): Promise<string>;
