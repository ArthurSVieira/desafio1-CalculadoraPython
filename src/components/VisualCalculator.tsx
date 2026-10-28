import React, { useState } from 'react';
import {
  OPERACOES,
  OPERACAO_POR_SIMBOLO,
  executarOperacaoPython,
  formatarNumeroPython,
} from '../services/pythonEngine';
import { PythonExecutionTrace } from '../types/calculator';
import {
  AlertTriangle,
  Layers,
  ArrowRight,
  Code2,
  Sparkles,
  Zap,
} from 'lucide-react';

export const VisualCalculator: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [activeOperator, setActiveOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [historyExpression, setHistoryExpression] = useState<string>('');
  const [lastTrace, setLastTrace] = useState<PythonExecutionTrace | null>(null);

  // Manipulação de dígitos
  const handleDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      if (displayValue === '0' && digit !== '.') {
        setDisplayValue(digit);
      } else if (digit === '.' && displayValue.includes('.')) {
        return; // Previne múltiplos pontos
      } else {
        setDisplayValue(displayValue + digit);
      }
    }
  };

  // Seleção de operador (+, -, *, /)
  const handleOperator = (opSymbol: string) => {
    const currentValue = parseFloat(displayValue.replace(',', '.'));

    if (storedValue === null) {
      setStoredValue(currentValue);
      setActiveOperator(opSymbol);
      setWaitingForSecondOperand(true);
      setHistoryExpression(`${formatarNumeroPython(currentValue)} ${opSymbol}`);
    } else if (activeOperator && !waitingForSecondOperand) {
      // Já havia operador anterior aguardando cálculo contínuo
      const opMeta = OPERACAO_POR_SIMBOLO[activeOperator];
      const trace = executarOperacaoPython(storedValue, currentValue, opMeta);
      setLastTrace(trace);

      if (trace.hasError) {
        setDisplayValue('Erro');
        setStoredValue(null);
        setActiveOperator(null);
        setWaitingForSecondOperand(true);
        setHistoryExpression(`${formatarNumeroPython(storedValue)} ${activeOperator} ${currentValue} =`);
        return;
      }

      const result = trace.rawResult!;
      setDisplayValue(formatarNumeroPython(result));
      setStoredValue(result);
      setActiveOperator(opSymbol);
      setWaitingForSecondOperand(true);
      setHistoryExpression(`${formatarNumeroPython(result)} ${opSymbol}`);
    } else {
      setActiveOperator(opSymbol);
      setHistoryExpression(`${formatarNumeroPython(storedValue)} ${opSymbol}`);
    }
  };

  // Executar igualdade (=)
  const handleEquals = () => {
    if (storedValue === null || !activeOperator) return;

    const currentValue = parseFloat(displayValue.replace(',', '.'));
    const opMeta = OPERACAO_POR_SIMBOLO[activeOperator];
    const trace = executarOperacaoPython(storedValue, currentValue, opMeta);
    setLastTrace(trace);

    setHistoryExpression(
      `${formatarNumeroPython(storedValue)} ${opMeta.mathSymbol} ${formatarNumeroPython(currentValue)} =`
    );

    if (trace.hasError) {
      setDisplayValue('Erro');
      setStoredValue(null);
      setActiveOperator(null);
      setWaitingForSecondOperand(true);
    } else {
      setDisplayValue(formatarNumeroPython(trace.rawResult!));
      setStoredValue(null);
      setActiveOperator(null);
      setWaitingForSecondOperand(true);
    }
  };

  // Reset total
  const handleAllClear = () => {
    setDisplayValue('0');
    setStoredValue(null);
    setActiveOperator(null);
    setWaitingForSecondOperand(false);
    setHistoryExpression('');
    setLastTrace(null);
  };

  // Inverter sinal (±)
  const handleToggleSign = () => {
    const val = parseFloat(displayValue.replace(',', '.'));
    if (!isNaN(val)) {
      const inverted = -val;
      setDisplayValue(formatarNumeroPython(inverted));
    }
  };

  // Porcentagem (%)
  const handlePercentage = () => {
    const val = parseFloat(displayValue.replace(',', '.'));
    if (!isNaN(val)) {
      const pct = val / 100;
      setDisplayValue(formatarNumeroPython(pct));
    }
  };

  // Apagar último dígito (Backspace)
  const handleDelete = () => {
    if (waitingForSecondOperand || displayValue === 'Erro') {
      setDisplayValue('0');
      return;
    }
    if (displayValue.length <= 1) {
      setDisplayValue('0');
    } else {
      setDisplayValue(displayValue.slice(0, -1));
    }
  };

  // Carregar casos pré-configurados
  const loadPreset = (a: number, b: number, opKey: string) => {
    const opMeta = OPERACOES[opKey];
    setStoredValue(a);
    setActiveOperator(opMeta.symbol);
    setDisplayValue(b.toString());
    const trace = executarOperacaoPython(a, b, opMeta);
    setLastTrace(trace);
    setHistoryExpression(`${formatarNumeroPython(a)} ${opMeta.mathSymbol} ${formatarNumeroPython(b)} =`);
    if (trace.hasError) {
      setDisplayValue('Erro');
    } else {
      setDisplayValue(formatarNumeroPython(trace.rawResult!));
    }
    setStoredValue(null);
    setActiveOperator(null);
    setWaitingForSecondOperand(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Editorial Headline */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <span>Ambiente de Execução Python</span>
          <span aria-hidden="true">·</span>
          <span>4 Operações Fundamentais</span>
          <span aria-hidden="true">·</span>
          <span>Inspeção em Tempo Real</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Calculadora com Mapeamento de Estado Python
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          Utilize o teclado da calculadora para interagir com as funções puras de
          adição, subtração, multiplicação e divisão. O painel lateral inspeciona a memória,
          pilha de execução e tratamento defensivo de exceções em tempo real.
        </p>
      </div>

      {/* Main Grid: Calculator UI (Left) + Python State Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Calculator (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
          {/* Header of Calc */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">PyCalc Hardware Engine</span>
            <span className="font-mono tabular-nums">IEEE 754 64-bit float</span>
          </div>

          {/* Calculator Screen / Display */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800/90 mb-5 flex flex-col justify-end min-h-[110px]">
            <div className="text-right text-xs font-mono text-slate-400 h-5 overflow-hidden text-ellipsis whitespace-nowrap">
              {historyExpression || (storedValue !== null ? `${formatarNumeroPython(storedValue)} ${activeOperator}` : '')}
            </div>
            <div className="text-right text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white overflow-hidden text-ellipsis whitespace-nowrap mt-1">
              {displayValue}
            </div>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {/* Row 1: Function Keys */}
            <button
              onClick={handleAllClear}
              className="py-3 px-2 text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700/80 active:bg-slate-700 text-amber-400 transition-colors"
            >
              AC
            </button>
            <button
              onClick={handleToggleSign}
              className="py-3 px-2 text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700/80 active:bg-slate-700 text-slate-300 transition-colors"
            >
              ±
            </button>
            <button
              onClick={handlePercentage}
              className="py-3 px-2 text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700/80 active:bg-slate-700 text-slate-300 transition-colors"
            >
              %
            </button>
            <button
              onClick={() => handleOperator('/')}
              className={`py-3 px-2 text-lg font-bold rounded-lg transition-colors ${
                activeOperator === '/'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-800/40'
              }`}
            >
              ÷
            </button>

            {/* Row 2: 7, 8, 9, Multiply */}
            <button
              onClick={() => handleDigit('7')}
              className="py-3.5 px-2 text-base font-semibold rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
            >
              7
            </button>
            <button
              onClick={() => handleDigit('8')}
              className="py-3.5 px-2 text-base font-semibold rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
            >
              8
            </button>
            <button
              onClick={() => handleDigit('9')}
              className="py-3.5 px-2 text-base font-semibold rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
            >
              9
            </button>
            <button
              onClick={() => handleOperator('*')}
              className={`py-3 px-2 text-lg font-bold rounded-lg transition-colors ${
                activeOperator === '*'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-800/40'
              }`}
            >
              ×
            </button>

            {/* Row 3: 4, 5, 6, Subtract */}
            <button
              onClick={() => handleDigit('4')}
              className="py-3.5 px-2 text-base font-semibold rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
            >
              4
            </button>
            <button
              onClick={() => handleDigit('5')}
              className="py-3.5 px-2 text-base font-semibold rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
            >
              5
            </button>
            <button
              onClick={() => handleDigit('6')}
              className="py-3.5 px-2 text-base font-semibold rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
            >
              6
            </button>
            <button
              onClick={() => handleOperator('-')}
              className={`py-3 px-2 text-lg font-bold rounded-lg transition-colors ${
                activeOperator === '-'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-800/40'
              }`}
            >
              −
            </button>

            {/* Row 4: 1, 2, 3, Add */}
            <button
              onClick={() => handleDigit('1')}
              className="py-3.5 px-2 text-base font-semibold rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
            >
              1
            </button>
            <button
              onClick={() => handleDigit('2')}
              className="py-3.5 px-2 text-base font-semibold rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
            >
              2
            </button>
            <button
              onClick={() => handleDigit('3')}
              className="py-3.5 px-2 text-base font-semibold rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
            >
              3
            </button>
            <button
              onClick={() => handleOperator('+')}
              className={`py-3 px-2 text-lg font-bold rounded-lg transition-colors ${
                activeOperator === '+'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-800/40'
              }`}
            >
              +
            </button>

            {/* Row 5: 0, Dot, Delete, Equals */}
            <button
              onClick={() => handleDigit('0')}
              className="py-3.5 px-2 text-base font-semibold rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
            >
              0
            </button>
            <button
              onClick={() => handleDigit('.')}
              className="py-3.5 px-2 text-base font-semibold rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white transition-colors"
            >
              .
            </button>
            <button
              onClick={handleDelete}
              className="py-3.5 px-2 text-xs font-semibold rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              DEL
            </button>
            <button
              onClick={handleEquals}
              className="py-3 px-2 text-lg font-bold rounded-lg bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 transition-colors shadow-md shadow-amber-400/20"
            >
              =
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <span className="text-xs font-medium text-slate-400 block mb-2">
              Casos Rápidos de Demonstração:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loadPreset(50, 0, '4')}
                className="text-left px-2.5 py-1.5 text-xs bg-slate-800/60 hover:bg-red-950/40 border border-slate-700/60 hover:border-red-700/50 rounded text-red-300 transition-colors"
              >
                <span className="font-mono">50 ÷ 0</span>
                <span className="block text-[10px] text-slate-400">ZeroDivisionError</span>
              </button>
              <button
                onClick={() => loadPreset(0.1, 0.2, '1')}
                className="text-left px-2.5 py-1.5 text-xs bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 rounded text-cyan-300 transition-colors"
              >
                <span className="font-mono">0.1 + 0.2</span>
                <span className="block text-[10px] text-slate-400">Formatação IEEE 754</span>
              </button>
              <button
                onClick={() => loadPreset(150, 27.5, '2')}
                className="text-left px-2.5 py-1.5 text-xs bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 rounded text-slate-300 transition-colors"
              >
                <span className="font-mono">150 − 27.5</span>
                <span className="block text-[10px] text-slate-400">Subtração com Decimal</span>
              </button>
              <button
                onClick={() => loadPreset(16, 25, '3')}
                className="text-left px-2.5 py-1.5 text-xs bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 rounded text-slate-300 transition-colors"
              >
                <span className="font-mono">16 × 25</span>
                <span className="block text-[10px] text-slate-400">Multiplicação Inteira</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Python State Inspector & Execution Trace (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live State Variables Box */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">
                  Variáveis de Estado em Memória (Python Scope)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">namespace: local (função)</span>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400 font-mono">num1 (float)</div>
                <div className="text-base font-bold font-mono text-cyan-300 mt-1 tabular-nums">
                  {storedValue !== null ? formatarNumeroPython(storedValue) : lastTrace ? formatarNumeroPython(lastTrace.operandA) : 'None'}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400 font-mono">num2 (float)</div>
                <div className="text-base font-bold font-mono text-cyan-300 mt-1 tabular-nums">
                  {lastTrace ? formatarNumeroPython(lastTrace.operandB) : waitingForSecondOperand ? 'Aguardando...' : displayValue}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400 font-mono">op (operador)</div>
                <div className="text-base font-bold font-mono text-amber-300 mt-1">
                  {activeOperator ? `"${activeOperator}"` : lastTrace ? `"${lastTrace.operationSymbol}"` : 'None'}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400 font-mono">resultado</div>
                <div className={`text-base font-bold font-mono mt-1 tabular-nums ${lastTrace?.hasError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {lastTrace?.hasError ? 'Exceção' : lastTrace?.formattedResult ? lastTrace.formattedResult : 'None'}
                </div>
              </div>
            </div>

            {/* Active Python Function Signature */}
            <div className="mt-4 p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
              <div className="text-xs text-slate-400 font-mono mb-1">Função Pura Invocada:</div>
              <div className="text-xs font-mono text-amber-200">
                def {lastTrace ? lastTrace.pythonFunction : activeOperator ? OPERACAO_POR_SIMBOLO[activeOperator]?.pythonFunc : 'nenhuma_operacao_em_andamento()'}
              </div>
            </div>
          </div>

          {/* Execution Trace / Stack Frame Details */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">
                  Rastreamento do Ciclo de Execução (Trace & Stack)
                </h3>
              </div>
              {lastTrace && (
                <span className="text-xs text-slate-400 font-mono">
                  tempo: {(lastTrace.executionTimeMs * 1000).toFixed(0)}µs
                </span>
              )}
            </div>

            {lastTrace ? (
              <div className="mt-4 space-y-4">
                {/* Error Banner if ZeroDivisionError or Exception */}
                {lastTrace.hasError && (
                  <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200">
                    <div className="flex items-center gap-2 font-semibold text-sm text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{lastTrace.errorType} Disparado e Capturado!</span>
                    </div>
                    <p className="mt-1.5 text-xs text-red-300">
                      {lastTrace.errorMessage}
                    </p>
                    <p className="mt-2 text-[11px] text-slate-300">
                      A função <code className="text-amber-300">dividir(a, b)</code> verificou que <code className="text-amber-300">b == 0</code> e executou um <code className="text-amber-300">raise ZeroDivisionError</code>. O bloco <code className="text-cyan-300">try/except</code> no loop REPL capturou a exceção sem abortar o processo da calculadora.
                    </p>
                  </div>
                )}

                {/* Steps List */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Etapas do Processamento
                  </h4>
                  <div className="space-y-1.5">
                    {lastTrace.steps.map((st, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs font-mono text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800/60"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated CPython Bytecode */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Instruções de Bytecode (CPython VM)
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">dis.dis()</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
                    {lastTrace.pseudoBytecode.map((ins, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-slate-600 select-none w-6 text-right">
                          {i * 2}
                        </span>
                        <span className="text-cyan-300">{ins}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call Stack Frames */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Pilha de Chamadas Ativa (Call Stack)
                  </h4>
                  <div className="space-y-1 font-mono text-xs">
                    {lastTrace.callStack.map((frame, index) => (
                      <div
                        key={index}
                        className={`px-3 py-1.5 rounded flex items-center justify-between ${
                          index === lastTrace.callStack.length - 1
                            ? 'bg-amber-950/40 border border-amber-800/60 text-amber-200'
                            : 'bg-slate-950/50 text-slate-400'
                        }`}
                      >
                        <span>Frame #{index}: {frame}</span>
                        {index === lastTrace.callStack.length - 1 && (
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                            Top of Stack
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                <p>Nenhuma operação calculada ainda.</p>
                <p className="mt-1 text-slate-600">
                  Faça um cálculo no teclado ou clique em um dos casos rápidos acima.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
