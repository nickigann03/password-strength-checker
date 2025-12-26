class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled || !this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playKeystroke() {
        // Random pitch variation for realistic typing feel
        const freq = 800 + Math.random() * 200;
        this.playTone(freq, 'square', 0.05, 0.05);
    }

    playDelete() {
        this.playTone(300, 'sawtooth', 0.1, 0.05);
    }

    playLevelUp(strength) {
        if (!this.enabled) return;
        const baseFreq = 200 * (strength + 1);
        this.playTone(baseFreq, 'sine', 0.2, 0.1);
        setTimeout(() => this.playTone(baseFreq * 1.5, 'square', 0.2, 0.1), 100);
    }

    playSuccess() {
        if (!this.enabled) return;
        [440, 554, 659, 880].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'square', 0.1, 0.1), i * 60);
        });
    }

    playSecure() {
        // "Shield Up" sound
        if (!this.enabled) return;
        this.playTone(200, 'sawtooth', 0.5, 0.1);
        setTimeout(() => this.playTone(400, 'sine', 0.5, 0.1), 100);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

export const soundEngine = new SoundEngine();
