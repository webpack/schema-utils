---
"schema-utils": minor
---

The `absolutePath` keyword reads a `file:` URL the way Node's own URL parser does: the scheme may be followed by any number of slashes, so `file:/directory` is accepted alongside `file:///directory`, and it is matched case-insensitively, so `FILE:///directory` is too. A scheme with no slash after it — `file:directory` — still names no absolute path and is rejected.
