---
"schema-utils": minor
---

author: laymonage
author: alexander-akait

The `absolutePath` keyword accepts an optional `file://` prefix now, so a path from `import.meta.resolve()` can be passed to an option that takes an absolute path. Options that take a relative path reject such a value instead, they used to accept it.
