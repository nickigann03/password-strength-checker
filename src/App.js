import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, EyeOff, Copy, RefreshCw, Volume2, VolumeX, ShieldAlert, Timer, Info, AlertTriangle, CheckCircle, XCircle, HelpCircle, Sparkles, User } from 'lucide-react';
import { soundEngine } from './SoundEngine';
import {
  checkPwnedPassword,
  checkKeyboardPatterns,
  checkDates,
  checkDictionary,
  checkSportsTeams,
  checkExtendedChars,
  detectLeetSpeak,
  checkPersonalInfo,
  checkRepetition,
  checkSequential,
  checkNISTCompliance,
  getWeaknessReasons,
  calculateEntropyAdvanced,
  estimateCrackTimes,
  generatePassphraseRecommendation
} from './SecurityUtils';
import './PasswordChecker.css';

const PasswordStrengthChecker = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [securityLevel, setSecurityLevel] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Generator State
  const [genLength, setGenLength] = useState(16);
  const [genOptions, setGenOptions] = useState({ upper: true, lower: true, nums: true, special: true });

  // New: Personal Info State
  const [showPIIForm, setShowPIIForm] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({ name: '', email: '', birthYear: '', phone: '' });
  const [piiWarnings, setPiiWarnings] = useState([]);

  // New: Passphrase Recommendation
  const [passphraseRec, setPassphraseRec] = useState(null);
  const [showPassphrase, setShowPassphrase] = useState(false);

  // New: Detailed Analysis
  const [crackTimes, setCrackTimes] = useState(null);
  const [weaknessReasons, setWeaknessReasons] = useState([]);
  const [showWhyWeak, setShowWhyWeak] = useState(false);

  // New: Character Breakdown
  const [charBreakdown, setCharBreakdown] = useState({
    length: 0,
    lowercase: 0,
    uppercase: 0,
    numbers: 0,
    special: 0,
    extended: 0
  });

  const generatePassword = useCallback(() => {
    const charset = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      nums: '0123456789',
      special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let chars = '';
    if (genOptions.upper) chars += charset.upper;
    if (genOptions.lower) chars += charset.lower;
    if (genOptions.nums) chars += charset.nums;
    if (genOptions.special) chars += charset.special;

    if (!chars) return;

    let newPwd = '';
    const cryptoObj = window.crypto || window.msCrypto;
    const randomVals = new Uint32Array(genLength);
    cryptoObj.getRandomValues(randomVals);

    for (let i = 0; i < genLength; i++) {
      newPwd += chars[randomVals[i] % chars.length];
    }

    setPassword(newPwd);
    soundEngine.playKeystroke();
  }, [genLength, genOptions]);

  // Auto-generate on open
  useEffect(() => {
    if (showGenerator) generatePassword();
  }, [showGenerator, generatePassword]);

  // New State for Advanced Features
  const [pwnedCount, setPwnedCount] = useState(null); // null = not checked, 0 = clean, >0 = pwned
  const [isCheckingPwned, setIsCheckingPwned] = useState(false);
  const [keyboardPattern, setKeyboardPattern] = useState(null);

  // Auto-Clear Timer
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);

  // Gamification State
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lastTypeTime, setLastTypeTime] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [hoveredAchievement, setHoveredAchievement] = useState(null);

  // Matrix Effect Ref
  const canvasRef = useRef(null);

  const [checks, setChecks] = useState({
    length: false,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
    hasExtended: false,
    types: false,
    noCommon: false,
    noSequential: false,
    noRepeating: false,
    minEntropy: false,
    noPwned: false,
    noDates: false,
    noSportsTeam: false,
    noLeetSpeak: false,
    nistCompliant: false
  });

  const achievementsList = [
    { id: 'starter', icon: '🐣', title: 'Script Kiddie', desc: 'Type your first character' },
    { id: 'speedster', icon: '⚡', title: 'Overclocked', desc: 'Reach 30x Combo' },
    { id: 'fortress', icon: '🏰', title: 'Fortress', desc: 'Reach Security Level 90%' },
    { id: 'polyglot', icon: '🎭', title: 'Polyglot', desc: 'Use all character types' },
    { id: 'hacker', icon: '💻', title: 'Elite Hacker', desc: 'Crack the length requirement (20+ chars)' },
    { id: 'unicode', icon: '🌍', title: 'Unicode Master', desc: 'Use extended characters or emojis' },
    { id: 'nist', icon: '🏛️', title: 'NIST Approved', desc: 'Meet all NIST SP 800-63B guidelines' }
  ];

  // Initialize Audio Context on first interaction
  const handleInteraction = () => {
    soundEngine.init();
    resetAutoClear();
  };

  const resetAutoClear = () => {
    setTimeLeft(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPassword('');
          setCombo(0);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    const isEnabled = soundEngine.toggle();
    setSoundEnabled(isEnabled);
    handleInteraction();
  };

  const handlePasswordChange = (e) => {
    handleInteraction();
    const val = e.target.value;
    const now = Date.now();

    // Combo Logic
    if (val.length > password.length) {
      if (now - lastTypeTime < 1500) {
        setCombo(prev => prev + 1);
      } else {
        setCombo(1);
      }
      soundEngine.playKeystroke();
    } else {
      setCombo(0);
      soundEngine.playDelete();
    }

    setLastTypeTime(now);
    if (combo > maxCombo) setMaxCombo(combo);

    setPassword(val);
  };

  // Debounced HIBP Check
  useEffect(() => {
    const checkHIBP = async () => {
      if (password.length > 5) {
        setIsCheckingPwned(true);
        const count = await checkPwnedPassword(password);
        setPwnedCount(count);
        setIsCheckingPwned(false);
      } else {
        setPwnedCount(null);
      }
    };

    const timeoutId = setTimeout(checkHIBP, 800); // 800ms debounce
    return () => clearTimeout(timeoutId);
  }, [password]);

  // Matrix Rain Effect (Optimized)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01AZ';
    const drops = [];
    const fontSize = 14;
    const columns = canvas.width / fontSize;

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 16, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00f3ff';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'welcome'];

  // Advanced Analysis
  const entropyInfo = calculateEntropyAdvanced(password);
  const entropy = entropyInfo.entropy;

  useEffect(() => {
    // Pattern checks
    const kbPattern = checkKeyboardPatterns(password);
    setKeyboardPattern(kbPattern);

    // Character breakdown
    const lower = (password.match(/[a-z]/g) || []).length;
    const upper = (password.match(/[A-Z]/g) || []).length;
    const nums = (password.match(/\d/g) || []).length;
    const special = (password.match(/[^a-zA-Z0-9]/g) || []).length;
    const extended = checkExtendedChars(password);

    setCharBreakdown({
      length: password.length,
      lowercase: lower,
      uppercase: upper,
      numbers: nums,
      special: special,
      extended: extended.hasAny ? 1 : 0
    });

    // Basic validity checks
    const hasLength = password.length >= 12;
    const hasLower = lower > 0;
    const hasUpper = upper > 0;
    const hasNumber = nums > 0;
    const hasSpecial = special > 0;
    const hasExtended = extended.hasAny;

    const isCommon = commonPasswords.some(cp => password.toLowerCase().includes(cp));
    const isPwnedSafe = pwnedCount === 0;

    // Advanced Checks
    const hasDates = checkDates(password);
    const hasCommonWords = checkDictionary(password);
    const hasSportsTeam = checkSportsTeams(password);
    const hasLeetSpeak = detectLeetSpeak(password);
    const repetition = checkRepetition(password);
    const sequential = checkSequential(password);
    const nistCheck = checkNISTCompliance(password, pwnedCount || 0);

    // PII Check
    if (Object.values(personalInfo).some(v => v)) {
      const piiIssues = checkPersonalInfo(password, personalInfo);
      setPiiWarnings(piiIssues);
    } else {
      setPiiWarnings([]);
    }

    const newChecks = {
      length: hasLength,
      hasLower,
      hasUpper,
      hasNumber,
      hasSpecial,
      hasExtended,
      types: (hasLower && hasUpper && hasNumber && hasSpecial),
      noCommon: !isCommon && !hasCommonWords,
      noSequential: !kbPattern && !sequential,
      noRepeating: !repetition.hasAny,
      minEntropy: entropy >= 60,
      noPwned: isPwnedSafe,
      noDates: !hasDates,
      noSportsTeam: !hasSportsTeam,
      noLeetSpeak: !hasLeetSpeak,
      nistCompliant: nistCheck.isCompliant
    };

    setChecks(newChecks);

    // Crack time estimates
    const times = estimateCrackTimes(entropy);
    setCrackTimes(times);

    // Weakness reasons
    const reasons = getWeaknessReasons(password, {
      hasLower, hasUpper, hasNumber, hasSpecial
    }, {
      hasDates,
      hasKeyboardPattern: !!kbPattern,
      keyboardPattern: kbPattern,
      hasSequential: !!sequential,
      sequential,
      hasRepetition: repetition.hasAny,
      hasDictionaryWord: hasCommonWords,
      hasSportsTeam,
      hasLeetSpeak,
      pwnedCount: pwnedCount || 0,
      entropy
    });
    setWeaknessReasons(reasons);

    // Calculate Scoring
    let score = 0;
    if (password.length > 0) {
      // Length scoring
      if (password.length >= 8) score += 10;
      if (password.length >= 12) score += 10;
      if (password.length >= 16) score += 5;

      // Character types
      if (hasLower) score += 5;
      if (hasUpper) score += 5;
      if (hasNumber) score += 5;
      if (hasSpecial) score += 10;
      if (hasExtended) score += 10;

      // Entropy bonuses
      if (entropy > 50) score += 10;
      if (entropy > 70) score += 10;
      if (entropy > 90) score += 10;

      // Pattern penalties (subtract if found)
      if (!kbPattern && !sequential && !isCommon && !hasCommonWords) score += 5;
      if (!hasDates) score += 5;
      if (!hasSportsTeam) score += 3;
      if (!hasLeetSpeak || entropy > 70) score += 2; // Leet is ok if entropy is high

      // HIBP check
      if (pwnedCount === 0) score += 15;

      // NIST compliance bonus
      if (nistCheck.isCompliant) score += 5;

      // Penalties
      if (pwnedCount > 0) score = Math.min(score, 30); // Cap score if pwned
      if (repetition.hasAny) score -= 10;
    }

    setSecurityLevel(Math.min(Math.max(score, 0), 100)); // 0-100

    let strTier = 0;
    if (score < 30) strTier = 1;
    else if (score < 50) strTier = 2;
    else if (score < 70) strTier = 3;
    else if (score < 90) strTier = 4;
    else strTier = 5;

    setStrength(strTier);

    // Primary crack time display (botnet)
    if (times && times.botnet) {
      const t = times.botnet.time;
      setEstimatedTime(`${t.value} ${t.unit}`);
    }

    // Achievements Update
    const newUnlocks = [...unlockedAchievements];
    if (password.length > 0 && !newUnlocks.includes('starter')) newUnlocks.push('starter');
    if (combo >= 30 && !newUnlocks.includes('speedster')) newUnlocks.push('speedster');
    if (score >= 90 && !newUnlocks.includes('fortress')) newUnlocks.push('fortress');
    if (password.length >= 20 && !newUnlocks.includes('hacker')) newUnlocks.push('hacker');
    if (newChecks.types && !newUnlocks.includes('polyglot')) newUnlocks.push('polyglot');
    if (hasExtended && !newUnlocks.includes('unicode')) newUnlocks.push('unicode');
    if (nistCheck.isCompliant && !newUnlocks.includes('nist')) newUnlocks.push('nist');

    if (newUnlocks.length > unlockedAchievements.length) {
      setUnlockedAchievements(newUnlocks);
      soundEngine.playSuccess();
    }
  }, [password, pwnedCount, entropy, combo, personalInfo]);

  const strengthLabels = [
    { label: '', color: '#333' },
    { label: 'CRITICAL', color: '#ff0000' },
    { label: 'VULNERABLE', color: '#ff5f56' },
    { label: 'MODERATE', color: '#ffbd2e' },
    { label: 'SECURE', color: '#00fff9' },
    { label: 'FORTIFIED', color: '#00ff9d' }
  ];

  const strengthInfo = strengthLabels[strength] || strengthLabels[0];

  // Generate passphrase recommendation
  const handleGeneratePassphrase = () => {
    const rec = generatePassphraseRecommendation();
    setPassphraseRec(rec);
    setShowPassphrase(true);
  };

  const usePassphrase = () => {
    if (passphraseRec) {
      setPassword(passphraseRec.passphrase);
      setShowPassphrase(false);
    }
  };

  return (
    <div className="arcade-cabinet" onClick={handleInteraction} onMouseMove={resetAutoClear}>
      <canvas ref={canvasRef} className="matrix-bg" />
      <div className="scanlines"></div>
      <div className="screen-glow"></div>

      <div className="app-container">
        <div className="main-content">
          {/* Phishing Warning Banner */}
          <div className="phishing-banner">
            <AlertTriangle size={16} />
            <span>⚠️ SECURITY NOTICE: We do NOT store your data. Never enter your real banking password into any online checker.</span>
          </div>

          <div className="header">
            <h1 className="title">CYBER_SECURE</h1>
            <p className="subtitle">ADVANCED ENCRYPTION ANALYSIS</p>
          </div>

          <div className="terminal-card">
            {/* HP Bar */}
            <div className="hp-section">
              <div className="hp-bar" style={{ width: `${securityLevel}%`, filter: `hue-rotate(${securityLevel}deg)` }} />
            </div>

            <div className="terminal-header">
              <div className="terminal-title">TERMINAL_ID: 0x8F44A // {Math.round(securityLevel)}% INTEGRITY</div>
              <div className="input-actions" style={{ position: 'static' }}>
                <button onClick={toggleSound} className="action-button">
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>
            </div>

            {/* Input Section */}
            <div className="input-section">
              {combo > 1 && (
                <div className="combo-container">
                  <div className="combo-count">{combo}x</div>
                  <div className="combo-label">COMBO</div>
                </div>
              )}

              <div className="input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="pwd-input"
                  value={password}
                  onChange={handlePasswordChange}
                  className="password-input"
                  placeholder="ENTER_PASSPHRASE..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-form-type="other"
                />
                <div className="input-actions">
                  <div className="timer-badge" title="Auto-Clear Timer">
                    <Timer size={14} /> {timeLeft}s
                  </div>
                  {password && <button onClick={() => navigator.clipboard.writeText(password)} className="action-button" title="Copy"><Copy size={16} /></button>}
                  <button onClick={() => setShowGenerator(!showGenerator)} className={`action-button ${showGenerator ? 'active' : ''}`} title="Generate Password">
                    <RefreshCw size={16} className={showGenerator ? 'spin' : ''} />
                  </button>
                  <button onClick={handleGeneratePassphrase} className="action-button" title="Passphrase Suggestion">
                    <Sparkles size={16} />
                  </button>
                  <button onClick={() => setShowPIIForm(!showPIIForm)} className={`action-button ${showPIIForm ? 'active' : ''}`} title="Personal Info Check">
                    <User size={16} />
                  </button>
                  <button onClick={() => setShowPassword(!showPassword)} className="action-button" title={showPassword ? 'Hide' : 'Show'}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* PII Form */}
              {showPIIForm && (
                <div className="pii-form">
                  <h4><User size={16} /> Personal Data Correlation Check</h4>
                  <p className="pii-desc">Enter optional info to check if your password contains personal data (stored locally only)</p>
                  <div className="pii-grid">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={personalInfo.name}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Birth Year (e.g., 1995)"
                      value={personalInfo.birthYear}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, birthYear: e.target.value })}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    />
                  </div>
                  {piiWarnings.length > 0 && (
                    <div className="pii-warnings">
                      {piiWarnings.map((w, i) => (
                        <div key={i} className="pii-warning-item"><AlertTriangle size={14} /> {w}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Password Generator Panel */}
              {showGenerator && (
                <div className="generator-panel">
                  <div className="generator-header">
                    <h3>SECURE_GENERATE_V1</h3>
                    <div className="gen-controls">
                      <button onClick={() => generatePassword()} className="gen-btn">REROLL</button>
                    </div>
                  </div>
                  <div className="gen-options">
                    <label>
                      <span>LENGTH: {genLength}</span>
                      <input
                        type="range"
                        min="8"
                        max="32"
                        value={genLength}
                        onChange={(e) => setGenLength(parseInt(e.target.value))}
                        className="cyber-range"
                      />
                    </label>
                    <div className="gen-toggles">
                      <label><input type="checkbox" checked={genOptions.upper} onChange={() => setGenOptions({ ...genOptions, upper: !genOptions.upper })} /> A-Z</label>
                      <label><input type="checkbox" checked={genOptions.lower} onChange={() => setGenOptions({ ...genOptions, lower: !genOptions.lower })} /> a-z</label>
                      <label><input type="checkbox" checked={genOptions.nums} onChange={() => setGenOptions({ ...genOptions, nums: !genOptions.nums })} /> 0-9</label>
                      <label><input type="checkbox" checked={genOptions.special} onChange={() => setGenOptions({ ...genOptions, special: !genOptions.special })} /> #!@</label>
                    </div>
                  </div>
                </div>
              )}

              {/* Passphrase Recommendation */}
              {showPassphrase && passphraseRec && (
                <div className="passphrase-panel">
                  <div className="passphrase-header">
                    <h3><Sparkles size={16} /> PASSPHRASE RECOMMENDATION (Diceware)</h3>
                    <button onClick={() => setShowPassphrase(false)} className="close-btn">✕</button>
                  </div>
                  <div className="passphrase-content">
                    <code className="passphrase-text">{passphraseRec.passphrase}</code>
                    <p className="passphrase-desc">{passphraseRec.explanation}</p>
                    <div className="passphrase-actions">
                      <button onClick={usePassphrase} className="gen-btn">USE THIS</button>
                      <button onClick={handleGeneratePassphrase} className="gen-btn secondary">REGENERATE</button>
                    </div>
                  </div>
                </div>
              )}

              {/* HIBP Warning */}
              {pwnedCount > 0 && (
                <div className="pwned-warning">
                  <ShieldAlert size={20} />
                  <span>DATA BREACH DETECTED: Found {pwnedCount.toLocaleString()} times in global databases.</span>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="achievements-panel">
              {achievementsList.map(ach => (
                <div
                  key={ach.id}
                  className={`achievement-badge ${unlockedAchievements.includes(ach.id) ? 'unlocked' : ''}`}
                  onMouseEnter={() => setHoveredAchievement(ach)}
                  onMouseLeave={() => setHoveredAchievement(null)}
                >
                  {ach.icon}
                </div>
              ))}
            </div>

            <div className="achievement-log">
              <span className="log-prefix">&gt;&gt; LOG:</span>
              <span className="log-text">
                {hoveredAchievement
                  ? `${hoveredAchievement.title.toUpperCase()} // ${hoveredAchievement.desc}`
                  : 'SYSTEM_READY // AWAITING_INPUT...'
                }
              </span>
            </div>

            {/* Stats Grid - Enhanced with multiple crack times */}
            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-label">ENTROPY</div>
                <div className="stat-value" style={{ color: strengthInfo.color }}>
                  {Math.round(entropy)} bits
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">BRUTE_FORCE (BOTNET)</div>
                <div className="stat-value">{estimatedTime.split(' ')[0] || '--'}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{estimatedTime.split(' ').slice(1).join(' ')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">BREACH_STATUS</div>
                <div className="stat-value" style={{ color: pwnedCount > 0 ? '#ff0000' : '#00ff9d' }}>
                  {isCheckingPwned ? 'SCANNING...' : (pwnedCount > 0 ? 'COMPROMISED' : 'SECURE')}
                </div>
              </div>
            </div>

            {/* Extended Crack Time Comparison */}
            {crackTimes && password.length > 0 && (
              <div className="crack-times-panel">
                <h4>⏱️ Time to Crack Estimates</h4>
                <div className="crack-times-grid">
                  <div className="crack-time-item">
                    <span className="crack-icon">{crackTimes.singleComputer.icon}</span>
                    <span className="crack-label">Single PC</span>
                    <span className="crack-value">{crackTimes.singleComputer.time.value} {crackTimes.singleComputer.time.unit}</span>
                  </div>
                  <div className="crack-time-item">
                    <span className="crack-icon">{crackTimes.botnet.icon}</span>
                    <span className="crack-label">Botnet</span>
                    <span className="crack-value">{crackTimes.botnet.time.value} {crackTimes.botnet.time.unit}</span>
                  </div>
                  <div className="crack-time-item">
                    <span className="crack-icon">{crackTimes.supercomputer.icon}</span>
                    <span className="crack-label">Supercomputer</span>
                    <span className="crack-value">{crackTimes.supercomputer.time.value} {crackTimes.supercomputer.time.unit}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Character Breakdown */}
            {password.length > 0 && (
              <div className="char-breakdown-panel">
                <h4>📊 Character Analysis</h4>
                <div className="char-breakdown-grid">
                  <div className="char-item">
                    <span className="char-label">Total Length</span>
                    <span className={`char-value ${charBreakdown.length >= 12 ? 'good' : 'bad'}`}>{charBreakdown.length}</span>
                  </div>
                  <div className="char-item">
                    <span className="char-label">Lowercase (a-z)</span>
                    <span className={`char-value ${charBreakdown.lowercase > 0 ? 'good' : 'bad'}`}>{charBreakdown.lowercase}</span>
                  </div>
                  <div className="char-item">
                    <span className="char-label">Uppercase (A-Z)</span>
                    <span className={`char-value ${charBreakdown.uppercase > 0 ? 'good' : 'bad'}`}>{charBreakdown.uppercase}</span>
                  </div>
                  <div className="char-item">
                    <span className="char-label">Numbers (0-9)</span>
                    <span className={`char-value ${charBreakdown.numbers > 0 ? 'good' : 'bad'}`}>{charBreakdown.numbers}</span>
                  </div>
                  <div className="char-item">
                    <span className="char-label">Symbols (!@#)</span>
                    <span className={`char-value ${charBreakdown.special > 0 ? 'good' : 'bad'}`}>{charBreakdown.special}</span>
                  </div>
                  <div className="char-item">
                    <span className="char-label">Unicode/Extended</span>
                    <span className={`char-value ${charBreakdown.extended > 0 ? 'good' : 'neutral'}`}>{charBreakdown.extended > 0 ? '✓' : '✗'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Why is this weak? Section */}
            {password.length > 0 && weaknessReasons.length > 0 && (
              <div className="weakness-panel">
                <div className="weakness-header" onClick={() => setShowWhyWeak(!showWhyWeak)}>
                  <h4><HelpCircle size={16} /> Why is this {strength < 3 ? 'weak' : 'not perfect'}?</h4>
                  <span className="toggle-arrow">{showWhyWeak ? '▼' : '▶'}</span>
                </div>
                {showWhyWeak && (
                  <div className="weakness-list">
                    {weaknessReasons.map((reason, idx) => (
                      <div key={idx} className={`weakness-item severity-${reason.severity}`}>
                        {reason.severity === 'critical' && <XCircle size={14} />}
                        {reason.severity === 'warning' && <AlertTriangle size={14} />}
                        {reason.severity === 'info' && <Info size={14} />}
                        <span>{reason.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Requirements Check List - Expanded */}
            <div className="requirements-section">
              <h4 className="requirements-title">🔐 Security Requirements</h4>
              <div className="requirements-grid">
                <ReqItem label="12+ Characters" met={checks.length} />
                <ReqItem label="Lowercase (a-z)" met={checks.hasLower} />
                <ReqItem label="Uppercase (A-Z)" met={checks.hasUpper} />
                <ReqItem label="Numbers (0-9)" met={checks.hasNumber} />
                <ReqItem label="Symbols (!@#$)" met={checks.hasSpecial} />
                <ReqItem label="Extended/Unicode" met={checks.hasExtended} optional />
                <ReqItem label="High Entropy (>60 bits)" met={checks.minEntropy} />
                <ReqItem label="No Keyboard Patterns" met={checks.noSequential} />
                <ReqItem label="No Repeated Chars" met={checks.noRepeating} />
                <ReqItem label="No Dates/Years" met={checks.noDates} />
                <ReqItem label="No Dictionary Words" met={checks.noCommon} />
                <ReqItem label="No Sports Teams" met={checks.noSportsTeam} />
                <ReqItem label="No Obvious Leet (P@ss)" met={checks.noLeetSpeak} />
                <ReqItem label="Not in Data Breaches" met={checks.noPwned} />
                <ReqItem label="NIST Compliant" met={checks.nistCompliant} />
              </div>
            </div>

          </div>

          <div className="footer">
            <p className="footer-text">SECURE_CLIENT_SIDE // NO_LOGS // 100% LOCAL PROCESSING // V4.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReqItem = ({ label, met, optional = false }) => (
  <div className={`requirement-item ${met ? 'checked' : ''} ${optional ? 'optional' : ''}`}>
    <div className="requirement-status">
      {met ? <CheckCircle size={14} /> : <XCircle size={14} />}
    </div>
    <span className="requirement-text">{label}</span>
    {optional && !met && <span className="optional-badge">Optional</span>}
  </div>
);

export default PasswordStrengthChecker;