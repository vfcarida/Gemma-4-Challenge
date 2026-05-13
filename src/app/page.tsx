import { PECSGenerator } from '@/components/pecs-generator';
import { BookOpen, ShieldCheck, Cpu } from 'lucide-react';

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
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  GemmaEduca <span className="text-blue-600">TEA</span>
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assistant for ASD Educators</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-slate-600">
                <ShieldCheck size={20} className="text-green-500" />
                <span className="text-sm font-medium">Privacy Focused</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Cpu size={20} className="text-blue-500" />
                <span className="text-sm font-medium">Local-First AI</span>
              </div>
            </div>
          </nav>

          <header className="max-w-3xl mb-16 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
              Empowering Students through <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Visual Choice.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
              Dynamically generate PECS boards in seconds using local Gemma 4 E2B processing. Designed for inclusive classrooms and sensory-friendly environments.
            </p>
          </header>

          <PECSGenerator />
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <p className="text-slate-500 font-medium">
            © 2026 GemmaEduca TEA - Dev.to Google Gemma 4 Challenge
          </p>
          <div className="flex items-center space-x-6">
            <span className="text-sm font-bold text-slate-400 uppercase">Powered by</span>
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
