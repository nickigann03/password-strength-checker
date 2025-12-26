# Technical Documentation: CYBER_SECURE V4.0

## 1. Technology Stack

### Core Framework
- **React 19**: Utilizing the latest concurrent features, Hooks (`useState`, `useEffect`, `useRef`) for state management and side effects.
- **Create React App**: Bootstrapped for quick setup and strict build pipelines.

### Styling & UI
- **Vanilla CSS3**: 
  - Extensive use of **CSS Custom Properties (Variables)** for theming (`--neon-cyan`, `--bg-dark`, `--neon-green`).
  - **CSS Animations** (`@keyframes`) for the matrix effect, scanlines, and UI interactions.
  - **Flexbox & Grid** for responsive layouts.
  - **Glassmorphism**: `backdrop-filter: blur()` effects for the HUD interface.
- **Lucide React**: Lightweight, tree-shakeable SVG icons.

### Security & Cryptography
- **Web Crypto API**: Uses `crypto.subtle.digest('SHA-1', ...)` for high-performance, secure hashing required by the HIBP k-Anonymity protocol.
- **CSprng**: Uses `crypto.getRandomValues()` for the password generator to ensure cryptographically strong randomness, avoiding `Math.random()` for security-critical generation.

### Audio
- **Web Audio API**: Custom `SoundEngine` class that creates oscillators (`sine`, `square`, `sawtooth`) in real-time for retro arcade effects throughout the application. No external audio files are loaded, keeping the bundle size minimal.

---

## 2. Architecture Overview

The application follows a **Component-Based Architecture** centered around a single main view (`App.js`), supported by utility modules.

### Component Tree
```
App.js
├── Phishing Warning Banner
├── Header
│   ├── Title
│   └── Subtitle
└── Terminal Card
    ├── HP Bar (Integrity Meter)
    ├── Terminal Header
    ├── Input Section
    │   ├── Password Input
    │   ├── Action Buttons (Copy, Generate, Passphrase, PII, Show/Hide)
    │   ├── Combo Counter
    │   ├── PII Form (Optional)
    │   ├── Generator Panel (Optional)
    │   ├── Passphrase Panel (Optional)
    │   └── HIBP Warning (Conditional)
    ├── Achievements Panel
    ├── Achievement Log
    ├── Stats Grid (Entropy, Brute Force, Breach Status)
    ├── Crack Times Panel (Single PC, Botnet, Supercomputer)
    ├── Character Breakdown Panel
    ├── Weakness Reasons Panel
    └── Requirements Checklist
```

---

## 3. Data Flow & State Management

### Local State (React `useState`)
The application manages all transient state locally:

| State Variable | Type | Description |
|---------------|------|-------------|
| `password` | string | Current user input |
| `strength` | number (0-5) | Calculated strength tier |
| `securityLevel` | number (0-100) | Percentage security score |
| `checks` | object | Boolean map of all security requirements |
| `pwnedCount` | number | Result from HIBP API (null, 0, or >0) |
| `combo` | number | Gamification counter for typing speed |
| `charBreakdown` | object | Count of each character type |
| `crackTimes` | object | Estimated crack times for different scenarios |
| `weaknessReasons` | array | List of specific weakness explanations |
| `personalInfo` | object | Optional PII data for correlation check |
| `piiWarnings` | array | Warnings about personal data in password |
| `passphraseRec` | object | Generated passphrase recommendation |

### External Data Flow (HIBP API)
The application interacts with the **Have I Been Pwned** API using the **k-Anonymity** model to ensure user privacy.

```
[User Input] → [SHA-1 Hash] → [Prefix (5 chars)] → [API Request]
                                                      | 
                                                      v
[API Response (List of Suffixes)] → [Local Match Check] → [Result]
```

**Privacy Model:**
1. Only the first 5 characters of the password's SHA-1 hash are sent to the server
2. Server returns all matching suffixes (hundreds of hashes)
3. Client searches locally for the exact match
4. Password is NEVER transmitted in any form

---

## 4. Security Logic Details

### Entropy Calculation
```javascript
E = log2(R^L)
```
- **R**: Character pool size (26 lower + 26 upper + 10 digits + 32 symbols + 128 extended + 1000 unicode)
- **L**: Length of password

