declare module 'ajv-keywords' {
  import { Ajv } from 'ajv';
  type AdditionalKeywords =
    | 'typeof'
    | 'instanceof'
    | 'range'
    | 'exclusiveRange'
    | 'switch'
    | 'select'
    | 'selectCases'
    | 'selectDefault'
    | 'patternRequired'
    | 'prohibited'
    | 'deepProperties'
    | 'deepRequired'
    | 'uniqueItemProperties'
    | 'regexp'
    | 'formatMaximum'
    | 'formatMinimum'
    | 'formatExclusiveMaximum'
    | 'formatExclusiveMinimum'
    | 'dynamicDefaults'
    | 'allRequired'
    | 'anyRequired'
    | 'oneRequired';

  function keywords(
    ajv: Ajv,
    include?: AdditionalKeywords | AdditionalKeywords[]
  ): void;
  export = keywords;
}
