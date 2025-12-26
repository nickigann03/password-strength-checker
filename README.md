# CYBER_SECURE: Advanced Password Strength Checker

## Overview
**CYBER_SECURE** is a modern, high-performance, **100% client-side** Password Strength Checker built with React. It features a stunning Cyberpunk 2077-inspired aesthetic and provides real-time, comprehensive security analysis of user passwords.

It goes beyond simple length checks by analyzing entropy, keyboard patterns, common dictionary words, leet speak patterns, sports team names, personal information correlation, and checking against the "Have I Been Pwned" (HIBP) database for known data breaches.

![CYBER_SECURE Interface](https://via.placeholder.com/800x450?text=CYBER_SECURE+Interface)

---

## Key Features

### 🧠 I. Core Analysis Features (The "Brain")
- **Entropy Calculation**: Measures the true mathematical randomness of the password (in bits) using `E = log2(R^L)` formula.
- **Time-to-Crack Estimation**: Human-readable estimates for:
  - 💻 Single Computer (10 billion guesses/sec)
  - 🌐 Botnet Attack (100 billion guesses/sec)
  - 🖥️ Supercomputer (1 trillion guesses/sec)
- **Character Set Detection**:
  - Lowercase (a-z)
  - Uppercase (A-Z)
  - Numbers (0-9)
  - Special Symbols (!@#$%)
  - Extended ASCII & Unicode (emojis, accented letters)
- **Pattern Recognition (Heuristics)**:
  - Keyboard Walks: `qwerty`, `asdf`, `12345`, `zaq1` patterns
  - Repetition: `aaaaa`, `111111` patterns
  - Sequential: `abcde`, `12345` patterns
  - Leet Speak Detection: Recognizes `P@ssw0rd`, `1ov3`, `4dm1n` patterns
- **Personal Data Correlation**: Optional PII check against name, email, birth year, and phone number
- **Dictionary Attack Check**: Checks against 100+ common words, names, and sports teams

### 🔍 II. Advanced Vulnerability Detection (The "Detective")
- **"Have I Been Pwned" Integration**:
  - Breach Database Check using k-Anonymity (password NEVER fully sent to server)
  - Exposure Count: Shows exactly how many times the password appeared in breaches
- **NIST SP 800-63B Compliance**: Evaluates against federal security standards
- **Contextual Weakness Flagging**:
  - "Contains a year (1990-2029)"
  - "Uses a common football team name"
  - "Too short (under 12 characters)"
  - "Contains keyboard pattern: qwe"
  - And many more specific reasons

### 🛡️ III. Privacy & Architecture (The "Shield")
- **100% Client-Side Processing**: All logic runs in your browser via JavaScript
- **k-Anonymity API**: Only first 5 characters of SHA-1 hash sent for HIBP check
- **Auto-Clear Timeout**: Automatically clears input after 60 seconds of inactivity
- **Clipboard Protection**: `autocomplete="off"`, `autocorrect="off"`, `spellcheck="false"`
- **No Storage**: No cookies, no localStorage, no tracking

### 🎨 IV. User Interface & Experience (The "Face")
- **Dynamic Visual Strength Meter**: HP-bar style meter that changes color (Red → Orange → Yellow → Green)
- **Real-time Feedback Loop**: Checklist that updates instantly as you type
- **Character Breakdown Panel**: Shows count of lowercase, uppercase, numbers, symbols
- **Visibility Toggle**: Eye icon to show/hide password
- **"Generate Strong Password" Button**: Cryptographically secure password generator with customizable:
  - Length (8-32 characters)
  - Character types (A-Z, a-z, 0-9, symbols)
- **"Passphrase Recommendation"**: Diceware-style passphrase generator (e.g., `correct-horse-battery-staple`)
- **Mobile-Responsive Input**: Large touch targets, disabled auto-correct/capitalize

### 📚 V. Educational Features (The "Teacher")
- **"Why is this weak?" Tooltip**: Expandable section explaining each weakness
- **Passphrase Recommendation**: Encourages use of memorable word combinations
- **Phishing Warning Banner**: Static reminder about password security best practices
- **Gamification**:
  - 🐣 Script Kiddie: Type your first character
  - ⚡ Overclocked: Reach 30x Combo
  - 🏰 Fortress: Reach Security Level 90%
  - 🎭 Polyglot: Use all character types
  - 💻 Elite Hacker: Use 20+ characters
  - 🌍 Unicode Master: Use extended characters/emojis
  - 🏛️ NIST Approved: Meet all NIST guidelines

---

## Installation & Usage

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nickigann03/password-strength-checker.git
   cd password-strength-checker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## Technologies
- **React 19**: Core UI library with Hooks for state management
- **Lucide React**: Modern, tree-shakeable SVG icons
- **Vanilla CSS**: Custom advanced animations and glassmorphism effects
- **Web Crypto API**: Secure SHA-1 hashing and cryptographically strong random number generation
- **Web Audio API**: Retro arcade sound effects

---

## Security Guarantees
1. Your password **never leaves your browser** (except the HIBP hash prefix check)
2. No data is stored, logged, or transmitted to any server
3. The application works **fully offline** (except for HIBP breach checking)
4. All source code is open and auditable

---

## License
MIT License.

---

## Version History
- **V4.0**: Added NIST compliance, PII checking, passphrase recommendations, extended Unicode support, character breakdown, multiple crack time estimates
- **V3.0**: Added HIBP integration, gamification, password generator
- **V2.0**: Added pattern detection, dictionary checks
- **V1.0**: Initial release with basic strength checking
