
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi there! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'd be happy to help with that!",
        "That's an interesting question. Let me provide some information.",
        "I can definitely assist you with this request.",
        "I understand what you're asking. Here's what you need to know.",
        "Great question! Here's my response.",
      ];
      
      const aiMessage: Message = {
        id: messages.length + 2,
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="w-full h-[500px] bg-white dark:bg-ai-charcoal rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-4 bg-ai-purple bg-opacity-10 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-lg flex items-center">
          <Bot className="mr-2 text-ai-purple" size={20} />
          AI Assistant Demo
        </h3>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-ai-purple text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
              }`}
            >
              <div className="flex items-start mb-1">
                {!message.isUser && <Bot size={16} className="mr-1 text-ai-blue" />}
                {message.isUser && <User size={16} className="mr-1" />}
                <span className={`text-xs ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                  {message.isUser ? 'You' : 'AI Assistant'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-ai-purple animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-ai-purple animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-ai-purple animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="bg-ai-purple hover:bg-ai-deep-purple text-white"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
