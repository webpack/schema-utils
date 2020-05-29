export function stringHints(
  schema:
    | (import('json-schema').JSONSchema4 & import('../validate').Extend)
    | (import('json-schema').JSONSchema6 & import('../validate').Extend)
    | (import('json-schema').JSONSchema7 & import('../validate').Extend),
  logic: boolean
): string[];
export function numberHints(
  schema:
    | (import('json-schema').JSONSchema4 & import('../validate').Extend)
    | (import('json-schema').JSONSchema6 & import('../validate').Extend)
    | (import('json-schema').JSONSchema7 & import('../validate').Extend),
  logic: boolean
): string[];
export type Schema =
  | (import('json-schema').JSONSchema4 & import('../validate').Extend)
  | (import('json-schema').JSONSchema6 & import('../validate').Extend)
  | (import('json-schema').JSONSchema7 & import('../validate').Extend);
