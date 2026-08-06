const MISTAKES_KEY = 'tagalog_quiz_mistakes_v1';

export const getMistakes = () => {
  try {
    const saved = localStorage.getItem(MISTAKES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const saveMistake = (questionObj) => {
  try {
    const current = getMistakes();
    const exists = current.some((q) => q.id === questionObj.id);
    if (!exists) {
      const updated = [questionObj, ...current];
      localStorage.setItem(MISTAKES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('tagalog_mistakes_updated'));
    }
  } catch (e) {
    console.error('Failed to save mistake', e);
  }
};

export const removeMistake = (questionId) => {
  try {
    const current = getMistakes();
    const updated = current.filter((q) => q.id !== questionId);
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tagalog_mistakes_updated'));
  } catch (e) {
    console.error('Failed to remove mistake', e);
  }
};

export const clearAllMistakes = () => {
  try {
    localStorage.removeItem(MISTAKES_KEY);
    window.dispatchEvent(new Event('tagalog_mistakes_updated'));
  } catch (e) {
    console.error('Failed to clear mistakes', e);
  }
};
