# TODO

Planned improvements and technical debt items for ftree.

## High Priority

### ESLint 9 Migration

**Status:** Pending
**Dependabot PR:** [#1](https://github.com/ehsan-255/Filter-Tree/pull/1)
**Blocked by:** Configuration format migration required

ESLint 9 introduced a breaking change requiring migration from the legacy `.eslintrc.json` format to the new "flat config" format (`eslint.config.js`).

#### Migration Steps

1. Create `eslint.config.js` with flat config format:

   ```js
   import eslint from '@eslint/js';
   import tseslint from 'typescript-eslint';

   export default [
     eslint.configs.recommended,
     ...tseslint.configs.recommended,
     {
       rules: {
         'no-console': 'off',
         'prefer-const': 'error',
       },
     },
   ];
   ```

2. Delete `.eslintrc.json`

3. Update `package.json` lint script if needed

4. Test with `npm run lint`

5. Merge Dependabot PR #1

#### Resources

- [ESLint Migration Guide](https://eslint.org/docs/latest/use/configure/migration-guide)
- [typescript-eslint Flat Config](https://typescript-eslint.io/getting-started)

---

## Medium Priority

### VS Code Marketplace Publishing

Publish extension to the official VS Code Marketplace (in addition to Open VSX).

**Requires:**

- Azure DevOps account
- Personal Access Token (PAT)
- Publisher account verification

### Real Unit Tests

Replace placeholder test with actual unit tests for:

- Config loading and parsing
- File scanning logic
- Tree building
- Output formatting

---

## Low Priority

### Features

- [ ] Watch mode for CLI
- [ ] Custom output templates
- [ ] Plugin system for custom filters
- [ ] Tree view panel in VS Code sidebar
