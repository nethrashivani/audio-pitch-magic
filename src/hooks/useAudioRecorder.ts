import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

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

      let finalTranscript = '';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText + ' ';
          } else {
            interimTranscript += transcriptText;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: 'Recognition Error',
          description: 'Speech recognition encountered an error. Please try again.',
          variant: 'destructive',
        });
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      setTranscript('');
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
  };

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
