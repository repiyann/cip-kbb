import { FireworksRequest, FireworksResponse, Message } from '@/types/chat';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [isResponseComplete, setIsResponseComplete] = useState<boolean>(true);
    const [lastResponseData, setLastResponseData] = useState<string | null>(null);

    useEffect(() => {
        setTimeout(() => {
            setMessages([
                {
                    id: '1',
                    text: "Hello! I'm your Citya. How can I help you today?",
                    displayText: "Hello! I'm your Citya. How can I help you today?",
                    sender: 'assistant',
                    timestamp: new Date(),
                },
            ]);
        }, 1000);
    }, []);

    async function fetchAssistantResponse(userInput: string) {
        try {
            const requestData: FireworksRequest = {
                model: 'accounts/fireworks/models/deepseek-v3',
                max_tokens: 4096,
                top_p: 1,
                top_k: 40,
                presence_penalty: 0,
                frequency_penalty: 0,
                temperature: 0.6,
                messages: [
                    {
                        role: 'user',
                        content: userInput,
                    },
                ],
            };

            const apiKey = import.meta.env.VITE_FIREWORKS_API_KEY;

            if (!apiKey || apiKey === 'your-api-key-here') {
                console.warn('Fireworks API key not found or not set. Using mock response.');
                return generateMockResponse(userInput);
            }

            const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data: FireworksResponse = await response.json();

            if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                return data.choices[0].message.content;
            } else {
                throw new Error('No valid response content found');
            }
        } catch (error) {
            console.error('Error fetching response:', error);
            toast.error('Failed to get a response. Please try again.');
            return "Sorry, I couldn't process your request. Please try again.";
        }
    }

    function generateMockResponse(input: string): string {
        if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
            return 'Hello! How can I assist you today?';
        } else if (input.toLowerCase().includes('help')) {
            return "I'm here to help! You can ask me about various topics, and I'll do my best to assist you.";
        } else if (input.toLowerCase().includes('weather')) {
            return "I don't have real-time data access without an API key, but I can tell you that weather patterns are fascinating to study!";
        } else if (input.toLowerCase().includes('thank')) {
            return "You're welcome! Is there anything else I can help with?";
        } else {
            return "I'm running in demo mode without an API key. To get more intelligent responses, please add your Fireworks API key to the .env file.";
        }
    }

    function simulateTypingEffect(messageId: string, fullText: string) {
        setIsResponseComplete(false);
        let charIndex = 0;
        const typingSpeed = 1; // Extremely fast (1ms per character)

        const typingInterval = setInterval(() => {
            charIndex += 5; // Add 5 characters at once for even faster effect
            const partialText = fullText.substring(0, charIndex);

            setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === messageId ? { ...msg, displayText: partialText } : msg)));

            if (charIndex >= fullText.length) {
                clearInterval(typingInterval);
                setIsResponseComplete(true);
                setLastResponseData(fullText); // Store the complete response when done
            }
        }, typingSpeed);

        return () => clearInterval(typingInterval);
    }

    async function sendMessage(inputValue: string) {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            displayText: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);
        setIsResponseComplete(false);
        setLastResponseData(null); // Clear previous response data

        try {
            const responseContent = await fetchAssistantResponse(inputValue);

            const messageId = (Date.now() + 1).toString();

            const assistantMessage: Message = {
                id: messageId,
                text: responseContent,
                displayText: '',
                sender: 'assistant',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setIsTyping(false);

            simulateTypingEffect(messageId, responseContent);
        } catch (error) {
            console.error('Error in sendMessage:', error);
            setIsTyping(false);
            setIsResponseComplete(true);
        }
    }

    return {
        messages,
        isTyping,
        isResponseComplete,
        lastResponseData, // Add this to the returned object
        sendMessage,
    };
}
