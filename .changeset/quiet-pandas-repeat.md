---
"schema-utils": patch
---

pr: 217
author: alexander-akait

Fixed error filtering being quadratic in the amount of reported errors, which let a large invalid configuration lock up the process, and stopped errors from being dropped when one instance path merely contained another as a substring - two sibling properties where one name is a prefix of the other were enough to lose an error. An array of options reporting a lot of errors no longer throws `RangeError: Maximum call stack size exceeded` instead of a `ValidationError`.
