import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, Shield, AlertTriangle, Copy, RefreshCw, Zap, Clock, Users } from 'lucide-react';
import './PasswordChecker.css';

const PasswordStrengthChecker = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [checks, setChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noCommon: false,
    noSequential: false,
    noRepeating: false,
    minEntropy: false
  });

  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123', 
    'admin', 'letmein', 'welcome', '1234567890', 'monkey', 'dragon',
    'princess', 'football', 'baseball', 'sunshine', 'master', 'jordan',
    'access', 'flower', 'passw0rd', '1qaz2wsx', 'iloveyou', 'shadow'
  ];

  const dictionaryWords = [
    'about', 'after', 'again', 'air', 'all', 'along', 'also', 'always', 'and', 'animal', 'another', 'answer', 'any', 'are', 'around', 'ask', 'back', 'because', 'been', 'before', 'below', 'between', 'book', 'both', 'boy', 'but', 'by', 'call', 'came', 'can', 'car', 'carry', 'change', 'children', 'city', 'close', 'come', 'country', 'cut', 'day', 'did', 'different', 'do', 'does', 'dog', "don't", 'down', 'each', 'earth', 'eat', 'end', 'enough', 'even', 'every', 'example', 'eye', 'face', 'family', 'far', 'father', 'feet', 'few', 'find', 'first', 'follow', 'food', 'for', 'form', 'found', 'four', 'from', 'front', 'girl', 'give', 'go', 'good', 'got', 'great', 'group', 'grow', 'had', 'hand', 'hard', 'has', 'have', 'he', 'head', 'hear', 'help', 'her', 'here', 'high', 'him', 'his', 'home', 'house', 'how', 'I', 'if', 'important', 'in', 'into', 'is', 'it', 'its', 'just', 'keep', 'kind', 'know', 'land', 'large', 'last', 'later', 'learn', 'leave', 'left', 'let', 'life', 'light', 'like', 'line', 'list', 'little', 'live', 'long', 'look', 'made', 'make', 'man', 'many', 'may', 'me', 'men', 'might', 'more', 'most', 'mother', 'mountain', 'move', 'much', 'must', 'my', 'name', 'near', 'need', 'never', 'new', 'next', 'night', 'no', 'not', 'now', 'number', 'of', 'off', 'often', 'old', 'on', 'once', 'one', 'only', 'open', 'or', 'other', 'our', 'out', 'over', 'own', 'page', 'paper', 'part', 'people', 'place', 'plant', 'play', 'point', 'put', 'question', 'quick', 'read', 'right', 'river', 'run', 'said', 'same', 'saw', 'say', 'school', 'see', 'seem', 'sentence', 'set', 'she', 'should', 'show', 'side', 'small', 'so', 'some', 'something', 'sometimes', 'song', 'soon', 'sound', 'still', 'stop', 'story', 'study', 'such', 'take', 'tell', 'than', 'that', 'the', 'them', 'then', 'there', 'these', 'they', 'thing', 'think', 'this', 'those', 'thought', 'three', 'through', 'time', 'to', 'together', 'too', 'took', 'tree', 'try', 'turn', 'two', 'under', 'until', 'up', 'us', 'use', 'very', 'want', 'was', 'water', 'way', 'we', 'well', 'went', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'why', 'will', 'with', 'word', 'work', 'world', 'would', 'write', 'year', 'you', 'your'
  ];

  const commonNames = [
    'john', 'mary', 'james', 'linda', 'robert', 'patricia', 'michael', 'barbara', 'william', 'elizabeth', 'david', 'jennifer', 'richard', 'maria', 'charles', 'susan', 'joseph', 'margaret', 'thomas', 'dorothy', 'christopher', 'lisa', 'daniel', 'nancy', 'paul', 'karen', 'mark', 'betty', 'donald', 'helen', 'george', 'sandra', 'kenneth', 'donna', 'steven', 'carol', 'edward', 'ruth', 'brian', 'sharon', 'ronald', 'michelle', 'anthony', 'laura', 'kevin', 'sarah', 'jason', 'kimberly', 'matthew', 'deborah'
  ];

  const strengthLevels = [
    { label: 'Very Weak', className: 'very-weak', color: '#ef4444' },
    { label: 'Weak', className: 'weak', color: '#f97316' },
    { label: 'Fair', className: 'fair', color: '#eab308' },
    { label: 'Good', className: 'good', color: '#3b82f6' },
    { label: 'Strong', className: 'strong', color: '#10b981' },
    { label: 'Very Strong', className: 'very-strong', color: '#059669' }
  ];

  const requirements = [
    { key: 'length', label: 'At least 12 characters', check: (pwd) => pwd.length >= 12, icon: '📏' },
    { key: 'uppercase', label: 'Uppercase letters (A-Z)', check: (pwd) => /[A-Z]/.test(pwd), icon: '🔤' },
    { key: 'lowercase', label: 'Lowercase letters (a-z)', check: (pwd) => /[a-z]/.test(pwd), icon: '🔡' },
    { key: 'number', label: 'Numbers (0-9)', check: (pwd) => /\d/.test(pwd), icon: '🔢' },
    { key: 'special', label: 'Special characters (!@#$...)', check: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), icon: '🔣' },
    { key: 'noCommon', label: 'Not a common password', check: (pwd) => pwd.length > 0 && !commonPasswords.includes(pwd.toLowerCase()), icon: '🚫' },
    { key: 'noSequential', label: 'No sequential characters', check: (pwd) => pwd.length > 0 && !hasSequentialChars(pwd), icon: '⚡' },
    { key: 'noRepeating', label: 'No repeating patterns', check: (pwd) => pwd.length > 0 && !hasRepeatingPattern(pwd), icon: '🔄' },
    { key: 'minEntropy', label: 'High entropy (randomness)', check: (pwd) => calculateEntropy(pwd) >= 50, icon: '🎲' },
    { key: 'noDictionary', label: 'No dictionary words', check: (pwd) => pwd.length > 0 && !containsDictionaryWord(pwd), icon: '📚' },
    { key: 'noName', label: 'No common names', check: (pwd) => pwd.length > 0 && !containsName(pwd), icon: '🧑' },
    { key: 'noDate', label: 'No dates', check: (pwd) => pwd.length > 0 && !containsDate(pwd), icon: '📅' }
  ];

  function hasSequentialChars(pwd) {
    const sequences = ['abc', 'bcd', 'cde', '123', '234', '345', 'qwe', 'wer', 'ert'];
    const lowerPwd = pwd.toLowerCase();
    return sequences.some(seq => lowerPwd.includes(seq) || lowerPwd.includes(seq.split('').reverse().join('')));
  }

  function hasRepeatingPattern(pwd) {
    // Check for 3+ repeating characters
    if (/(.)\1{2,}/.test(pwd)) return true;
    
    // Check for simple patterns like abcabc, 123123
    for (let i = 2; i <= pwd.length / 2; i++) {
      const pattern = pwd.substring(0, i);
      const repeated = pattern.repeat(Math.floor(pwd.length / i));
      if (pwd.startsWith(repeated) && repeated.length >= 6) return true;
    }
    return false;
  }

  function calculateEntropy(pwd) {
    if (!pwd) return 0;
    const charset = getCharsetSize(pwd);
    return Math.log2(Math.pow(charset, pwd.length));
  }

  function getCharsetSize(pwd) {
    let size = 0;
    if (/[a-z]/.test(pwd)) size += 26;
    if (/[A-Z]/.test(pwd)) size += 26;
    if (/\d/.test(pwd)) size += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) size += 32;
    return size || 1;
  }

  function estimateCrackTime(pwd) {
    if (!pwd) return '';
    
    const entropy = calculateEntropy(pwd);
    const guessesPerSecond = 1e9; // 1 billion guesses per second (modern GPU)
    const totalCombinations = Math.pow(2, entropy);
    const secondsToCrack = totalCombinations / (2 * guessesPerSecond);
    
    if (secondsToCrack < 1) return 'Instantly';
    if (secondsToCrack < 60) return `${Math.round(secondsToCrack)} seconds`;
    if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`;
    if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} hours`;
    if (secondsToCrack < 31536000) return `${Math.round(secondsToCrack / 86400)} days`;
    if (secondsToCrack < 31536000000) return `${Math.round(secondsToCrack / 31536000)} years`;
    return 'Centuries';
  }

  function generatePassword() {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = lowercase + uppercase + numbers + symbols;
    
    let result = '';
    // Ensure at least one of each type
    result += lowercase[Math.floor(Math.random() * lowercase.length)];
    result += uppercase[Math.floor(Math.random() * uppercase.length)];
    result += numbers[Math.floor(Math.random() * numbers.length)];
    result += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < 16; i++) {
      result += all[Math.floor(Math.random() * all.length)];
    }
    
    // Shuffle the result
    return result.split('').sort(() => Math.random() - 0.5).join('');
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy password');
    }
  };

  function containsDictionaryWord(pwd) {
    if (!pwd) return false;
    const lowerPwd = pwd.toLowerCase();
    return dictionaryWords.some(word => word.length > 3 && lowerPwd.includes(word));
  }

  function containsName(pwd) {
    if (!pwd) return false;
    const lowerPwd = pwd.toLowerCase();
    return commonNames.some(name => lowerPwd.includes(name));
  }

  function containsDate(pwd) {
    if (!pwd) return false;
    // Match YYYY, YYYYMMDD, DDMMYYYY, MMDD, etc.
    return /(19|20)\d{2}|\d{8}|\d{2}[\/-]\d{2}[\/-](19|20)\d{2}|\d{2}[\/-]\d{2}/.test(pwd);
  }

  useEffect(() => {
    const newChecks = {};
    requirements.forEach(req => {
      newChecks[req.key] = req.check(password);
    });
    setChecks(newChecks);

    // Calculate strength (0-5)
    const passedChecks = Object.values(newChecks).filter(Boolean).length;
    let newStrength = 0;
    
    if (password.length === 0) {
      newStrength = 0;
    } else if (passedChecks <= 3) {
      newStrength = 1;
    } else if (passedChecks <= 4) {
      newStrength = 2;
    } else if (passedChecks <= 6) {
      newStrength = 3;
    } else if (passedChecks <= 7) {
      newStrength = 4;
    } else {
      newStrength = 5;
    }
    
    setStrength(newStrength);
    setEstimatedTime(estimateCrackTime(password));
  }, [password]);

  const getStrengthInfo = () => {
    if (password.length === 0) return { label: '', className: '', color: '#e5e7eb' };
    return strengthLevels[strength - 1] || strengthLevels[0];
  };

  const strengthInfo = getStrengthInfo();
  const passedChecks = Object.values(checks).filter(Boolean).length;

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="icon-container">
            <Shield className="shield-icon" />
          </div>
          <h1 className="title">Advanced Password Checker</h1>
          <p className="subtitle">Create bulletproof passwords with advanced security analysis</p>
        </div>

        {/* Main Card */}
        <div className="card">
          {/* Password Input */}
          <div className="input-section">
            <label className="input-label">Enter Password</label>
            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                placeholder="Type or generate a secure password..."
              />
              <div className="input-actions">
                {password && (
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="action-button"
                    title="Copy password"
                  >
                    <Copy size={18} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowGenerator(!showGenerator)}
                  className="action-button"
                  title="Generate password"
                >
                  <Zap size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="action-button"
                  title="Toggle visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Generator */}
          {showGenerator && (
            <div className="generator-section">
              <div className="generator-header">
                <RefreshCw className="generator-icon" />
                <span>Password Generator</span>
              </div>
              <button
                onClick={() => setPassword(generatePassword())}
                className="generate-button"
              >
                Generate Secure Password
              </button>
            </div>
          )}

          {/* Stats Row */}
          {password.length > 0 && (
            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-icon">
                  <Shield size={16} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Strength</div>
                  <div className={`stat-value ${strengthInfo.className}`}>
                    {strengthInfo.label}
                  </div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <Clock size={16} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Crack Time</div>
                  <div className="stat-value">{estimatedTime}</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <Users size={16} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Requirements</div>
                  <div className="stat-value">{passedChecks}/12</div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {password.length > 0 && (
            <div className="progress-section">
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ 
                    width: `${(strength / 5) * 100}%`,
                    backgroundColor: strengthInfo.color
                  }}
                />
              </div>
              <div className="progress-labels">
                <span>Weak</span>
                <span>Strong</span>
              </div>
            </div>
          )}

          {/* Requirements Checklist */}
          <div className="requirements-section">
            <h3 className="requirements-title">Security Requirements</h3>
            <div className="requirements-grid">
              {requirements.map((req) => (
                <div
                  key={req.key}
                  className={`requirement-item ${checks[req.key] ? 'checked' : ''}`}
                >
                  <div className="requirement-header">
                    <span className="requirement-emoji">{req.icon}</span>
                    <div className={`requirement-status ${checks[req.key] ? 'checked' : ''}`}>
                      {checks[req.key] ? <Check size={12} /> : <X size={12} />}
                    </div>
                  </div>
                  <span className="requirement-text">{req.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Tips */}
          {password.length === 0 && (
            <div className="tips-section">
              <h4 className="tips-title">🛡️ Security Best Practices</h4>
              <div className="tips-grid">
                <div className="tip-item">
                  <strong>Length Matters:</strong> Longer passwords are exponentially harder to crack
                </div>
                <div className="tip-item">
                  <strong>Mix It Up:</strong> Use uppercase, lowercase, numbers, and symbols
                </div>
                <div className="tip-item">
                  <strong>Avoid Patterns:</strong> No keyboard patterns, sequences, or repetition
                </div>
                <div className="tip-item">
                  <strong>Unique Passwords:</strong> Never reuse passwords across accounts
                </div>
                <div className="tip-item">
                  <strong>Use 2FA:</strong> Enable two-factor authentication when available
                </div>
                <div className="tip-item">
                  <strong>Password Manager:</strong> Consider using a password manager
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {strength >= 4 && (
            <div className="success-section">
              <div className="success-content">
                <div className="success-icon">
                  <Shield className="check-icon" />
                </div>
                <div className="success-text">
                  <h4 className="success-title">Excellent Security! 🎉</h4>
                  <p className="success-message">
                    Your password is {strength === 5 ? 'exceptionally strong' : 'very strong'} and would take {estimatedTime.toLowerCase()} to crack with modern hardware.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <p className="footer-text">
            🔒 Advanced security analysis • Never store or transmit passwords
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthChecker;