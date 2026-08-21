/**
 * Storage manager for Gemini AI Configuration (API Key, Model, Proxy settings).
 */

const STORAGE_KEY = 'tagalog_gemini_config_v1';

const DEFAULT_CONFIG = {
  apiKey: '',
  proxyUrl: '', // Optional proxy URL
  model: 'gemini-2.5-flash', // Default high-speed Flash model
  preferredQuestionCount: 10,
};

export function getAiConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : { ...DEFAULT_CONFIG };
  } catch (e) {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveAiConfig(config) {
  try {
    const current = getAiConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tagalog_ai_config_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to save AI config:', e);
    return getAiConfig();
  }
}
