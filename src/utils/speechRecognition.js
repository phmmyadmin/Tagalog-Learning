/**
 * Speech Recognition Wrapper (Web Speech API STT)
 * Captures microphone audio and transcribes real-time speech into text.
 */

export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createSpeechRecognizer({
  lang = 'tl-PH',
  onResult,
  onError,
  onStart,
  onEnd
} = {}) {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();

  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  if (onStart) recognition.onstart = onStart;
  if (onEnd) recognition.onend = onEnd;

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    if (onResult) {
      onResult({
        final: finalTranscript.trim(),
        interim: interimTranscript.trim(),
        transcript: (finalTranscript || interimTranscript).trim()
      });
    }
  };

  recognition.onerror = (event) => {
    if (onError) {
      onError(event.error);
    }
  };

  return recognition;
}