### Crack Time Estimation
| Scenario | Speed | Use Case |
|----------|-------|----------|
| Single Computer | 10 billion/sec | Consumer GPU cracking |
| Botnet | 100 billion/sec | Distributed attack network |
| Supercomputer | 1 trillion/sec | Nation-state level attack |

### Pattern Detection Algorithms

#### Keyboard Walks
- Checks against QWERTY layout rows
- Detects both forward and reverse patterns
- Includes diagonal patterns (zaq1, xsw2, etc.)

#### Dictionary Checks
- 50+ common passwords
- 50+ common first names
- 50+ popular sports teams

#### Leet Speak Normalization
```javascript
const replacements = {
  '4': 'a', '@': 'a',
  '8': 'b',
  '3': 'e',
  '1': 'i', '!': 'i',
  '0': 'o',
  '$': 's', '5': 's',
  '7': 't'
};
```

### NIST SP 800-63B Compliance
Checks for:
- Minimum 8 characters
- Maximum 64 characters (supports up to)
- No known breached passwords
- No excessive repetition
- No context-specific words (password, admin, login)

---

## 5. Directory Structure

```
/src
├── App.js              # Main Component & Logic Controller
├── App.css             # Component-specific styles (legacy)
├── PasswordChecker.css # Main Theme Styles (Cyberpunk System)
├── SecurityUtils.js    # Logic: Hashing, Entropy, Pattern Detection, NIST
├── SoundEngine.js      # Logic: Web Audio API implementation
├── index.js            # Entry Point
└── index.css           # Global Resets
```

---

## 6. API Reference

### SecurityUtils.js Exports

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `checkPwnedPassword` | password | number | HIBP breach count |
| `normalizeLeet` | password | string | Leet-speak normalized string |
| `checkKeyboardPatterns` | password | string\|null | Detected pattern or null |
| `checkDates` | password | boolean | True if date pattern found |
| `checkDictionary` | password | boolean | True if common word found |
| `checkSportsTeams` | password | boolean | True if sports team found |
| `checkExtendedChars` | password | object | Extended char detection results |
| `detectLeetSpeak` | password | boolean | True if leet pattern found |
| `checkPersonalInfo` | password, info | array | List of PII warnings |
| `checkRepetition` | password | object | Repetition pattern results |
| `checkSequential` | password | string\|null | Sequential pattern found |
| `checkNISTCompliance` | password, pwnedCount | object | NIST compliance results |
| `getWeaknessReasons` | password, checks, analysis | array | Detailed weakness list |
| `calculateEntropyAdvanced` | password | object | Entropy and pool info |
| `estimateCrackTimes` | entropy | object | Multiple crack estimates |
| `generatePassphraseRecommendation` | - | object | Diceware passphrase |

---

## 7. Security Considerations

### Client-Side Only
All processing happens in the browser. The only network request is to the HIBP API using k-Anonymity.

### Auto-Clear Protection
Password input automatically clears after 60 seconds of inactivity to prevent:
- Shoulder surfing
- Screen capture attacks
- Unattended access

### Input Sanitization
```html
<input
  autocomplete="off"
  autocorrect="off"
  autocapitalize="off"
  spellcheck="false"
  data-lpignore="true"
/>
```

---

## 8. Performance Optimizations

- **Debounced HIBP Check**: 800ms delay before API call
- **Memoized Calculations**: Entropy calculated once per password change
- **Optimized Matrix Effect**: Sparse character rendering with canvas
- **Lazy State Updates**: Only re-render on meaningful changes

---

## 9. Browser Compatibility

| Feature | Support |
|---------|---------|
| Web Crypto API | Chrome 37+, Firefox 34+, Safari 11+, Edge 12+ |
| CSS Variables | Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+ |
| Backdrop Filter | Chrome 76+, Firefox 103+, Safari 9+, Edge 17+ |

---

## 10. Version History

| Version | Date | Changes |
|---------|------|---------|
| V4.0 | 2024-12 | NIST compliance, PII checking, passphrase generator, crack time estimates, character breakdown, extended Unicode support |
| V3.0 | 2024-11 | HIBP integration, gamification, password generator |
| V2.0 | 2024-10 | Pattern detection, dictionary checks |
| V1.0 | 2024-09 | Initial release |
