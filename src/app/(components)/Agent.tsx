// components/Agent.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot } from 'lucide-react';

export default function DarkThemeAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey dear, I hope you are fine! I'm Combine Zenith's AI-powered virtual assistant. How can I assist you with digital transformation today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // ✅ Use relative path to avoid CORS issues
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botResponse = {
        id: messages.length + 2,
        text: data.response,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorResponse = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting to the server. Please try again later or contact us directly at +92 319 3372277.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
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

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hey dear, I hope you are fine! I'm Combine Zenith's AI-powered virtual assistant. How can I assist you with digital transformation today?",
        isBot: true,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Floating Agent Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9990] w-16 h-16 bg-gradient-to-br from-purple-900 to-indigo-800 rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-110 border border-purple-600"
        aria-label="Open AI Assistant"
      >
        <Bot className="w-6 h-6 text-white" />
        <div className="absolute inset-0 w-14 h-14 bg-purple-600 rounded-full animate-ping opacity-20"></div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-[9990] w-80 h-96 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 flex flex-col backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-t-2xl p-4 border-b border-purple-600">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Combine Zenith AI</h3>
                  <p className="text-purple-200 text-xs">Digital Marketing Expert <span className="text-green-400">• Online</span></p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={clearChat}
                  className="text-purple-200 hover:text-white transition-colors text-xs"
                  title="Clear chat"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-purple-200 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      message.isBot
                        ? 'bg-gray-800 border border-gray-700 text-gray-100 rounded-tl-none'
                        : 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white rounded-tr-none'
                    }`}
                  >
                    <p className="text-sm antialiased leading-relaxed">{message.text}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-none p-3 max-w-[85%]">
                    <div className="flex space-x-2 items-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-400 text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-700 bg-gray-900 rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about digital marketing, SEO, web development..."
                className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 antialiased"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full p-2 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-2 antialiased">
              Combine Zenith • AI-Powered Digital Solutions
            </p>
          </div>
        </div>
      )}
    </>
  );
}