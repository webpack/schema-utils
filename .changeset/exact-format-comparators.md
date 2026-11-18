---
"schema-utils": patch
---

Compare `time`, `iso-time`, `date-time` and `iso-date-time` exactly in `formatMinimum`, `formatMaximum`, `formatExclusiveMinimum` and `formatExclusiveMaximum`, in place of the comparators of `ajv-formats`. A limit at the Unix epoch (`1970-01-01T00:00:00Z`) is now checked, fractions of a second are compared beyond milliseconds, equal fractions such as `.1` and `.10` compare as equal, and a limit that is not a string no longer throws a `TypeError` for `iso-date-time`. A `time` or date-time without a time zone is compared as UTC, while `iso-time` still compares the time as written and ignores any time zone, so `09:00:00` and `09:00:00+02:00` are equal. A limit that is not a valid date or time, such as `2024-13-01T00:00:00Z` or `25:00:00Z`, is not compared, like before. A leap second (`23:59:60`) comes before the next midnight. Precompiled checks use the new comparators through `schema-utils/dist/runtime`, so they don't need to be generated again.
