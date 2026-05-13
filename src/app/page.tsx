import { PECSGenerator } from '@/components/pecs-generator';
import { BookOpen, ShieldCheck, Cpu, Globe, Users, Heart, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative pt-12 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-100/50 rounded-[100%] blur-[120px] -z-10"></div>
        
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Globe className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Gemma<span className="text-blue-600">Bridge</span>
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI for Inclusive Education</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-slate-600">
                <ShieldCheck size={20} className="text-green-500" />
                <span className="text-sm font-semibold tracking-tight">On-Device Privacy</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Cpu size={20} className="text-blue-500" />
                <span className="text-sm font-semibold tracking-tight">Gemma 4 Local Engine</span>
              </div>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-center">
            <header className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold animate-fade-in">
                <Sparkles size={16} />
                <span>Google Gemma 4 Challenge Entry</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Bridging the Gap for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Neurodiverse Learners.</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                GemmaBridge is a local-first co-pilot for educators. We use on-device AI to generate dynamic visual supports and adapt lesson plans in real-time.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                  <Users className="text-blue-500" size={18} />
                  <span className="text-sm font-bold text-slate-700">ASD Focused</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                  <Heart className="text-red-500" size={18} />
                  <span className="text-sm font-bold text-slate-700">Sensory-Friendly</span>
                </div>
              </div>
            </header>
            
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-3xl blur-3xl opacity-20 -z-10 animate-pulse-gentle"></div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 border-b pb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <BookOpen size={20} className="text-slate-400" />
                      </div>
                      <div className="h-4 w-32 bg-slate-100 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-slate-50 rounded-full"></div>
                      <div className="h-3 w-5/6 bg-slate-50 rounded-full"></div>
                      <div className="h-3 w-4/6 bg-slate-50 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="aspect-square bg-blue-50 rounded-2xl flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-200 rounded-lg animate-pulse"></div>
                      </div>
                      <div className="aspect-square bg-green-50 rounded-2xl flex items-center justify-center">
                        <div className="w-8 h-8 bg-green-200 rounded-lg animate-pulse delay-75"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PECSGenerator />
        </div>
      </div>

      {/* Benefits Section */}
      <section className="bg-white py-24 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Total Privacy</h4>
            <p className="text-slate-500 leading-relaxed">Runs entirely locally on the device. Sensitive student data never leaves the school's hardware.</p>
          </div>
          <div className="space-y-4">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
              <Cpu size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Edge Optimized</h4>
            <p className="text-slate-500 leading-relaxed">Designed for low-end hardware (4GB-6GB RAM) common in public school systems across Brazil.</p>
          </div>
          <div className="space-y-4">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
              <BookOpen size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Multimodal Assistant</h4>
            <p className="text-slate-500 leading-relaxed">Goes beyond text—translating classroom situations into instant visual choice boards.</p>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <p className="text-slate-500 font-medium">
              © 2026 GemmaBridge - Dev.to Google Gemma 4 Challenge
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Built for Neurodiverse Inclusion
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-black text-xs">G4</span>
              </div>
              <span className="font-bold text-slate-900">Gemma 4 E2B</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
