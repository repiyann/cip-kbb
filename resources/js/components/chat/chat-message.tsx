import { ScrollArea } from '@/components/ui/scroll-area';
// import Markdown from 'markdown-to-jsx';
import { Message } from '@/types/chat';
import { useEffect, useRef } from 'react';

interface ChatMessagesProps {
    messages: Message[];
    isTyping: boolean;
}

export default function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <ScrollArea className="h-[calc(100vh-15rem)]">
            <div className="space-y-4 p-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`animate-slide-up max-w-[80%] rounded-2xl px-4 py-2 mt-3 ${
                                message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                            }`}
                        >
                            {message.sender === 'user' ? (
                                <p className="whitespace-pre-line">{message.text}</p>
                            ) : (
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    {/* <Markdown>{message.displayText || message.text}</Markdown> */}
                                    {message.displayText || message.text}
                                </div>
                            )}
                            <p className="mt-1 text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-secondary text-foreground animate-pulse-subtle max-w-[80%] rounded-2xl px-4 py-2">
                            <div className="flex space-x-1">
                                <div className="bg-muted-foreground h-2 w-2 rounded-full"></div>
                                <div className="bg-muted-foreground h-2 w-2 rounded-full"></div>
                                <div className="bg-muted-foreground h-2 w-2 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
    );
}
