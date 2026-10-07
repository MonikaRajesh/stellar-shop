import { useEffect, useState } from 'react';

// Browser speech recognition hook. Returns null when unsupported.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SR = any;

export function useSpeechRecognition() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SR | null>(null);

  useEffect(() => {
    const SRClass =
      typeof window !== 'undefined'
        ? (window as unknown as { SpeechRecognition?: SR; webkitSpeechRecognition?: SR }).SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: SR }).webkitSpeechRecognition
        : undefined;
    if (SRClass) {
      setSupported(true);
      const rec = new SRClass();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => {
        let text = '';
        for (let i = 0; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        setTranscript(text);
      };
      rec.onerror = (e: { error?: string }) => {
        setError(e.error || 'Speech recognition error');
        setListening(false);
      };
      rec.onend = () => setListening(false);
      setRecognition(rec);
    }
    return () => {
      try { recognition?.abort(); } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    if (!recognition) return;
    setTranscript('');
    setError(null);
    try {
      recognition.start();
      setListening(true);
    } catch {
      // already started
    }
  };

  const stop = () => {
    try { recognition?.stop(); } catch { /* ignore */ }
    setListening(false);
  };

  const reset = () => {
    setTranscript('');
    setError(null);
  };

  return { supported, listening, transcript, error, start, stop, reset };
}
