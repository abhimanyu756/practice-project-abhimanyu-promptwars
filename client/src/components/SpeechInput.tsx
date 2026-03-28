import React, { useState, useRef, useCallback } from 'react';

interface SpeechInputProps {
  onTranscript: (text: string) => void;
}

export const SpeechInput: React.FC<SpeechInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, onTranscript]);

  if (!supported) {
    return null;
  }

  return (
    <button
      className={`btn btn--outline btn--sm ${isListening ? 'btn--recording' : ''}`}
      onClick={toggleListening}
      type="button"
      aria-label={isListening ? 'Stop voice recording' : 'Start voice input'}
    >
      <span className="btn__icon">{isListening ? '\u{1F534}' : '\u{1F3A4}'}</span>
      {isListening ? 'Listening...' : 'Voice Input'}
    </button>
  );
};
