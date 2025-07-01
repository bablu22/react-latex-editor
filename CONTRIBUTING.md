# Contributing to React Rich Text with Math

Thank you for your interest in contributing to React Rich Text with Math! This
document provides guidelines and information for contributors.

## 🤝 How to Contribute

We welcome contributions from the community! Here are the main ways you can
contribute:

- 🐛 **Bug Reports**: Report bugs and issues
- 💡 **Feature Requests**: Suggest new features
- 📝 **Documentation**: Improve documentation
- 🔧 **Code Contributions**: Submit pull requests
- 🧪 **Testing**: Help with testing and quality assurance

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Git

### Setup Development Environment

1. **Fork the repository**

   ```bash
   git clone https://github.com/bablu22/react-latex-editor.git
   cd react-latex-editor
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Run type checking**
   ```bash
   npm run type-check
   ```

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/)
specification:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:

- `feat(editor): add image upload functionality`
- `fix(viewer): resolve math rendering issue`
- `docs(readme): update installation instructions`
- `style(toolbar): improve button spacing`

### Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Write your code
   - Add tests if applicable
   - Update documentation

3. **Test your changes**

   ```bash
   npm run type-check
   npm run build
   npm run preview
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of your changes
   - Include any relevant issue numbers
   - Add screenshots for UI changes

### Pull Request Guidelines

- **Title**: Use a clear, descriptive title
- **Description**: Explain what the PR does and why
- **Tests**: Include tests for new functionality
- **Documentation**: Update docs for new features
- **Breaking Changes**: Clearly mark any breaking changes

## 🧪 Testing

### Running Tests

```bash
# Type checking
npm run type-check

# Build test
npm run build

# Preview build
npm run preview
```

### Testing Guidelines

- Test your changes thoroughly
- Ensure TypeScript compilation passes
- Test in different browsers if applicable
- Verify accessibility features work
- Test with different content types

## 📚 Documentation

### Documentation Guidelines

- Keep documentation up to date
- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Update README for new features

### Documentation Structure

- **README.md**: Main documentation
- **CONTRIBUTING.md**: This file
- **CHANGELOG.md**: Version history
- **API.md**: Detailed API reference (if needed)

## 🐛 Bug Reports

### Before Submitting a Bug Report

1. Check if the issue has already been reported
2. Try to reproduce the issue
3. Check if it's a browser-specific issue
4. Verify you're using the latest version

### Bug Report Template

```markdown
**Describe the bug** A clear and concise description of what the bug is.

**To Reproduce** Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior** A clear and concise description of what you expected to
happen.

**Screenshots** If applicable, add screenshots to help explain your problem.

**Environment:**

- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]
- React Version: [e.g. 18.2.0]

**Additional context** Add any other context about the problem here.
```

## 💡 Feature Requests

### Feature Request Guidelines

- Describe the feature clearly
- Explain why it would be useful
- Provide use cases
- Suggest implementation approach if possible

### Feature Request Template

```markdown
**Is your feature request related to a problem? Please describe.** A clear and
concise description of what the problem is.

**Describe the solution you'd like** A clear and concise description of what you
want to happen.

**Describe alternatives you've considered** A clear and concise description of
any alternative solutions or features you've considered.

**Additional context** Add any other context or screenshots about the feature
request here.
```

## 🏷️ Issue Labels

We use the following labels to categorize issues:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested
- `wontfix`: This will not be worked on

## 📋 Code of Conduct

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team.

## 🎯 Development Roadmap

### Current Focus Areas

- Performance optimizations
- Accessibility improvements
- Mobile responsiveness
- Additional math features
- Plugin system

### Future Features

- Custom extensions support
- Collaborative editing
- Advanced table features
- More math input methods
- Export to different formats

## 📞 Getting Help

If you need help with contributing:

- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Join our community chat (if available)
- Review the documentation

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to React Rich Text with Math! 🎉
