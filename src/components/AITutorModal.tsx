import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Loader2, BookOpen } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const AITutorModal: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Konnichiwa! I am your AI SSW Food Manufacturing Exam Assistant (特定技能1号 飲食料品製造業 AIチューター).\n\nAsk me anything about food hygiene, 5S, HACCP, bacteria, norovirus, storage temperatures, or workplace safety!',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const presetQuestions = [
    'Explain HACCP 7 Principles in simple terms',
    'What is the difference between Norovirus & Bacteria?',
    'What are the mandatory food allergen display items?',
    'Summarize 5S and factory zoning rules',
    'What are the storage temperatures for meat & fish?',
    'Explain Heinrich’s Law and KYT safety training',
  ];

  const handleSendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          topic: 'SSW Food Manufacturing 4th Edition Exam',
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || 'I apologize, I could not generate an answer right now.',
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI Tutor Fetch Error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Sorry, an error occurred while connecting to the AI Tutor: ${
          err.message || 'Please check your connection or GEMINI_API_KEY setting.'
        }`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
            <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              AI SSW Exam Tutor (Gemini Powered)
            </h1>
            <p className="text-xs text-slate-500">
              Get instant explanations with Japanese furigana and translations based on the OTAFF 4th Edition textbook.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Popular Study Questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {presetQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendPrompt(q)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all font-medium text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs min-h-[420px] flex flex-col justify-between space-y-4">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-jp ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-3 text-purple-600 text-xs font-semibold p-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Gemini is generating explanation...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputPrompt);
          }}
          className="flex items-center space-x-2 pt-3 border-t border-slate-100"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask AI Tutor a question about SSW Food Manufacturing..."
            disabled={isLoading}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all disabled:opacity-50"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
