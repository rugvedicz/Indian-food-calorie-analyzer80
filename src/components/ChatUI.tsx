import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Sparkles, MoreHorizontal, Info, Trash2, Camera, Image as ImageIcon } from 'lucide-react';
import { Message } from '../types';

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Nutritionist. I can help you analyze meals, calculate calories, or plan your diet. What's on your mind?",
      sender: 'bot',
      timestamp: new Date(Date.now() - 100000),
    },
    {
      id: '2',
      text: "You can also upload a photo of your food here for a quick analysis!",
      sender: 'bot',
      timestamp: new Date(Date.now() - 50000),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Is biryani healthy?",
    "How many calories should I eat?",
    "High protein snacks?",
    "Benefits of avocado?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getDummyResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const getDummyResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('calorie')) return "To lose weight, a general rule is to reduce your daily intake by about 500 calories. Based on your profile, I recommend aiming for 1,800 calories per day.";
    if (q.includes('protein')) return "Great question! High-protein foods include chicken breast, Greek yogurt, lentils, and eggs. Aim for about 0.8g to 1g of protein per pound of body weight.";
    if (q.includes('apple')) return "A medium-sized apple contains about 95 calories, 25g of carbs, and 4g of fiber. It's an excellent snack choice!";
    if (q.includes('biryani')) return "Biryani can be high in calories and fats depending on the preparation. A typical serving can range from 400 to 700 calories. Try to opt for lean meat and less oil if possible!";
    return "That's interesting! I'm still learning about specific meal plans, but I can help you analyze any food image or give you general nutritional advice.";
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="max-w-2xl mx-auto h-[500px] flex flex-col bg-white rounded-2xl shadow-xl border border-light-gray/30 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-light-gray/30 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-navy">Nutrition Assistant</h2>
            <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 hover:bg-red-50 text-medium-gray hover:text-red-500 rounded-lg transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 scroll-smooth"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[65%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm ${
                msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`relative px-4 py-2 rounded-2xl shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-gray-200 text-gray-800 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] mt-1 block ${
                  msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-200 p-3 rounded-2xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-light-gray/30">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }} 
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 bg-gray-100 border-transparent focus:border-primary focus:bg-white border-2 rounded-xl outline-none transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 btn-gradient rounded-xl disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
