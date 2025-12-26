
// SHA-1 Hashing for k-Anonymity (HIBP)
async function sha1(str) {
    const enc = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-1', enc.encode(str));
    return Array.from(new Uint8Array(hash))
        .map(v => v.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
}

// Check HaveIBeenPwned API (k-Anonymity)
export async function checkPwnedPassword(password) {
    if (!password) return 0;

    try {
        const hash = await sha1(password);
        const prefix = hash.slice(0, 5);
        const suffix = hash.slice(5);

        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const text = await response.text();

        // Parse response
        const match = text.split('\n').find(line => line.startsWith(suffix));
        if (match) {
            return parseInt(match.split(':')[1], 10);
        }
        return 0;
    } catch (error) {
        console.error("HIBP Check Failed:", error);
        return 0;
    }
}

// Leet Speak Normalizer (Extended)
export function normalizeLeet(password) {
    const replacements = {
        '4': 'a', '@': 'a', '^': 'a',
        '8': 'b', '|3': 'b',
        '(': 'c', '{': 'c', '[': 'c', '<': 'c',
        '3': 'e', '€': 'e',
        '6': 'g', '9': 'g',
        '1': 'i', '!': 'i', '|': 'i',
        '0': 'o', '()': 'o',
        '$': 's', '5': 's',
        '7': 't', '+': 't',
        '2': 'z',
        '\/': 'v', '\\': 'v'
    };

    return password.toLowerCase().split('').map(char => replacements[char] || char).join('');
}

// Keyboard Pattern Heuristics (Adjacency Check)
export function checkKeyboardPatterns(password) {
    const keyboards = [
        '1234567890-=',
        'qwertyuiop[]\\',
        'asdfghjkl;\'',
        'zxcvbnm,./',
        'qazwsxedcrfvtgbyhnujmik,ol.p;/', // Verticalish
        '!@#$%^&*()_+', // Shift row
        'zaq1', 'xsw2', 'cde3', 'vfr4', 'bgt5', 'nhy6', 'mju7', ',ki8', '.lo9', '/;p0' // Diagonals
    ];

    const lowerPwd = password.toLowerCase();

    // Check for 3+ sequence run
    for (let i = 2; i < lowerPwd.length; i++) {
        const trip = lowerPwd.slice(i - 2, i + 1);
        const revTrip = trip.split('').reverse().join('');

        for (const row of keyboards) {
            if (row.includes(trip) || row.includes(revTrip)) {
                return trip; // Return the pattern found
            }
        }
    }
    return null;
}

// Date Patterns (Years, Birthdays)
export function checkDates(password) {
    const patterns = [
        /(19|20)\d{2}/,       // Years 19xx, 20xx (1900-2099)
        /\d{2}(0[1-9]|1[0-2])(19|20)\d{2}/, // DDMMYYYY
        /(0[1-9]|1[0-2])\d{2}(19|20)\d{2}/, // MMDDYYYY
        /\d{1,2}\/\d{1,2}\/\d{2,4}/, // MM/DD/YY or MM/DD/YYYY
        /\d{1,2}-\d{1,2}-\d{2,4}/  // MM-DD-YY or MM-DD-YYYY
    ];
    return patterns.some(p => p.test(password));
}

// Extended Dictionary/Name/Sports Team Check
export function checkDictionary(password) {
    const common = [
        'password', 'admin', 'welcome', 'login', 'user', 'guest', 'root', 'super',
        'master', 'access', 'freedom', 'shadow', 'dragon', 'baseball', 'football',
        'monkey', 'letmein', 'princess', 'cookie', 'computer', 'orange', 'yellow',
        'purple', 'summer', 'winter', 'autumn', 'spring', 'secret', 'secure',
        'family', 'friend', 'house', 'system', 'network', 'server', 'portal',
        'qwerty', 'iloveyou', 'sunshine', 'trustno1', 'batman', 'superman',
        'passw0rd', 'abc123', 'hello', 'whatever', 'jordan', 'hunter', 'buster',
        'soccer', 'hockey', 'ranger', 'harley', 'shadow', 'andrew', 'charlie',
        'starwars', 'cheese', 'banana', 'cherry', 'ginger', 'maggie', 'pepper'
    ];

    const names = [
        'james', 'john', 'robert', 'michael', 'william', 'david', 'richard',
        'joseph', 'thomas', 'charles', 'mary', 'patricia', 'jennifer', 'linda',
        'elizabeth', 'barbara', 'susan', 'jessica', 'sarah', 'karen', 'lisa',
        'nancy', 'betty', 'sandra', 'ashley', 'michelle', 'olivia', 'emma',
        'ava', 'sophia', 'isabella', 'charlotte', 'amelia', 'mia', 'harper',
        'evelyn', 'abigail', 'emily', 'ella', 'madison', 'scarlett', 'victoria',
        'aria', 'grace', 'chloe', 'camila', 'penelope', 'riley', 'layla', 'lillian'
    ];

    // Sports Teams (football, etc.)
    const sportsTeams = [
        'arsenal', 'barcelona', 'bayern', 'chelsea', 'juventus', 'liverpool',
        'manchester', 'mancity', 'manunited', 'realmadrid', 'tottenham', 'milan',
        'inter', 'celtic', 'rangers', 'everton', 'wolves', 'newcastle', 'leeds',
        'patriots', 'cowboys', 'eagles', 'packers', 'chiefs', 'broncos', 'raiders',
        'giants', 'dolphins', 'saints', 'falcons', '49ers', 'seahawks', 'ravens',
        'steelers', 'chargers', 'rams', 'bears', 'vikings', 'jets', 'bills',
        'lakers', 'celtics', 'bulls', 'warriors', 'knicks', 'heat', 'spurs',
        'yankees', 'redsox', 'dodgers', 'cubs', 'braves', 'cardinals', 'giants'
    ];

    // Check for exact match or coverage
    const lower = password.toLowerCase();
    const normalized = normalizeLeet(password);

    // Direct inclusion check (both original and leet-normalized)
    const allWords = [...common, ...names, ...sportsTeams];
    if (allWords.some(word => lower.includes(word) || normalized.includes(word))) return true;

    return false;
}

// Check for Sports Team Names specifically
export function checkSportsTeams(password) {
    const sportsTeams = [
        'arsenal', 'barcelona', 'bayern', 'chelsea', 'juventus', 'liverpool',
        'manchester', 'mancity', 'manunited', 'realmadrid', 'tottenham', 'milan',
        'inter', 'celtic', 'rangers', 'everton', 'wolves', 'newcastle', 'leeds',
        'patriots', 'cowboys', 'eagles', 'packers', 'chiefs', 'broncos', 'raiders',
        'giants', 'dolphins', 'saints', 'falcons', '49ers', 'seahawks', 'ravens',
        'steelers', 'chargers', 'rams', 'bears', 'vikings', 'jets', 'bills',
        'lakers', 'celtics', 'bulls', 'warriors', 'knicks', 'heat', 'spurs',
        'yankees', 'redsox', 'dodgers', 'cubs', 'braves', 'cardinals'
    ];
    const lower = password.toLowerCase();
    const normalized = normalizeLeet(password);
    return sportsTeams.some(team => lower.includes(team) || normalized.includes(team));
}

// Check for Extended ASCII/Unicode characters (Emojis, Accented letters)
export function checkExtendedChars(password) {
    const extendedASCII = /[\u0080-\u00FF]/; // Extended ASCII (128-255)
    const unicode = /[\u0100-\uFFFF]/; // General Unicode
    const emoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;

    return {
        hasExtendedASCII: extendedASCII.test(password),
        hasUnicode: unicode.test(password),
        hasEmoji: emoji.test(password),
        hasAny: extendedASCII.test(password) || unicode.test(password) || emoji.test(password)
    };
}

// Check for Leet Speak patterns
export function detectLeetSpeak(password) {
    const leetPatterns = [
        /p[@4]ss/i, /p[@4]55/i, /[@4]dmin/i, /l0v[e3]/i, /h[@4]ck/i,
        /s[e3]cur/i, /w[e3]lcom/i, /l[e3]tm[e3]in/i, /[@4]cc[e3]ss/i
    ];
    return leetPatterns.some(p => p.test(password));
}

// Personal Information Check (PII)
export function checkPersonalInfo(password, personalData = {}) {
    const { name = '', email = '', birthYear = '', phone = '' } = personalData;
    const lower = password.toLowerCase();

    const issues = [];

    // Check name parts
    if (name) {
        const nameParts = name.toLowerCase().split(/\s+/);
        nameParts.forEach(part => {
            if (part.length > 2 && lower.includes(part)) {
                issues.push(`Contains your name: "${part}"`);
            }
        });
    }

    // Check email username
    if (email) {
        const username = email.split('@')[0].toLowerCase();
        if (username.length > 2 && lower.includes(username)) {
            issues.push(`Contains your email username: "${username}"`);
        }
    }

    // Check birth year
    if (birthYear && lower.includes(birthYear.toString())) {
        issues.push(`Contains your birth year: "${birthYear}"`);
    }

    // Check phone digits
    if (phone) {
        const digits = phone.replace(/\D/g, '');
        if (digits.length >= 4 && password.includes(digits.slice(-4))) {
            issues.push('Contains phone number digits');
        }
    }

    return issues;
}

// Check for Repetition patterns
export function checkRepetition(password) {
    // Check for 3+ repeated characters
    const tripleRepeat = /(.)\1{2,}/;
    // Check for repeating pairs (abab, cdcd)
    const pairRepeat = /(.{2,})\1+/;

    return {
        hasTripleRepeat: tripleRepeat.test(password),
        hasPairRepeat: pairRepeat.test(password),
        hasAny: tripleRepeat.test(password) || pairRepeat.test(password)
    };
}

// Check for Sequential strings (abc, 123, etc.)
export function checkSequential(password) {
    const sequences = [
        'abcdefghijklmnopqrstuvwxyz',
        'zyxwvutsrqponmlkjihgfedcba',
        '0123456789',
        '9876543210'
    ];

    const lower = password.toLowerCase();

    for (let i = 2; i < lower.length; i++) {
        const triple = lower.slice(i - 2, i + 1);
        for (const seq of sequences) {
            if (seq.includes(triple)) {
                return triple;
            }
        }
    }
    return null;
}

// NIST SP 800-63B Compliance Check
export function checkNISTCompliance(password, pwnedCount = 0) {
    const issues = [];

    // NIST recommends minimum 8 characters (we use 12 for stronger security)
    if (password.length < 8) {
        issues.push('NIST: Password must be at least 8 characters');
    }

    // NIST recommends supporting up to 64 characters
    if (password.length > 64) {
        issues.push('NIST: Password exceeds 64 character maximum');
    }

    // NIST recommends checking against breached passwords
    if (pwnedCount > 0) {
        issues.push('NIST: Password appears in known data breaches');
    }

    // NIST discourages truncated or repetitive patterns
    if (/(.)\1{2,}/.test(password)) {
        issues.push('NIST: Contains excessive character repetition');
    }

    // NIST discourages context-specific words
    const contextWords = ['password', 'admin', 'user', 'login', 'welcome'];
    const lower = password.toLowerCase();
    if (contextWords.some(w => lower.includes(w))) {
        issues.push('NIST: Contains common password-related words');
    }

    return {
        isCompliant: issues.length === 0,
        issues
    };
}

// Generate specific weakness reasons
export function getWeaknessReasons(password, checks, analysis) {
    const reasons = [];

    if (password.length < 8) {
        reasons.push({ severity: 'critical', message: 'Too short (under 8 characters)' });
    } else if (password.length < 12) {
        reasons.push({ severity: 'warning', message: 'Too short (under 12 characters)' });
    }

    if (!checks.hasLower) {
        reasons.push({ severity: 'info', message: 'No lowercase letters' });
    }
    if (!checks.hasUpper) {
        reasons.push({ severity: 'info', message: 'No uppercase letters' });
    }
    if (!checks.hasNumber) {
        reasons.push({ severity: 'info', message: 'No numbers' });
    }
    if (!checks.hasSpecial) {
        reasons.push({ severity: 'info', message: 'No special characters' });
    }

    if (analysis.hasDates) {
        reasons.push({ severity: 'warning', message: 'Contains a year (1990-2029) or date pattern' });
    }

    if (analysis.hasKeyboardPattern) {
        reasons.push({ severity: 'warning', message: `Contains keyboard pattern: "${analysis.keyboardPattern}"` });
    }

    if (analysis.hasSequential) {
        reasons.push({ severity: 'warning', message: `Contains sequential pattern: "${analysis.sequential}"` });
    }

    if (analysis.hasRepetition) {
        reasons.push({ severity: 'warning', message: 'Contains repeated characters (aaa, 111)' });
    }

    if (analysis.hasDictionaryWord) {
        reasons.push({ severity: 'warning', message: 'Contains common dictionary word or name' });
    }

    if (analysis.hasSportsTeam) {
        reasons.push({ severity: 'warning', message: 'Uses a common sports team name' });
    }

    if (analysis.hasLeetSpeak) {
        reasons.push({ severity: 'warning', message: 'Uses predictable leet speak substitutions (P@ssw0rd)' });
    }

    if (analysis.pwnedCount > 0) {
        reasons.push({ severity: 'critical', message: `Found in ${analysis.pwnedCount.toLocaleString()} data breaches` });
    }

    if (analysis.entropy < 40) {
        reasons.push({ severity: 'critical', message: `Very low entropy (${Math.round(analysis.entropy)} bits) - easily guessable` });
    } else if (analysis.entropy < 60) {
        reasons.push({ severity: 'warning', message: `Low entropy (${Math.round(analysis.entropy)} bits) - could be stronger` });
    }

    return reasons;
}

// Enhanced Entropy Calculation with Extended Character Support
export function calculateEntropyAdvanced(password) {
    if (!password) return { entropy: 0, pool: 0 };

    let pool = 0;
    const charSets = {
        lower: /[a-z]/.test(password),
        upper: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[^a-zA-Z0-9]/.test(password),
        extended: /[\u0080-\u00FF]/.test(password),
        unicode: /[\u0100-\uFFFF]/.test(password)
    };

    if (charSets.lower) pool += 26;
    if (charSets.upper) pool += 26;
    if (charSets.number) pool += 10;
    if (charSets.special) pool += 32;
    if (charSets.extended) pool += 128;
    if (charSets.unicode) pool += 1000; // Simplified estimate

    const entropy = pool > 0 ? Math.log2(Math.pow(pool, password.length)) : 0;

    return { entropy, pool, charSets };
}

// Crack Time Estimates for different attack scenarios
export function estimateCrackTimes(entropy) {
    const scenarios = {
        // Single desktop GPU: ~10 billion/sec for MD5
        singleComputer: {
            name: 'Single Computer',
            guessesPerSec: 1e10,
            icon: '💻'
        },
        // Botnet / Cloud: ~100 billion/sec
        botnet: {
            name: 'Botnet Attack',
            guessesPerSec: 1e11,
            icon: '🌐'
        },
        // Supercomputer / Nation State: ~1 trillion/sec
        supercomputer: {
            name: 'Supercomputer',
            guessesPerSec: 1e12,
            icon: '🖥️'
        }
    };

    const formatTime = (seconds) => {
        if (seconds < 1) return { value: 'Instantly', unit: '' };
        if (seconds < 60) return { value: Math.round(seconds), unit: 'seconds' };
        if (seconds < 3600) return { value: Math.round(seconds / 60), unit: 'minutes' };
        if (seconds < 86400) return { value: Math.round(seconds / 3600), unit: 'hours' };
        if (seconds < 31536000) return { value: Math.round(seconds / 86400), unit: 'days' };
        if (seconds < 3153600000) return { value: Math.round(seconds / 31536000), unit: 'years' };
        if (seconds < 3153600000000) return { value: Math.round(seconds / 3153600000), unit: 'centuries' };
        return { value: '∞', unit: 'millennia' };
    };

    const results = {};

    for (const [key, scenario] of Object.entries(scenarios)) {
        const seconds = Math.pow(2, entropy) / scenario.guessesPerSec;
        results[key] = {
            ...scenario,
            time: formatTime(seconds),
            seconds
        };
    }

    return results;
}

// Passphrase Recommendation (Diceware style)
export function generatePassphraseRecommendation() {
    const wordList = [
        'correct', 'horse', 'battery', 'staple', 'orange', 'purple', 'sunset', 'galaxy',
        'thunder', 'crystal', 'dragon', 'phoenix', 'forest', 'mountain', 'ocean', 'river',
        'cascade', 'whisper', 'shadow', 'ember', 'frost', 'velvet', 'cosmic', 'ancient',
        'prism', 'nebula', 'aurora', 'tempest', 'zenith', 'cipher', 'quantum', 'orbit'
    ];

    // Generate a 4-word passphrase
    const cryptoObj = window.crypto || window.msCrypto;
    const randomVals = new Uint32Array(4);
    cryptoObj.getRandomValues(randomVals);

    const words = [];
    for (let i = 0; i < 4; i++) {
        words.push(wordList[randomVals[i] % wordList.length]);
    }

    return {
        passphrase: words.join('-'),
        words,
        explanation: 'Passphrases like "correct-horse-battery-staple" are easier to remember and often stronger than complex passwords.'
    };
}
