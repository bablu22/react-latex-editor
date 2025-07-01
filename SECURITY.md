# Security Policy

## Supported Versions

We are committed to providing security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security
vulnerability in React Latex Editor, please follow these steps:

### 1. **DO NOT** create a public GitHub issue

Security vulnerabilities should be reported privately to prevent potential
exploitation.

### 2. Report the vulnerability

Send an email to [security@yourdomain.com](mailto:security@yourdomain.com) with
the following information:

- **Subject**: `[SECURITY] Vulnerability in react-latex-editor`
- **Description**: Detailed description of the vulnerability
- **Steps to reproduce**: Clear steps to reproduce the issue
- **Impact**: Potential impact of the vulnerability
- **Suggested fix**: If you have a suggested fix (optional)

### 3. What to expect

- **Acknowledgement**: You will receive an acknowledgement within 48 hours
- **Assessment**: We will assess the vulnerability within 7 days
- **Updates**: You will be kept informed of our progress
- **Resolution**: We will work to resolve the issue as quickly as possible

### 4. Disclosure timeline

- **Private disclosure**: Vulnerability is reported and confirmed
- **Fix development**: We develop and test a fix
- **Release**: We release a patch version
- **Public disclosure**: We publicly disclose the vulnerability after the fix is
  available

## Security Best Practices

### For Users

1. **Keep dependencies updated**: Regularly update to the latest version
2. **Review code**: Review the code you're using in production
3. **Report issues**: Report any security concerns immediately
4. **Monitor releases**: Subscribe to security advisories

### For Contributors

1. **Follow secure coding practices**: Use secure coding guidelines
2. **Review pull requests**: Security review all code changes
3. **Test thoroughly**: Ensure security tests pass
4. **Document security features**: Document any security-related features

## Security Features

React Latex Editor includes several security features:

### Content Sanitization

- HTML content is sanitized to prevent XSS attacks
- Dangerous HTML tags and attributes are filtered
- Math content is properly escaped

### Input Validation

- All user inputs are validated
- File uploads are restricted to safe types
- URL inputs are validated for safety

### CSP Compatibility

The package is designed to work with Content Security Policy (CSP):

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
/>
```

### Safe Defaults

- Secure default configurations
- No automatic execution of user content
- Safe fallbacks for all features

## Known Security Considerations

### Math Content

- MathLive integration is used for mathematical content
- Math content is rendered safely without code execution
- LaTeX input is properly sanitized

### File Uploads

- Image uploads are restricted to image formats
- File size limits are enforced
- No executable files are allowed

### External Content

- YouTube embeds use safe iframe configurations
- External links are properly handled
- No automatic loading of external resources

## Security Updates

### How to update

```bash
# Update to the latest version
npm update react-latex-editor

# Or install a specific version
npm install react-latex-editor@latest
```

### Checking for updates

```bash
# Check for outdated packages
npm outdated

# Check for security vulnerabilities
npm audit
```

## Security Contacts

- **Security Email**: [security@yourdomain.com](mailto:security@yourdomain.com)
- **PGP Key**: [Available on request]
- **Responsible Disclosure**: We follow responsible disclosure practices

## Security Acknowledgments

We would like to thank the security researchers and community members who have
helped improve the security of this project through responsible disclosure.

## Security Policy Updates

This security policy may be updated from time to time. Significant changes will
be announced through:

- GitHub releases
- Security advisories
- Email notifications (for reported vulnerabilities)

---

**Last Updated**: January 2024

**Next Review**: July 2024
