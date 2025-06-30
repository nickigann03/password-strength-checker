# Advanced Password Checker

A modern, interactive password strength checker and generator built with React.

## Features

- **Real-time password strength analysis**
- **Checks for:**
  - Minimum length (12+ characters)
  - Uppercase, lowercase, numbers, and special characters
  - Not a common password
  - No sequential characters (e.g., "abc", "123")
  - No repeating patterns (e.g., "ababab", "111")
  - High entropy (randomness)
  - **No dictionary words**
  - **No common names**
  - **No dates (years, birthdays, etc.)**
- **Password generator**: Instantly create strong, random passwords
- **Copy to clipboard** with one click
- **Crack time estimate**: See how long it would take to brute-force your password
- **Security tips** and best practices
- **Responsive, compact UI** (no unnecessary scrolling)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the app:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Type or generate a password to see its strength and which requirements it passes.
- Use the copy button to copy your password.
- Review the checklist to ensure your password meets all security requirements.

## Security

- **No passwords are stored or transmitted.** All checks are performed locally in your browser.

## License

MIT
