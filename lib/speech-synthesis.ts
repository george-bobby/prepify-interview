export interface SpeechSynthesisConfig {
	voice?: SpeechSynthesisVoice;
	rate?: number; // 0.1 to 10
	pitch?: number; // 0 to 2
	volume?: number; // 0 to 1
	lang?: string;
}

export interface SpeechSynthesisCallbacks {
	onStart?: () => void;
	onEnd?: () => void;
	onError?: (error: SpeechSynthesisErrorEvent) => void;
	onPause?: () => void;
	onResume?: () => void;
	onBoundary?: (event: SpeechSynthesisEvent) => void;
}

export class SpeechSynthesisManager {
	private synthesis: SpeechSynthesis;
	private currentUtterance: SpeechSynthesisUtterance | null = null;
	private defaultConfig: SpeechSynthesisConfig = {
		rate: 0.9,
		pitch: 1.0,
		volume: 0.8,
		lang: 'en-US',
	};

	constructor() {
		if (typeof window === 'undefined' || !window.speechSynthesis) {
			throw new Error('Speech Synthesis API is not supported in this environment');
		}
		this.synthesis = window.speechSynthesis;
	}

	/**
	 * Check if Speech Synthesis is supported
	 */
	static isSupported(): boolean {
		return typeof window !== 'undefined' && 'speechSynthesis' in window;
	}

	/**
	 * Get available voices
	 */
	async getVoices(): Promise<SpeechSynthesisVoice[]> {
		return new Promise((resolve) => {
			let voices = this.synthesis.getVoices();
			
			if (voices.length > 0) {
				resolve(voices);
			} else {
				// Wait for voices to be loaded
				const handleVoicesChanged = () => {
					voices = this.synthesis.getVoices();
					if (voices.length > 0) {
						this.synthesis.removeEventListener('voiceschanged', handleVoicesChanged);
						resolve(voices);
					}
				};
				this.synthesis.addEventListener('voiceschanged', handleVoicesChanged);
			}
		});
	}

	/**
	 * Get the best voice for the given language and gender preference
	 */
	async getBestVoice(lang: string = 'en-US', preferFemale: boolean = true): Promise<SpeechSynthesisVoice | null> {
		const voices = await this.getVoices();
		
		// Filter by language
		const langVoices = voices.filter(voice => voice.lang.startsWith(lang.split('-')[0]));
		
		if (langVoices.length === 0) {
			return voices[0] || null;
		}

		// Prefer female voices for interview context (more welcoming)
		if (preferFemale) {
			const femaleVoices = langVoices.filter(voice => 
				voice.name.toLowerCase().includes('female') ||
				voice.name.toLowerCase().includes('woman') ||
				voice.name.toLowerCase().includes('sarah') ||
				voice.name.toLowerCase().includes('samantha') ||
				voice.name.toLowerCase().includes('victoria')
			);
			if (femaleVoices.length > 0) {
				return femaleVoices[0];
			}
		}

		// Return first available voice for the language
		return langVoices[0];
	}

	/**
	 * Speak the given text
	 */
	async speak(
		text: string,
		config: SpeechSynthesisConfig = {},
		callbacks: SpeechSynthesisCallbacks = {}
	): Promise<void> {
		return new Promise(async (resolve, reject) => {
			// Stop any current speech
			this.stop();

			// Create utterance
			const utterance = new SpeechSynthesisUtterance(text);
			this.currentUtterance = utterance;

			// Apply configuration
			const finalConfig = { ...this.defaultConfig, ...config };
			
			if (finalConfig.voice) {
				utterance.voice = finalConfig.voice;
			} else {
				// Use best available voice
				const bestVoice = await this.getBestVoice(finalConfig.lang);
				if (bestVoice) {
					utterance.voice = bestVoice;
				}
			}

			utterance.rate = finalConfig.rate!;
			utterance.pitch = finalConfig.pitch!;
			utterance.volume = finalConfig.volume!;
			utterance.lang = finalConfig.lang!;

			// Set up event listeners
			utterance.onstart = () => {
				callbacks.onStart?.();
			};

			utterance.onend = () => {
				this.currentUtterance = null;
				callbacks.onEnd?.();
				resolve();
			};

			utterance.onerror = (error) => {
				this.currentUtterance = null;
				callbacks.onError?.(error);
				reject(error);
			};

			utterance.onpause = () => {
				callbacks.onPause?.();
			};

			utterance.onresume = () => {
				callbacks.onResume?.();
			};

			utterance.onboundary = (event) => {
				callbacks.onBoundary?.(event);
			};

			// Start speaking
			this.synthesis.speak(utterance);
		});
	}

	/**
	 * Stop current speech
	 */
	stop(): void {
		if (this.synthesis.speaking) {
			this.synthesis.cancel();
		}
		this.currentUtterance = null;
	}

	/**
	 * Pause current speech
	 */
	pause(): void {
		if (this.synthesis.speaking && !this.synthesis.paused) {
			this.synthesis.pause();
		}
	}

	/**
	 * Resume paused speech
	 */
	resume(): void {
		if (this.synthesis.paused) {
			this.synthesis.resume();
		}
	}

	/**
	 * Check if currently speaking
	 */
	isSpeaking(): boolean {
		return this.synthesis.speaking;
	}

	/**
	 * Check if currently paused
	 */
	isPaused(): boolean {
		return this.synthesis.paused;
	}

	/**
	 * Set default configuration
	 */
	setDefaultConfig(config: SpeechSynthesisConfig): void {
		this.defaultConfig = { ...this.defaultConfig, ...config };
	}

	/**
	 * Get current configuration
	 */
	getDefaultConfig(): SpeechSynthesisConfig {
		return { ...this.defaultConfig };
	}
}

// Singleton instance
let speechManager: SpeechSynthesisManager | null = null;

export const getSpeechSynthesisManager = (): SpeechSynthesisManager => {
	if (!speechManager) {
		if (!SpeechSynthesisManager.isSupported()) {
			throw new Error('Speech Synthesis is not supported in this browser');
		}
		speechManager = new SpeechSynthesisManager();
	}
	return speechManager;
};

// Utility function for simple text-to-speech
export const speakText = async (
	text: string,
	options: SpeechSynthesisConfig & SpeechSynthesisCallbacks = {}
): Promise<void> => {
	const manager = getSpeechSynthesisManager();
	const { onStart, onEnd, onError, onPause, onResume, onBoundary, ...config } = options;
	
	return manager.speak(text, config, {
		onStart,
		onEnd,
		onError,
		onPause,
		onResume,
		onBoundary,
	});
};
