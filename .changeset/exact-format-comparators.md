---
"schema-utils": patch
---

Compare `time`, `iso-time`, `date-time` and `iso-date-time` exactly in `formatMinimum`, `formatMaximum`, `formatExclusiveMinimum` and `formatExclusiveMaximum`, in place of the comparators of `ajv-formats`. A limit at the Unix epoch (`1970-01-01T00:00:00Z`) is now checked, fractions of a second are compared beyond milliseconds, equal fractions such as `.1` and `.10` compare as equal, and a limit that is not a string no longer throws a `TypeError` for `iso-date-time`. A time or date-time without a time zone is compared as UTC. Precompiled checks use the new comparators through `schema-utils/dist/runtime`, so they don't need to be generated again.
