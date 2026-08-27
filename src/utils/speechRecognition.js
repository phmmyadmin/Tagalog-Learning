/**
 * Speech Recognition Wrapper (Web Speech API STT)
 * Captures microphone audio and transcribes real-time speech into text.
 */

export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createSpeechRecognizer({
  lang = 'fil-PH',
  onResult,
  onFinal,
  onError,
  onStart,
  onEnd,
  silenceTimeoutMs = 450,
  onSilence,
} = {}) {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();

  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 5;

  let silenceTimer = null;
  let lastCapturedText = '';
  let lastCapturedAlternatives = [];

  const resetSilenceTimer = (currentTranscript, currentAlternatives) => {
    if (silenceTimer) clearTimeout(silenceTimer);
    if (silenceTimeoutMs > 0 && currentTranscript && onSilence) {
      silenceTimer = setTimeout(() => {
        onSilence(currentTranscript, currentAlternatives);
      }, silenceTimeoutMs);
    }
  };

  if (onStart) recognition.onstart = onStart;
  recognition.onend = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
    // If recognition ends while having captured speech, flush immediately
    if (lastCapturedText && onFinal) {
      onFinal(lastCapturedText, lastCapturedAlternatives);
    }
    if (onEnd) onEnd();
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';
    const alternativesSet = new Set();

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i];
      for (let j = 0; j < result.length; ++j) {
        if (result[j]?.transcript) {
          alternativesSet.add(result[j].transcript.trim());
        }
      }

      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    const currentText = (finalTranscript || interimTranscript).trim();
    const alternatives = Array.from(alternativesSet).filter(Boolean);

    lastCapturedText = currentText;
    lastCapturedAlternatives = alternatives;

    if (onResult) {
      onResult({
        final: finalTranscript.trim(),
        interim: interimTranscript.trim(),
        transcript: currentText,
        alternatives
      });
    }

    if (finalTranscript.trim() && onFinal) {
      if (silenceTimer) clearTimeout(silenceTimer);
      onFinal(finalTranscript.trim(), alternatives);
      return;
    }

    if (currentText) {
      resetSilenceTimer(currentText, alternatives);
    }
  };

  recognition.onerror = (event) => {
    if (silenceTimer) clearTimeout(silenceTimer);
    if (onError) {
      onError(event.error);
    }
  };

  return recognition;
}
