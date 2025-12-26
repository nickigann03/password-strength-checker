# 📐 Technical Documentation — CYBER_SECURE V4.0

> Comprehensive technical overview of the password strength analyzer architecture, data flows, and security implementations.

---

## 📊 Table of Contents

1. [System Architecture](#-system-architecture)
2. [User Flow](#-user-flow)
3. [Password Analysis Pipeline](#-password-analysis-pipeline)
4. [HIBP Integration Flow](#-hibp-integration-flow)
5. [Component Architecture](#-component-architecture)
6. [Security Logic Details](#-security-logic-details)
7. [Data Models](#-data-models)
8. [API Reference](#-api-reference)
9. [Performance Optimizations](#-performance-optimizations)
10. [Browser Compatibility](#-browser-compatibility)

---

## 🏗️ System Architecture

The application follows a purely client-side architecture with a single external API integration for breach checking.

```mermaid
flowchart TB
    subgraph Browser["🖥️ Client Browser"]
        direction TB
        
        subgraph UI["UI Layer"]
            Input["Password Input"]
            Meter["Strength Meter"]
            Reqs["Requirements List"]
            Stats["Stats Dashboard"]
            Achievements["Achievement System"]
        end
        
        subgraph Logic["Logic Layer"]
            Analyzer["Password Analyzer"]
            Generator["Password Generator"]
            Passphrase["Passphrase Generator"]
        end
        
        subgraph Security["Security Layer"]
            Entropy["Entropy Calculator"]
            Patterns["Pattern Detector"]
            Dictionary["Dictionary Checker"]
            NIST["NIST Validator"]
            PII["PII Correlator"]
        end
        
        subgraph Crypto["Crypto Layer"]
            SHA1["SHA-1 Hasher"]
            CSPRNG["Crypto RNG"]
        end
        
        subgraph Audio["Audio Layer"]
            SoundEngine["Web Audio Oscillators"]
        end
    end
    
    subgraph External["🌐 External Services"]
        HIBP["Have I Been Pwned API<br/>(k-Anonymity)"]
    end
    
    Input --> Analyzer
    Analyzer --> Security
    Security --> Crypto
    Crypto -->|"5-char prefix only"| HIBP
    HIBP -->|"Hash suffixes"| Crypto
    Analyzer --> UI
    Generator --> CSPRNG
    Passphrase --> CSPRNG
    UI --> SoundEngine
```

---

## 👤 User Flow

The complete user journey from initial load to password validation.

```mermaid
flowchart LR
    A["🌐 User Opens App"] --> B["📝 Enter Password"]
    B --> C{"Real-time Analysis"}
    
    C --> D["📊 Entropy Calculated"]
    C --> E["🔍 Patterns Detected"]
    C --> F["📖 Dictionary Check"]
    C --> G["🌍 HIBP Query"]
    
    D --> H["🎮 UI Updates"]
    E --> H
    F --> H
    G --> H
    
    H --> I{"Strength OK?"}
    
    I -->|No| J["⚠️ View Weaknesses"]
    J --> K["💡 Generate Better Password"]
    K --> B
    
    I -->|Yes| L["✅ Password Approved"]
    L --> M["📋 Copy to Clipboard"]
    
    subgraph Gamification
        H --> N["🏆 Check Achievements"]
        N --> O["🔊 Play Sound"]
    end
```

---

## 🔬 Password Analysis Pipeline

Detailed sequence of how a password is analyzed in real-time.

```mermaid
sequenceDiagram
    participant U as User
    participant I as Input Component
    participant A as Analyzer
    participant E as Entropy Calc
    participant P as Pattern Detector
    participant D as Dictionary Checker
    participant H as HIBP Checker
    participant N as NIST Validator
    participant UI as UI Components

    U->>I: Types character
    I->>A: Trigger analysis
    
    par Parallel Analysis
        A->>E: Calculate entropy
        E-->>A: 72.5 bits
        
        A->>P: Check patterns
        P-->>A: No keyboard walks
        
        A->>D: Check dictionary
        D-->>A: No common words
        
        A->>N: Validate NIST
        N-->>A: Compliant
    end
    
    A->>H: Check HIBP (debounced 800ms)
    Note over A,H: Only SHA-1 prefix sent
    H-->>A: 0 matches (secure)
    
    A->>UI: Update all components
    UI->>U: Display results
```

---

## 🔐 HIBP Integration Flow

Privacy-preserving breach detection using k-Anonymity.

```mermaid
flowchart TB
    subgraph Client["🖥️ Client (Your Browser)"]
        A["Password: 'MySecurePass123'"]
        B["SHA-1 Hash"]
        C["Split Hash"]
        D["Prefix: 7C4A8"]
        E["Suffix: D09CA3762AF61E59520943DC"]
        F["Local Search"]
        G["Result: SECURE ✅"]
    end
    
    subgraph Server["🌐 HIBP Server"]
        H["API: /range/7C4A8"]
        I["Return ~500 matching suffixes"]
    end
    
    A --> B
    B --> C
    C --> D
    C --> E
    D -->|"Only prefix sent!"| H
    H --> I
    I -->|"All suffixes returned"| F
    E --> F
    F --> G
    
    style D fill:#00ff9d,stroke:#000
    style E fill:#ff5f56,stroke:#000
```

**Privacy Guarantees:**
- ✅ Full password **never** leaves the browser
- ✅ Only 5 characters of the SHA-1 hash are transmitted
- ✅ Server cannot determine which suffix matches
- ✅ Works the same whether password is found or not

---

## 🧩 Component Architecture

React component hierarchy and relationships.

```mermaid
flowchart TB
    subgraph App["App.js (Main Controller)"]
        direction TB
        
        subgraph Header
            Title["CYBER_SECURE Title"]
            Banner["Phishing Warning Banner"]
        end
        
        subgraph TerminalCard["Terminal Card"]
            HP["HP Bar / Integrity Meter"]
            
            subgraph InputSection
                PWInput["Password Input"]
                Actions["Action Buttons"]
                Combo["Combo Counter"]
            end
            
            subgraph Panels["Optional Panels"]
                GenPanel["Generator Panel"]
                PPPanel["Passphrase Panel"]
                PIIPanel["PII Check Panel"]
            end
            
            Warning["HIBP Warning"]
            Achievements["Achievement Badges"]
            Log["Achievement Log"]
            
            subgraph Analytics
                Stats["Stats Grid"]
                CrackTimes["Crack Time Estimates"]
                CharBreak["Character Breakdown"]
                Weakness["Weakness Reasons"]
            end
            
            Requirements["Requirements Checklist"]
        end
        
        Footer
    end
    
    subgraph Utils["Utility Modules"]
        SecUtils["SecurityUtils.js"]
        SoundEng["SoundEngine.js"]
    end
    
    App --> SecUtils
    App --> SoundEng
```

---

## 🧮 Security Logic Details

### Entropy Calculation

```
E = log₂(R^L)
```

| Character Set | Pool Size (R) |
|--------------|---------------|
| Lowercase (a-z) | 26 |
| Uppercase (A-Z) | 26 |
| Numbers (0-9) | 10 |
| Symbols (!@#$...) | 32 |
| Extended ASCII | 128 |
| Unicode/Emoji | 1000+ |

**Example:** A 12-character password using lowercase + uppercase + numbers + symbols:
```
R = 26 + 26 + 10 + 32 = 94
E = log₂(94^12) = 78.7 bits
```

### Crack Time Scenarios

```mermaid
flowchart LR
    subgraph Speed["Attack Speeds"]
        PC["💻 Single PC<br/>10B guesses/sec"]
        Bot["🌐 Botnet<br/>100B guesses/sec"]
        Super["🖥️ Supercomputer<br/>1T guesses/sec"]
    end
    
    subgraph Formula
        Calc["Time = 2^entropy / speed"]
    end
    
    PC --> Calc
    Bot --> Calc
    Super --> Calc
```

### Pattern Detection

| Pattern Type | Detection Method | Example |
|-------------|------------------|---------|
| Keyboard Walks | QWERTY adjacency matrix | `qwerty`, `asdf` |
| Sequential | Alphabet/number order | `abcde`, `12345` |
| Repetition | Regex: `(.)\1{2,}` | `aaaaa`, `111` |
| Leet Speak | Character mapping | `P@ssw0rd` → `password` |
| Dates | Regex: `/(19|20)\d{2}/` | `1995`, `2024` |
| Dictionary | Word list inclusion | `password`, `admin` |
| Sports Teams | Curated list | `arsenal`, `lakers` |

---

## 📦 Data Models

### Password Check State

```typescript
interface PasswordChecks {
  length: boolean;        // >= 12 characters
  hasLower: boolean;      // a-z present
  hasUpper: boolean;      // A-Z present
  hasNumber: boolean;     // 0-9 present
  hasSpecial: boolean;    // Symbols present
  hasExtended: boolean;   // Unicode/Emoji
  types: boolean;         // All 4 basic types
  noCommon: boolean;      // No dictionary words
  noSequential: boolean;  // No patterns
  noRepeating: boolean;   // No repetition
  minEntropy: boolean;    // >= 60 bits
  noPwned: boolean;       // Not in breaches
  noDates: boolean;       // No year patterns
  noSportsTeam: boolean;  // No team names
  noLeetSpeak: boolean;   // No obvious leet
  nistCompliant: boolean; // Meets NIST guidelines
}
```

### Weakness Reason

```typescript
interface WeaknessReason {
  severity: 'critical' | 'warning' | 'info';
  message: string;
}
```

### Crack Time Estimate

```typescript
interface CrackTimeEstimate {
  name: string;
  guessesPerSec: number;
  icon: string;
  time: {
    value: string | number;
    unit: string;
  };
  seconds: number;
}
```

---

## 🔌 API Reference

### SecurityUtils.js Exports

```mermaid
classDiagram
    class SecurityUtils {
        +checkPwnedPassword(password) Promise~number~
        +checkKeyboardPatterns(password) string|null
        +checkDates(password) boolean
        +checkDictionary(password) boolean
        +checkSportsTeams(password) boolean
        +checkExtendedChars(password) object
        +detectLeetSpeak(password) boolean
        +checkPersonalInfo(password, info) array
        +checkRepetition(password) object
        +checkSequential(password) string|null
        +checkNISTCompliance(password, pwnedCount) object
        +getWeaknessReasons(password, checks, analysis) array
        +calculateEntropyAdvanced(password) object
        +estimateCrackTimes(entropy) object
        +generatePassphraseRecommendation() object
    }
```

### SoundEngine.js

```mermaid
classDiagram
    class SoundEngine {
        -audioContext AudioContext
        -enabled boolean
        +init() void
        +toggle() boolean
        +playKeystroke() void
        +playDelete() void
        +playSuccess() void
    }
```

---

## ⚡ Performance Optimizations

| Optimization | Implementation |
|-------------|----------------|
| **Debounced HIBP** | 800ms delay before API call |
| **useCallback** | Memoized password generator |
| **Lazy Panels** | Generator/Passphrase panels render on demand |
| **Canvas Optimization** | Sparse matrix rain with RAF |
| **Parallel Analysis** | All checks run simultaneously |

---

## 🌐 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Web Crypto API | 37+ | 34+ | 11+ | 12+ |
| CSS Variables | 49+ | 31+ | 9.1+ | 15+ |
| Backdrop Filter | 76+ | 103+ | 9+ | 17+ |
| Web Audio API | 35+ | 25+ | 6+ | 12+ |

---

## 📁 Directory Structure

```
password-strength-checker/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js              # Main component & state
│   ├── App.css             # Minimal overrides
│   ├── PasswordChecker.css # Full cyberpunk theme
│   ├── SecurityUtils.js    # All security logic
│   ├── SoundEngine.js      # Web Audio implementation
│   ├── index.js            # Entry point
│   └── index.css           # Global resets
├── README.md               # Project overview
├── TECHNICAL.md            # This file
├── package.json
└── .gitignore
```

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| **4.0** | Dec 2024 | NIST compliance, PII check, passphrase generator, character breakdown, multiple crack estimates |
| **3.0** | Nov 2024 | HIBP integration, gamification, password generator |
| **2.0** | Oct 2024 | Pattern detection, dictionary checks |
| **1.0** | Sep 2024 | Initial release |

---

<div align="center">

**Built with 🔒 and React. Your passwords are safe with us (because we never see them).**

</div>
