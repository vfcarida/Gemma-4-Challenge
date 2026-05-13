'use client';

import React, { useState } from 'react';
import { Mic, Send, Loader2, Sparkles, RefreshCw, Layout, BookText, ArrowRight, Lightbulb } from 'lucide-react';
import { PECSCard, PECSGrid } from './pecs-card';

interface Card {
  id: string;
  title: string;
  icon: string;
  color: string;
}

interface Adaptation {
  title: string;
  description: string;
}

const EXAMPLES = [
  "Lucas is overwhelmed by the recess bell. Generate self-regulation options.",
  "Maria is hungry but cannot express what she wants to eat.",
  "A student is struggling with the transition to Math class."
];

const LESSON_EXAMPLE = "Adapt a 30-minute English Reading lesson for a classroom with 2 ASD students.";

export const PECSGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pecs' | 'lesson'>('pecs');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [adaptations, setAdaptations] = useState<Adaptation[]>([]);
  const [isListening, setIsListening] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setCards([]);
    setAdaptations([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: activeTab }),
      });

      const data = await response.json();
      if (data.success) {
        if (activeTab === 'pecs') {
          setCards(data.cards);
        } else {
          setAdaptations(data.adaptations);
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setPrompt(activeTab === 'pecs' ? EXAMPLES[0] : LESSON_EXAMPLE);
      setIsListening(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8 pb-20">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-slate-200/50 rounded-2xl w-fit">
        <button
          onClick={() => { setActiveTab('pecs'); setPrompt(''); setCards([]); setAdaptations([]); }}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'pecs' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layout size={20} />
          <span>Smart PECS</span>
        </button>
        <button
          onClick={() => { setActiveTab('lesson'); setPrompt(''); setCards([]); setAdaptations([]); }}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'lesson' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <BookText size={20} />
          <span>Lesson Adaptor</span>
        </button>
      </div>

      {/* Input Section */}
      <div className="w-full glass p-8 rounded-[2rem] shadow-2xl border border-white/20 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3 text-blue-600">
            <Sparkles className="animate-pulse" />
            <h2 className="text-xl font-semibold">
              {activeTab === 'pecs' ? 'Smart PECS Generator' : 'Dynamic Lesson Adaptor'}
            </h2>
          </div>
          <div className="flex items-center text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Gemma 4 E2B Local
          </div>
        </div>
        
        <div className="relative group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={activeTab === 'pecs' ? "Describe the student's needs..." : "Paste your lesson plan here..."}
            className="w-full h-40 p-6 bg-white/50 border-2 border-slate-200 rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-lg text-slate-800 placeholder:text-slate-400"
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
                  <span>Analyzing...</span>
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

        {/* Quick Examples */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
            <Lightbulb size={14} className="mr-1 text-yellow-500" />
            Quick Examples
          </p>
          <div className="flex flex-wrap gap-2">
            {(activeTab === 'pecs' ? EXAMPLES : [LESSON_EXAMPLE]).map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex)}
                className="text-xs font-medium text-slate-500 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors border border-slate-200 text-left"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {isListening && (
          <p className="text-sm text-slate-500 animate-pulse flex items-center mt-2">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Listening to teacher...
          </p>
        )}
      </div>

      {/* Results Section */}
      <div className="w-full min-h-[300px]">
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
              <p className="text-slate-500">
                {activeTab === 'pecs' 
                  ? 'Analyzing classroom context & generating visual options' 
                  : 'Adapting instructional content for neurodiverse learners'}
              </p>
            </div>
          </div>
        )}

        {/* PECS Result */}
        {activeTab === 'pecs' && cards.length > 0 && !isLoading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800">Generated PECS Board</h3>
              <button onClick={handleGenerate} className="flex items-center space-x-2 text-slate-500 hover:text-blue-600">
                <RefreshCw size={18} />
                <span>Regenerate</span>
              </button>
            </div>
            <PECSGrid>
              {cards.map((card) => (
                <PECSCard key={card.id} title={card.title} iconName={card.icon} colorClass={card.color} />
              ))}
            </PECSGrid>
          </div>
        )}

        {/* Lesson Result */}
        {activeTab === 'lesson' && adaptations.length > 0 && !isLoading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800">Autism-Friendly Adaptations</h3>
              <button onClick={handleGenerate} className="flex items-center space-x-2 text-slate-500 hover:text-blue-600">
                <RefreshCw size={18} />
                <span>Regenerate</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {adaptations.map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border-2 border-blue-50 shadow-sm hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowRight size={20} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-600 p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between shadow-xl">
              <div>
                <h4 className="text-xl font-bold mb-1">Lesson Adaptation Complete</h4>
                <p className="text-blue-100 opacity-90">Ready to implement in your classroom.</p>
              </div>
              <button className="mt-4 md:mt-0 px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-lg">
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
