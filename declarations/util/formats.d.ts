export default addFormats;
export type Instant = {
  /**
   * whole seconds, since the Unix epoch for a date-time or since midnight for a time
   */
  seconds: number;
  /**
   * digits of the fraction of a second, without trailing zeros
   */
  fraction: string;
};
/** @type {Record<string, (a: any, b: any) => number | undefined>} */
export const comparators: Record<
  string,
  (a: any, b: any) => number | undefined
>;
/**
 * @param {Record<string, any>} formats formats of `ajv-formats`
 * @returns {Record<string, any>} the formats with the exact comparators
 */
export function withComparators(
  formats: Record<string, any>,
): Record<string, any>;
/**
 * Registers the formats of `ajv-formats` with the exact comparators.
 * @param {import("ajv").default} ajv ajv
 * @returns {import("ajv").default} ajv
 */
declare function addFormats(ajv: import("ajv").default): import("ajv").default;
