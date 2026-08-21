/**
 * Storage manager for Mistakes Bank.
 * Persists missed quiz & activity questions in LocalStorage & Supabase Cloud.
 */

import { autoPushIfLoggedIn } from './cloudSyncManager';

const MISTAKES_KEY = 'tagalog_mistakes_bank_v1';
const LEGACY_KEY = 'tagalog_quiz_mistakes_v1';

export const getMistakes = () => {
  try {
    let saved = localStorage.getItem(MISTAKES_KEY);
    let mistakes = saved ? JSON.parse(saved) : [];

    // Auto-migrate from legacy key if present
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      try {
        const legacyItems = JSON.parse(legacy);
        if (Array.isArray(legacyItems) && legacyItems.length > 0) {
          const map = new Map();
          [...mistakes, ...legacyItems].forEach((item) => {
            const key = item.id || item.prompt || item.question || JSON.stringify(item);
            map.set(key, item);
          });
          mistakes = Array.from(map.values());
          localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
        }
        localStorage.removeItem(LEGACY_KEY);
      } catch (e) {}
    }

    return Array.isArray(mistakes) ? mistakes : [];
  } catch (e) {
    return [];
  }
};

export const saveMistake = (questionObj) => {
  if (!questionObj) return;
  try {
    const current = getMistakes();
    const qId = questionObj.id || questionObj.prompt || questionObj.question;
    const exists = current.some((q) => (q.id || q.prompt || q.question) === qId);

    if (!exists) {
      const updated = [questionObj, ...current];
      localStorage.setItem(MISTAKES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('tagalog_mistakes_updated'));
      autoPushIfLoggedIn().catch(() => {});
    }
  } catch (e) {
    console.error('Failed to save mistake', e);
  }
};

export const removeMistake = (questionId) => {
  if (!questionId) return;
  try {
    const current = getMistakes();
    const updated = current.filter((q) => (q.id || q.prompt || q.question) !== questionId);
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tagalog_mistakes_updated'));
    autoPushIfLoggedIn().catch(() => {});
  } catch (e) {
    console.error('Failed to remove mistake', e);
  }
};

export const clearAllMistakes = () => {
  try {
    localStorage.removeItem(MISTAKES_KEY);
    localStorage.removeItem(LEGACY_KEY);
    window.dispatchEvent(new Event('tagalog_mistakes_updated'));
    autoPushIfLoggedIn().catch(() => {});
  } catch (e) {
    console.error('Failed to clear mistakes', e);
  }
};
