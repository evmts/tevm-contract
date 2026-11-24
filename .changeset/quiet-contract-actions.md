---
"@tevm/contract": patch
---

Expose functionName on read and write creators, keep their overloads separate, include custom errors and all eligible overloads in action ABI types, and retain anonymous event metadata from JSON ABIs. Reuse the parsed ABI when binding an address or code, and cache overload grouping and ABI formatting when constructing actions.
