---
"schema-utils": patch
---

Accept any webpack 5 as the optional peer dependency. Requiring `^5.112.0` broke installs with an older webpack 5, such as NestJS CLI's pinned `webpack@5.106.2`. Only `precompile` with `minify` needs webpack 5.112.0 or later, and it reports that when webpack is older.
