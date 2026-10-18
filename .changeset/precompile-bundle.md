---
"schema-utils": patch
---

Bundle `schema-utils` without errors or warnings: `precompile` requires the `ajv` helpers it inlines by name and loads webpack's minifier without a request a bundler parses.
