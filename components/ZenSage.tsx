import React, { useState, useEffect } from 'react';
import { getCatWisdom } from '../services/geminiService';
import { Sparkles, Send, Cat } from 'lucide-react';
import { ChatMessage } from '../types';

const ZenSage: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initial Greeting
  useEffect(() => {
    setMessages([{
      role: 'model',
      text: "Bienvenue dans mon dojo, petit félin. Que cherches-tu ? Une sieste parfaite, ou la paix de l'esprit ?"
    }]);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const wisdom = await getCatWisdom(userMsg.text);
      const modelMsg: ChatMessage = { role: 'model', text: wisdom };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
        console.error(e);
        setMessages(prev => [...prev, { role: 'model', text: "Le cosmos est trouble... Je ne peux répondre pour l'instant." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Comment mieux dormir ?",
    "Pourquoi les humains sont bizarres ?",
    "Le secret du bonheur ?",
    "J'ai vu un oiseau..."
  ];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#1a1a1a] p-4 md:p-8">
      <div className="w-full max-w-2xl h-[80vh] flex flex-col bg-[#2a2a2a] rounded-xl shadow-2xl border border-white/5 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#333] p-4 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Cat size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-200">Le Sage Félin</h3>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              En ligne
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-[#3a3a3a] text-gray-200 rounded-tl-sm border border-white/5'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#3a3a3a] p-3 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-2">
                <Sparkles size={16} className="animate-spin text-amber-400" />
                <span className="text-xs text-gray-400">Le sage réfléchit...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#2d2d2d] border-t border-white/5">
            {/* Suggestions */}
            {messages.length < 3 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {suggestions.map(s => (
                        <button 
                            key={s}
                            onClick={() => { setInput(s); }} 
                            className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-gray-400 border border-white/5 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Posez votre question au sage..."
              className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ZenSage;
