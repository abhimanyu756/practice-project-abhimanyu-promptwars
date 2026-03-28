import React, { useState, useRef } from 'react';

interface SpeechInputProps {
  onTranscript: (text: string) => void;
}

export const SpeechInput: React.FC<SpeechInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const toggleListening = async () => {
    if (isListening && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          try {
            const res = await fetch('/api/speech/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audio: base64 }),
            });
            const data = await res.json();
            if (data.transcript) onTranscript(data.transcript);
          } catch {
            // Fallback silently
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
    } catch {
      // Mic not available
    }
  };

  return (
    <button
      className={`btn btn--outline btn--sm ${isListening ? 'btn--recording' : ''}`}
      onClick={toggleListening}
      type="button"
      aria-label={isListening ? 'Stop voice recording' : 'Start voice input via Google Speech-to-Text'}
    >
      <span className="btn__icon">{isListening ? '\u{1F534}' : '\u{1F3A4}'}</span>
      {isListening ? 'Stop Recording' : 'Voice Input'}
    </button>
  );
};
