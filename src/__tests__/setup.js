// Mock localStorage if missing in environment
if (typeof window !== 'undefined') {
  const store = {};
  const mockLocalStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => {
      store[key] = String(val);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
  };
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  // Mock SpeechSynthesis
  window.speechSynthesis = {
    speak: () => {},
    cancel: () => {},
  };
}
