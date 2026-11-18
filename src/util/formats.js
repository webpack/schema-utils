// The formats of `ajv-formats`, with exact `compare` functions for times and date-times.
//
// WHY: the comparators of `ajv-formats` used by `formatMinimum`, `formatMaximum` and their exclusive
// variants are lossy:
// - `date-time` treats the Unix epoch (timestamp `0`) as invalid, so a limit or a value of
//   `1970-01-01T00:00:00Z` is never checked
// - `date-time`, `time` and `iso-date-time` parse with `Date`, which keeps only milliseconds, so
//   `23:59:59.9991Z` and `23:59:59.9999Z` compare as equal
// - `iso-time` compares the digits as strings, so the equal `09:00:00.1Z` and `09:00:00.10Z`
//   compare as different
// - `iso-date-time` throws a `TypeError` for a limit that is not a string
// The comparators below parse the value themselves, compare whole seconds as numbers and the
// fraction of a second digit by digit, and return `undefined` for anything that is not a valid
// string of the format, like the other comparators of `ajv-formats` do.

/* eslint-disable jsdoc/reject-any-type */

/**
 * @typedef {object} Instant
 * @property {number} seconds whole seconds, since the Unix epoch for a date-time or since midnight for a time
 * @property {string} fraction digits of the fraction of a second, without trailing zeros
 */

const TIME =
  /^(\d\d):(\d\d):(\d\d)(?:\.(\d+))?(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
const DATE_TIME_SEPARATOR = /t|\s/i;
const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;

/**
 * @param {string} str time, such as `12:30:00.5+02:00`
 * @param {boolean} withTimeZone whether to apply the time zone offset
 * @returns {Instant | undefined} seconds since midnight in UTC (in local time without `withTimeZone`)
 */
function parseTime(str, withTimeZone) {
  const matches = TIME.exec(str);

  if (!matches) {
    return undefined;
  }

  const seconds = Number(matches[1]) * 3600 + Number(matches[2]) * 60;
  const offset =
    withTimeZone && matches[6]
      ? (matches[6] === "-" ? -1 : 1) *
        (Number(matches[7]) * 3600 + Number(matches[8] || 0) * 60)
      : 0;

  return {
    seconds: seconds + Number(matches[3]) - offset,
    fraction: (matches[4] || "").replace(/0+$/, ""),
  };
}

/**
 * @param {string} str date-time, such as `2016-02-06T12:30:00.5Z`
 * @returns {Instant | undefined} seconds since the Unix epoch
 */
function parseDateTime(str) {
  const parts = str.split(DATE_TIME_SEPARATOR);

  if (parts.length !== 2) {
    return undefined;
  }

  const date = DATE.exec(parts[0]);
  const time = parseTime(parts[1], true);

  if (!date || !time) {
    return undefined;
  }

  // `Date.UTC` maps the years 0-99 to 1900-1999, `setUTCFullYear` does not
  const day = new Date(0);

  day.setUTCFullYear(Number(date[1]), Number(date[2]) - 1, Number(date[3]));

  return {
    seconds: day.valueOf() / 1000 + time.seconds,
    fraction: time.fraction,
  };
}

/**
 * @param {Instant} a instant
 * @param {Instant} b instant
 * @returns {number} negative, zero or positive when `a` is before, equal to or after `b`
 */
function compareInstants(a, b) {
  if (a.seconds !== b.seconds) {
    return a.seconds - b.seconds;
  }

  const length = Math.max(a.fraction.length, b.fraction.length);
  const fractionA = a.fraction.padEnd(length, "0");
  const fractionB = b.fraction.padEnd(length, "0");

  return fractionA === fractionB ? 0 : fractionA > fractionB ? 1 : -1;
}

/**
 * @param {(str: string) => Instant | undefined} parse parser
 * @returns {(a: any, b: any) => number | undefined} comparator
 */
function createCompare(parse) {
  return (a, b) => {
    if (typeof a !== "string" || typeof b !== "string") {
      return undefined;
    }

    const instantA = parse(a);
    const instantB = parse(b);

    if (!instantA || !instantB) {
      return undefined;
    }

    return compareInstants(instantA, instantB);
  };
}

/** @type {Record<string, (a: any, b: any) => number | undefined>} */
const comparators = {
  time: createCompare((str) => parseTime(str, true)),
  // Like `ajv-formats`, `iso-time` compares the digits as written and ignores the time zone
  "iso-time": createCompare((str) => parseTime(str, false)),
  "date-time": createCompare(parseDateTime),
  "iso-date-time": createCompare(parseDateTime),
};

/**
 * @param {Record<string, any>} formats formats of `ajv-formats`
 * @returns {Record<string, any>} the formats with the exact comparators
 */
function withComparators(formats) {
  /** @type {Record<string, any>} */
  const result = { ...formats };

  for (const name of Object.keys(comparators)) {
    result[name] = { ...result[name], compare: comparators[name] };
  }

  return result;
}

/**
 * Registers the formats of `ajv-formats` with the exact comparators.
 * @param {import("ajv").default} ajv ajv
 * @returns {import("ajv").default} ajv
 */
function addFormats(ajv) {
  const addAjvFormats = require("ajv-formats").default;
  const { fullFormats } = require("ajv-formats/dist/formats");

  // `addFormats` of `ajv-formats` also sets the `code.formats` option for the generated code
  addAjvFormats(ajv, { keywords: false });

  const formats = withComparators(fullFormats);

  for (const name of Object.keys(comparators)) {
    ajv.addFormat(name, formats[name]);
  }

  return ajv;
}

export { comparators, withComparators };

export default addFormats;
