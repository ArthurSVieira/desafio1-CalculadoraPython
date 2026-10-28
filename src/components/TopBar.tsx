import React from 'react';
import { Download, Terminal, Cpu, Calculator, BookOpen } from 'lucide-react';

export type ActiveTab = 'visual' | 'terminal' | 'architecture' | 'code';

interface TopBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onDownloadScript: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onDownloadScript,
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('visual');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <span className="w-7 h-7 rounded bg-gradient-to-br from-amber-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm">
            Py
          </span>
          <span>PyCalc Studio</span>
        </a>
        <span className="hidden sm:inline text-xs text-slate-400">
          Python 3.10 · 4 Operações Básicas
        </span>
      </div>

      {/* Zone 2: Navigation Links (Single-line controls) */}
      <nav className="hidden md:flex items-center gap-1 text-sm font-medium p-1 bg-slate-900/80 rounded-lg border border-slate-800">
        <button
          onClick={() => onTabChange('visual')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'visual'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Calculadora Visual</span>
        </button>

        <button
          onClick={() => onTabChange('terminal')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'terminal'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Terminal REPL</span>
        </button>

        <button
          onClick={() => onTabChange('architecture')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'architecture'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Análise de Código</span>
        </button>

        <button
          onClick={() => onTabChange('code')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'code'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Código & Testes</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onDownloadScript}
          title="Baixar arquivo calculadora.py completo"
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-lg shadow-sm whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Baixar calculadora.py</span>
        </button>
      </div>
    </header>
  );
};
