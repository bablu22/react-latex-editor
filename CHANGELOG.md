# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New features that will be added in the next release

### Changed

- Changes in existing functionality

### Deprecated

- Features that will be removed in upcoming releases

### Removed

- Features that have been removed

### Fixed

- Bug fixes

### Security

- Security vulnerability fixes

## [1.0.0] - 2024-01-XX

### Added

- Initial release of React Latex Editor
- Rich text editor with TipTap integration
- Mathematical equation support with MathLive
- Table support with resizable columns
- Image and YouTube video embedding
- Dark mode support
- TypeScript definitions
- Comprehensive toolbar with all essential formatting options
- Responsive design for desktop and mobile
- Accessibility features (ARIA labels, keyboard navigation)
- Performance optimizations
- CSS custom properties for easy theming
- Character count functionality
- Code block syntax highlighting with lowlight
- Task list support
- Text alignment options
- Color picker for text and background colors
- Link insertion and editing
- Blockquote support
- Horizontal rule insertion
- Subscript and superscript support
- Text highlighting
- Hard break support
- Placeholder text support
- Auto-focus functionality
- Read-only mode
- Custom image selection callback
- Configurable height settings
- MathJax configuration for Viewer component
- Export to HTML functionality
- Tree-shaking support for optimal bundle size

### Technical Features

- ESM and CommonJS module support
- CSS module exports for styling
- TypeScript declaration files
- Source maps for debugging
- Optimized bundle size (~90KB gzipped)
- CSS optimization (26KB gzipped)
- Browser compatibility (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Node.js 16+ support
- React 18+ and 19+ compatibility

### Documentation

- Comprehensive README with examples
- API reference documentation
- Installation and usage guides
- Customization examples
- Troubleshooting section
- Contributing guidelines
- Browser support information
- Performance metrics
- Accessibility documentation

---

## Version History

### Version 1.0.0

- **Release Date**: January 2024
- **Status**: Initial Release
- **Breaking Changes**: None (initial release)
- **Migration Guide**: N/A

---

## Release Process

### Pre-release Checklist

- [ ] All tests pass
- [ ] TypeScript compilation successful
- [ ] Build process completes without errors
- [ ] Documentation is up to date
- [ ] Changelog is updated
- [ ] Version number is updated in package.json
- [ ] Git tags are created
- [ ] Release notes are prepared

### Release Steps

1. Update version in `package.json`
2. Update this changelog
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub release
6. Publish to npm: `npm publish`

---

## Versioning Strategy

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for added functionality in a backwards compatible manner
- **PATCH** version for backwards compatible bug fixes

### Version Number Format

```
MAJOR.MINOR.PATCH
```

Examples:

- `1.0.0` - Initial release
- `1.1.0` - New features added
- `1.1.1` - Bug fixes
- `2.0.0` - Breaking changes

---

## Support Policy

### Current Version

- Full support and bug fixes
- Security updates
- Feature updates

### Previous Major Versions

- Security updates only
- Critical bug fixes
- No new features

### Deprecated Versions

- No support
- No updates
- Users encouraged to upgrade

---

## Migration Guides

### From Version X to Y

When breaking changes are introduced, migration guides will be provided here.

---

## Contributing to Changelog

When contributing to this project, please update the changelog:

1. Add your changes to the `[Unreleased]` section
2. Use the appropriate category (Added, Changed, Deprecated, Removed, Fixed,
   Security)
3. Provide a clear, concise description of the change
4. Reference any related issues or pull requests

### Changelog Entry Format

```
### Category
- Brief description of the change (#issue-number)
```

Example:

```
### Added
- New image upload feature (#123)
- Support for custom themes (#456)

### Fixed
- Resolve math rendering issue in Safari (#789)
```
