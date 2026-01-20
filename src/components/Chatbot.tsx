import { useState, useRef, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardBody, CardHeader, CardFooter } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { chatbotService } from '@/services/chatbotApi';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Initialize chatbot session when opened
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    role: 'assistant',
                    content: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
                    timestamp: new Date()
                }
            ]);
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await chatbotService.sendPrompt(inputValue);
            
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <Button
                    isIconOnly
                    color="primary"
                    size="lg"
                    className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg"
                    onPress={() => setIsOpen(true)}
                    aria-label="Abrir chat"
                >
                    <MessageCircle size={28} />
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 z-50 w-96 h-[600px] shadow-2xl flex flex-col">
                    {/* Header */}
                    <CardHeader className="flex justify-between items-center bg-primary text-white p-4">
                        <div className="flex items-center gap-2">
                            <MessageCircle size={24} />
                            <div>
                                <h3 className="font-semibold text-lg">Asistente Virtual</h3>
                                <p className="text-xs opacity-90">Siempre disponible para ayudarte</p>
                            </div>
                        </div>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => setIsOpen(false)}
                            aria-label="Cerrar chat"
                            className="text-white"
                        >
                            <X size={20} />
                        </Button>
                    </CardHeader>

                    {/* Messages */}
                    <CardBody className="flex-1 overflow-y-auto p-4 gap-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        message.role === 'user'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <p className={`text-xs mt-1 ${
                                        message.role === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                        {message.timestamp.toLocaleTimeString('es-AR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                                    <Spinner size="sm" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardBody>

                    {/* Input */}
                    <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2 w-full">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu mensaje..."
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <Button
                                isIconOnly
                                color="primary"
                                onPress={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                aria-label="Enviar mensaje"
                            >
                                <Send size={20} />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </>
    );
};
