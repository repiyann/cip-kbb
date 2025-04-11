import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isTyping: boolean;
}

export default function ChatInput({ onSendMessage, isTyping }: ChatInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    // const [isSendingVoiceMessage, setIsSendingVoiceMessage] = useState(false);
    const messageProcessedRef = useRef(false);

    // Reset the message processed ref when input value changes
    useEffect(() => {
        if (!inputValue) {
            messageProcessedRef.current = false;
        }
    }, [inputValue]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!inputValue.trim() || messageProcessedRef.current) return;

        messageProcessedRef.current = true;
        onSendMessage(inputValue);
        setInputValue('');
    }

    function toggleSpeechRecognition() {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }

    function startListening() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            toast.error('Speech recognition is not supported in your browser');
            return;
        }

        try {
            // Reset flag when starting a new listening session
            messageProcessedRef.current = false;
            // setIsSendingVoiceMessage(false);

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            if (recognitionRef.current) {
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'id-ID'; // Set to Indonesian

                recognitionRef.current.onstart = () => {
                    setIsListening(true);
                    toast.info('Listening...');
                };

                recognitionRef.current.onresult = (event) => {
                    const transcript = Array.from(event.results)
                        .map((result) => result[0])
                        .map((result) => result.transcript)
                        .join('');

                    setInputValue(transcript);

                    // Check if transcript contains "send" or "kirim" (case-insensitive)
                    const lowerTranscript = transcript.toLowerCase();
                    if ((lowerTranscript.includes('send') || lowerTranscript.includes('kirim')) && !messageProcessedRef.current) {
                        // Set flag to prevent duplicate sends
                        messageProcessedRef.current = true;

                        // Extract message without "send" or "kirim"
                        let messageToSend = transcript;

                        // Remove "send" or "kirim" from the end if present
                        messageToSend = messageToSend
                            .replace(/send$/i, '')
                            .replace(/kirim$/i, '')
                            .trim();

                        // If there's still content after removing the command words, send the message
                        if (messageToSend) {
                            setTimeout(() => {
                                onSendMessage(messageToSend);
                                setInputValue('');
                                stopListening();
                            }, 300); // Small delay to ensure UI updates correctly
                        }
                    }
                };

                recognitionRef.current.onerror = (event) => {
                    console.error('Speech recognition error', event.error);
                    toast.error(`Error: ${event.error}`);
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current.start();
            }
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            toast.error('Failed to start speech recognition');
        }
    }

    function stopListening() {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }

    return (
        <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                    autoComplete="off"
                />

                <Button type="button" size="icon" variant={isListening ? 'destructive' : 'outline'} onClick={toggleSpeechRecognition}>
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <Button type="submit" size="icon" disabled={isTyping || !inputValue.trim() || messageProcessedRef.current}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
