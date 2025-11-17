import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');

  const startRecording = async () => {
    try {
      // Check if browser supports Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        throw new Error('Speech recognition is not supported in this browser');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcriptText + ' ';
          } else {
            interimTranscript += transcriptText;
          }
        }
        
        setTranscript(finalTranscriptRef.current + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        // Auto-restart on certain errors to support long sessions
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
          if (isRecording && recognitionRef.current) {
            setTimeout(() => {
              try {
                recognitionRef.current?.start();
              } catch (e) {
                console.error('Failed to restart recognition:', e);
              }
            }, 100);
          }
        } else {
          toast({
            title: 'Recognition Error',
            description: 'Speech recognition encountered an error. Please try again.',
            variant: 'destructive',
          });
        }
      };

      recognition.onend = () => {
        // Auto-restart for long sessions if still recording
        if (isRecording && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error('Failed to restart recognition:', e);
            setIsRecording(false);
          }
        } else {
          setIsRecording(false);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      setTranscript('');
      finalTranscriptRef.current = '';
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: 'Recording Error',
        description: 'Could not start speech recognition. Please check browser support and permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setTranscript('');
    finalTranscriptRef.current = '';
  };

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
