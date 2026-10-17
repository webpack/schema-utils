export = runtime;
/**
 * @typedef {object} Runtime
 * @property {(a: any, b: any) => boolean} equal deep equality for `const`, `enum` and `uniqueItems`
 * @property {(str: string) => number} ucs2length string length in code points for `minLength` and `maxLength`
 * @property {any} uri URI parser for `$ref` to an `$id`
 * @property {Record<string, any>} formats formats of `ajv-formats` for `format`
 */
/** @type {Runtime} */
declare const runtime: Runtime;
declare namespace runtime {
  export { Runtime };
}
type Runtime = {
  /**
   * deep equality for `const`, `enum` and `uniqueItems`
   */
  equal: (a: any, b: any) => boolean;
  /**
   * string length in code points for `minLength` and `maxLength`
   */
  ucs2length: (str: string) => number;
  /**
   * URI parser for `$ref` to an `$id`
   */
  uri: any;
  /**
   * formats of `ajv-formats` for `format`
   */
  formats: Record<string, any>;
};
