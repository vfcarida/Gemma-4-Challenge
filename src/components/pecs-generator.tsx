'use client';

import React, { useState } from 'react';
import { Mic, Send, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { PECSCard, PECSGrid } from './pecs-card';

interface Card {
  id: string;
  title: string;
  icon: string;
  color: string;
}

export const PECSGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [isListening, setIsListening] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setCards([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.success) {
        setCards(data.cards);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateListening = () => {
    setIsListening(true);
    // Simulate speech-to-text input
    setTimeout(() => {
      setPrompt('Lucas is overwhelmed by the recess bell. Generate a 4-option visual board for his self-regulation.');
      setIsListening(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-12 pb-20">
      {/* Input Section */}
      <div className="w-full glass p-8 rounded-[2rem] shadow-2xl border border-white/20 space-y-6">
        <div className="flex items-center space-x-3 text-blue-600 mb-2">
          <Sparkles className="animate-pulse" />
          <h2 className="text-xl font-semibold">Smart PECS Generator</h2>
        </div>
        
        <div className="relative group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the situation or student's needs..."
            className="w-full h-32 p-6 bg-white/50 border-2 border-slate-200 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-lg text-slate-800 placeholder:text-slate-400"
          />
          
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={simulateListening}
              className={`p-3 rounded-full transition-all ${
                isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
              title="Simulate Speech-to-Text"
            >
              <Mic size={24} />
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center space-x-2 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {isListening && (
          <p className="text-sm text-slate-500 animate-pulse flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Listening to teacher...
          </p>
        )}
      </div>

      {/* Results Section */}
      <div className="w-full">
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <div className="relative">
              <Loader2 size={64} className="text-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-700">Gemma 4 processing locally...</h3>
              <p className="text-slate-500">Analyzing classroom context & generating visual options</p>
            </div>
          </div>
        )}

        {cards.length > 0 && !isLoading && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800">Generated PECS Board</h3>
              <button 
                onClick={handleGenerate}
                className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors"
              >
                <RefreshCw size={18} />
                <span>Regenerate</span>
              </button>
            </div>
            
            <PECSGrid>
              {cards.map((card) => (
                <PECSCard
                  key={card.id}
                  title={card.title}
                  iconName={card.icon}
                  colorClass={card.color}
                />
              ))}
            </PECSGrid>
            
            <div className="flex justify-center mt-12">
              <button className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-xl active:scale-95">
                Print PECS Board
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
