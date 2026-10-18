---
"schema-utils": patch
---

Bundle `schema-utils` without errors or warnings: `precompile` requires the `ajv` helpers it inlines by name and loads webpack's minifier with Node.js's own `require`, so `minify` works from a webpack bundle too.
