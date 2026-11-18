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
 * @property {boolean} leap whether it is a leap second, which comes after the second `59` of `seconds` and before the next one
 * @property {string} fraction digits of the fraction of a second, without trailing zeros
 */

const TIME =
  /^(\d\d):(\d\d):(\d\d)(?:\.(\d+))?(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
const DATE_TIME_SEPARATOR = /t|\s/i;
const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
const DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * @param {number} year year
 * @returns {boolean} true when the year has a 29 February
 */
function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/**
 * @param {string} digits digits of a fraction of a second
 * @returns {string} the digits without trailing zeros
 */
function trimTrailingZeros(digits) {
  // A loop and not `/0+$/`, which takes quadratic time on a long run of zeros before a digit
  let end = digits.length;

  while (end > 0 && digits[end - 1] === "0") {
    end--;
  }

  return digits.slice(0, end);
}

/**
 * @typedef {object} TimeOptions
 * @property {boolean} requireTimeZone whether a time without a time zone is not compared, like `time` and `date-time` do not validate it
 * @property {boolean} applyTimeZone whether to apply the time zone offset, `iso-time` ignores it
 */

/**
 * @param {string} str time, such as `12:30:00.5+02:00`
 * @param {TimeOptions} options options
 * @returns {Instant | undefined} seconds since midnight in UTC (as written without `applyTimeZone`)
 */
function parseTime(str, { requireTimeZone, applyTimeZone }) {
  const matches = TIME.exec(str);

  if (!matches) {
    return undefined;
  }

  const hours = Number(matches[1]);
  const minutes = Number(matches[2]);
  const seconds = Number(matches[3]);
  const offsetHours = Number(matches[7] || 0);
  const offsetMinutes = Number(matches[8] || 0);

  // Like `Date` did for the comparators of `ajv-formats`, a time out of range is not compared.
  // The second `60` is a leap second.
  if (
    hours > 23 ||
    minutes > 59 ||
    seconds > 60 ||
    offsetHours > 23 ||
    offsetMinutes > 59 ||
    (requireTimeZone && !matches[5])
  ) {
    return undefined;
  }

  const sign = matches[6] === "-" ? -1 : 1;
  const leap = seconds === 60;

  // Like the format validators of `ajv-formats`, a leap second is only valid in the last
  // minute of the day in UTC, `15:59:60-08:00` is but `12:00:60Z` is not
  if (leap) {
    const utcMinutes = minutes - offsetMinutes * sign;
    const utcHours = hours - offsetHours * sign - (utcMinutes < 0 ? 1 : 0);

    if (
      !(utcHours === 23 || utcHours === -1) ||
      !(utcMinutes === 59 || utcMinutes === -1)
    ) {
      return undefined;
    }
  }

  const offset = applyTimeZone
    ? sign * (offsetHours * 3600 + offsetMinutes * 60)
    : 0;

  return {
    seconds: hours * 3600 + minutes * 60 + (leap ? 59 : seconds) - offset,
    leap,
    fraction: trimTrailingZeros(matches[4] || ""),
  };
}

/**
 * @param {string} str date-time, such as `2016-02-06T12:30:00.5Z`
 * @param {boolean} requireTimeZone whether a date-time without a time zone is not compared
 * @returns {Instant | undefined} seconds since the Unix epoch
 */
function parseDateTime(str, requireTimeZone) {
  const parts = str.split(DATE_TIME_SEPARATOR);

  if (parts.length !== 2) {
    return undefined;
  }

  const date = DATE.exec(parts[0]);
  const time = parseTime(parts[1], { requireTimeZone, applyTimeZone: true });

  if (!date || !time) {
    return undefined;
  }

  const year = Number(date[1]);
  const month = Number(date[2]);
  const dayOfMonth = Number(date[3]);

  // A date out of range, such as `2024-13-01`, is not compared instead of rolling over
  if (
    month < 1 ||
    month > 12 ||
    dayOfMonth < 1 ||
    dayOfMonth > (month === 2 && isLeapYear(year) ? 29 : DAYS[month])
  ) {
    return undefined;
  }

  // `Date.UTC` maps the years 0-99 to 1900-1999, `setUTCFullYear` does not
  const day = new Date(0);

  day.setUTCFullYear(year, month - 1, dayOfMonth);

  return {
    seconds: day.valueOf() / 1000 + time.seconds,
    leap: time.leap,
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

  if (a.leap !== b.leap) {
    return a.leap ? 1 : -1;
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
  time: createCompare((str) =>
    parseTime(str, { requireTimeZone: true, applyTimeZone: true }),
  ),
  // Like `ajv-formats`, `iso-time` compares the digits as written and ignores the time zone
  "iso-time": createCompare((str) =>
    parseTime(str, { requireTimeZone: false, applyTimeZone: false }),
  ),
  "date-time": createCompare((str) => parseDateTime(str, true)),
  // An `iso-date-time` without a time zone is compared as UTC
  "iso-date-time": createCompare((str) => parseDateTime(str, false)),
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
