'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'client' | 'owner';
  timestamp: Date;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // You can set your online status
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [clientName, setClientName] = useState('');
  const [isFirstMessage, setIsFirstMessage] = useState(true);

  // Simulate online status (you can connect this to your actual status)
  useEffect(() => {
    // Set online based on your schedule or manual toggle
    const currentHour = new Date().getHours();
    setIsOnline(currentHour >= 9 && currentHour <= 18); // 9 AM - 6 PM
  }, []);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'client',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate owner response (you can connect this to actual messaging)
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll get back to you shortly. You can also reach me directly via email, Telegram, or WhatsApp (+256758877168) for faster response.",
        sender: 'owner',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#25D366] text-white px-6 py-3 rounded-full font-mono text-sm tracking-widest uppercase font-bold hover:bg-[#128C7E] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
        >
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-300' : 'bg-gray-400'} animate-pulse`}></div>
          {isOnline ? 'Live Chat' : 'Leave Message'}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-black border border-[#e8c84a] rounded-lg shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#e8c84a] text-black px-4 py-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-600' : 'bg-gray-600'}`}></div>
          <span className="font-mono text-sm font-bold">
            {isOnline ? 'Henry - Online' : 'Henry - Offline'}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-black hover:text-gray-700 font-bold text-xl"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p className="font-mono text-sm mb-2">Start a conversation!</p>
            <p className="text-xs">I'll respond as soon as possible.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg ${
                message.sender === 'client'
                  ? 'bg-[#e8c84a] text-black'
                  : 'bg-gray-800 text-white'
              }`}
            >
              <p className="text-sm font-mono">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-[#e8c84a] p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isOnline ? "Type your message..." : "Leave a message..."}
            className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg font-mono text-sm border border-gray-700 focus:border-[#e8c84a] outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-[#e8c84a] text-black px-4 py-2 rounded-lg font-mono text-sm font-bold hover:bg-[#b8981e] transition-colors duration-200"
          >
            Send
          </button>
        </div>
        
        {!isOnline && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            I'm currently offline. I'll respond when I'm back online.
          </p>
        )}
      </div>
    </div>
  );
}
