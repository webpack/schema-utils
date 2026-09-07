---
"schema-utils": minor
---

pr: 217
author: alexander-akait

`process.env.SKIP_VALIDATION` is now read when `schema-utils` is loaded rather than on every validation, so set it before starting the process. `enableValidation()`/`disableValidation()` still take effect immediately and now share their state with every copy of `schema-utils` in the process directly.
