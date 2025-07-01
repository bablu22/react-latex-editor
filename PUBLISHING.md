# Publishing Guide

This guide covers the complete process of publishing the React Rich Text with
Math package to npm.

## Pre-Publishing Checklist

Before publishing, ensure all items are completed:

### ✅ Code Quality

- [ ] All TypeScript compilation passes (`npm run type-check`)
- [ ] Build process completes successfully (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is properly formatted (`npm run format`)

### ✅ Documentation

- [ ] README.md is complete and up-to-date
- [ ] API.md contains comprehensive documentation
- [ ] CHANGELOG.md is updated with current version
- [ ] CONTRIBUTING.md is in place
- [ ] SECURITY.md is included
- [ ] CODE_OF_CONDUCT.md is included
- [ ] LICENSE file is present

### ✅ Package Configuration

- [ ] package.json has correct version number
- [ ] All dependencies are properly listed
- [ ] Peer dependencies are correctly specified
- [ ] Exports are properly configured
- [ ] Files array includes all necessary files
- [ ] Keywords are relevant and comprehensive

### ✅ Testing

- [ ] Package builds successfully
- [ ] TypeScript declarations are generated
- [ ] CSS files are included in build
- [ ] All exports work correctly
- [ ] Styles import works without errors

### ✅ Distribution Files

- [ ] `dist/` directory contains all necessary files
- [ ] TypeScript declaration files are present
- [ ] CSS files are included
- [ ] Source maps are generated (optional)
- [ ] No unnecessary files are included

## Publishing Process

### 1. Update Version

Update the version in `package.json`:

```json
{
  "version": "1.0.0"
}
```

### 2. Update Changelog

Add a new version entry to `CHANGELOG.md`:

```markdown
## [1.0.0] - 2024-01-XX

### Added

- Initial release
- Rich text editor with TipTap
- Mathematical equation support
- ... (list all features)
```

### 3. Build the Package

```bash
npm run build
```

### 4. Test the Build

```bash
# Test TypeScript compilation
npm run type-check

# Preview the build
npm run preview

# Check what files will be published
npm pack --dry-run
```

### 5. Create Git Tag

```bash
git add .
git commit -m "chore: prepare for v1.0.0 release"
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

### 6. Publish to npm

```bash
npm publish
```

### 7. Verify Publication

Check that the package is available on npm:

```bash
npm view react-latex-editor
```

## Automated Publishing with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          registry-url: "https://registry.npmjs.org"

      - name: Install dependencies
        run: npm ci

      - name: Run type check
        run: npm run type-check

      - name: Build package
        run: npm run build

      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Version Management

### Semantic Versioning

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (1.1.0): New features, backwards compatible
- **PATCH** (1.0.1): Bug fixes, backwards compatible

### Version Update Commands

```bash
# Patch version (bug fixes)
npm version patch

# Minor version (new features)
npm version minor

# Major version (breaking changes)
npm version major
```

## Package.json Configuration

### Essential Fields

```json
{
  "name": "react-latex-editor",
  "version": "1.0.0",
  "description": "A powerful React rich text editor with mathematical equation support",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    },
    "./styles": {
      "types": "./dist/styles.d.ts",
      "import": "./dist/react-latex-editor.css",
      "require": "./dist/react-latex-editor.css"
    }
  },
  "files": ["dist"],
  "keywords": [
    "react",
    "rich-text-editor",
    "tiptap",
    "math",
    "mathematical-equations",
    "mathlive",
    "typescript",
    "editor",
    "wysiwyg",
    "content-editor",
    "latex",
    "mathematics",
    "formula-editor"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/bablu22/react-latex-editor.git"
  },
  "bugs": {
    "url": "https://github.com/bablu22/react-latex-editor/issues"
  },
  "homepage": "https://github.com/bablu22/react-latex-editor#readme",
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "sideEffects": false
}
```

## Quality Assurance

### Before Publishing

1. **Test in a new project**:

   ```bash
   npm pack
   # Install the packed version in a test project
   ```

2. **Verify imports work**:

   ```tsx
   import { Editor, Viewer } from "react-latex-editor";
   import "react-latex-editor/styles";
   ```

3. **Check TypeScript support**:

   ```tsx
   import type { EditorRef } from "react-latex-editor";
   ```

4. **Test all features**:
   - Editor functionality
   - Math rendering
   - Styles loading
   - TypeScript declarations

### Post-Publishing Verification

1. **Install from npm**:

   ```bash
   npm install react-latex-editor
   ```

2. **Test in a new project**:

   ```tsx
   import { Editor } from "react-latex-editor";
   import "react-latex-editor/styles";
   ```

3. **Verify documentation**:
   - README displays correctly on npm
   - All links work
   - Examples are functional

## Troubleshooting

### Common Issues

1. **Build fails**:

   - Check TypeScript errors
   - Verify all dependencies are installed
   - Check Vite configuration

2. **Publish fails**:

   - Ensure you're logged in to npm (`npm login`)
   - Check package name availability
   - Verify version number is unique

3. **TypeScript errors in consuming projects**:

   - Verify declaration files are generated
   - Check exports configuration
   - Ensure types are properly exported

4. **Styles not loading**:
   - Verify CSS files are included in build
   - Check exports configuration for styles
   - Test styles import in consuming project

### Rollback Process

If a bad version is published:

1. **Unpublish** (within 72 hours):

   ```bash
   npm unpublish react-latex-editor@1.0.0
   ```

2. **Fix issues** and republish with new version:
   ```bash
   npm version patch
   npm publish
   ```

## Maintenance

### Regular Tasks

1. **Update dependencies**:

   ```bash
   npm update
   npm audit fix
   ```

2. **Monitor issues**:

   - Check GitHub issues
   - Review npm feedback
   - Monitor download statistics

3. **Update documentation**:
   - Keep README current
   - Update examples
   - Add new features to API docs

### Long-term Maintenance

1. **Security updates**: Regularly update dependencies
2. **Performance monitoring**: Track bundle size and performance
3. **User feedback**: Respond to issues and feature requests
4. **Version planning**: Plan major releases and breaking changes

## Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Last Updated**: January 2024
