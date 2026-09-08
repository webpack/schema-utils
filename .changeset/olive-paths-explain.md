---
"schema-utils": patch
---

author: alexander-akait

A string an `absolutePath` keyword applies to is described as an `absolute path string` or a `relative path string` rather than as a bare `string`, which read as though any string would do. A failure a schema reaches through more than one branch is listed once instead of repeatedly, so a relative path given to a rule condition is reported as the one line that says so.
