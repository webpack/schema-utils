---
"schema-utils": patch
---

Treat a boolean `formatExclusiveMaximum` / `formatExclusiveMinimum` as a flag that makes `formatMaximum` / `formatMinimum` exclusive, as in v3, instead of comparing the value against `true`. A check made with `schema-utils precompile` before this fix keeps the old comparison, so run `precompile` again and republish it.
