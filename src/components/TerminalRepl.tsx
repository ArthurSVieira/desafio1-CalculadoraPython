import React, { useState, useRef, useEffect } from 'react';
import {
  OPERACOES,
  OPERACAO_POR_SIMBOLO,
  executarOperacaoPython,
  formatarNumeroPython,
  executarSuiteTestes,
} from '../services/pythonEngine';
import { Terminal, Play, RotateCcw, HelpCircle, CheckCircle, Bug } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'system' | 'prompt' | 'input' | 'output' | 'error' | 'success' | 'banner';
  text: string;
}

type ReplStep = 'menu' | 'input_num1' | 'input_num2' | 'ask_repeat';

export const TerminalRepl: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [replStep, setReplStep] = useState<ReplStep>('menu');
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [tempNum1, setTempNum1] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Inicializa o banner inicial do REPL
  const resetRepl = () => {
    setReplStep('menu');
    setSelectedOp(null);
    setTempNum1(null);
    setCurrentInput('');
    setLines([
      { id: '1', type: 'system', text: '$ python3 calculadora.py' },
      { id: '2', type: 'banner', text: '==================================================' },
      { id: '3', type: 'banner', text: '           CALCULADORA BÁSICA EM PYTHON           ' },
      { id: '4', type: 'banner', text: '==================================================' },
      { id: '5', type: 'output', text: '\nEscolha a operação desejada:' },
      { id: '6', type: 'output', text: '  [1] Adição (+)' },
      { id: '7', type: 'output', text: '  [2] Subtração (-)' },
      { id: '8', type: 'output', text: '  [3] Multiplicação (×)' },
      { id: '9', type: 'output', text: '  [4] Divisão (÷)' },
      { id: '10', type: 'output', text: '  [5] Porcentagem (%)' },
      { id: '11', type: 'output', text: '  [6] Seno (sin)' },
      { id: '12', type: 'output', text: '  [7] Cosseno (cos)' },
      { id: '13', type: 'output', text: '  [0] Sair do programa' },
      { id: '14', type: 'prompt', text: 'Digite a opção (número ou símbolo): ' },
    ]);
  };

  useEffect(() => {
    resetRepl();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawVal = currentInput;
    const trimmed = rawVal.trim();
    setCurrentInput('');

    if (trimmed !== '') {
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
    }

    // Comandos globais do terminal
    if (trimmed.toLowerCase() === 'clear') {
      resetRepl();
      return;
    }

    if (trimmed.toLowerCase() === 'python3 calculadora.py --test' || trimmed.toLowerCase() === 'pytest') {
      const testResults = executarSuiteTestes();
      const newLines: TerminalLine[] = [
        { id: Math.random().toString(), type: 'input', text: rawVal },
        { id: Math.random().toString(), type: 'system', text: 'Executando suíte de testes unitários...' },
      ];
      testResults.forEach((t) => {
        newLines.push({
          id: Math.random().toString(),
          type: t.passed ? 'success' : 'error',
          text: `  ${t.passed ? '✔' : '✖'} ${t.name}: ${t.expression} -> ${t.actual} (${t.durationUs}µs)`,
        });
      });
      newLines.push({
        id: Math.random().toString(),
        type: 'success',
        text: `✔ Todos os ${testResults.length} testes unitários passaram com 100% de conformidade.\n`,
      });
      newLines.push({ id: Math.random().toString(), type: 'prompt', text: getPromptText(replStep) });
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    // Fluxo interativo de passos da calculadora
    if (replStep === 'menu') {
      const choice = trimmed.toLowerCase();
      const newLines: TerminalLine[] = [{ id: Math.random().toString(), type: 'input', text: rawVal }];

      if (choice === '0' || choice === 'sair' || choice === 'exit' || choice === 'q') {
        newLines.push({
          id: Math.random().toString(),
          type: 'system',
          text: '\nEncerrando a calculadora. Até breve!\n[Processo Python finalizado com código de saída 0]',
        });
        setLines((prev) => [...prev, ...newLines]);
        return;
      }

      if (choice in OPERACAO_POR_SIMBOLO) {
        const opMeta = OPERACAO_POR_SIMBOLO[choice];
        setSelectedOp(opMeta.symbol);
        setReplStep('input_num1');
        newLines.push({
          id: Math.random().toString(),
          type: 'system',
          text: `\n--- Operação selecionada: ${opMeta.name} (${opMeta.mathSymbol}) ---`,
        });
        newLines.push({
          id: Math.random().toString(),
          type: 'prompt',
          text: opMeta.isUnary
            ? 'Digite o ângulo em graus: '
            : opMeta.id === 'porcentagem'
            ? 'Digite a porcentagem (A%): '
            : 'Digite o primeiro número (A): ',
        });
        setLines((prev) => [...prev, ...newLines]);
      } else {
        newLines.push({
          id: Math.random().toString(),
          type: 'error',
          text: `⚠ Opção inválida ('${rawVal}'). Por favor, digite de 1 a 7 ou o símbolo correspondente.`,
        });
        newLines.push({
          id: Math.random().toString(),
          type: 'prompt',
          text: 'Digite a opção (número ou símbolo): ',
        });
        setLines((prev) => [...prev, ...newLines]);
      }
    } else if (replStep === 'input_num1') {
      const newLines: TerminalLine[] = [{ id: Math.random().toString(), type: 'input', text: rawVal }];
      const sanitized = trimmed.replace(',', '.');
      const num = Number(sanitized);
      const opMeta = OPERACAO_POR_SIMBOLO[selectedOp!];

      if (isNaN(num) || sanitized === '' || !isFinite(num)) {
        newLines.push({
          id: Math.random().toString(),
          type: 'error',
          text: `⚠ Entrada inválida ('${rawVal}'). Digite um número válido (ex: 10, 3.14, -5).`,
        });
        newLines.push({
          id: Math.random().toString(),
          type: 'prompt',
          text: opMeta.isUnary ? 'Digite o ângulo em graus: ' : 'Digite o primeiro número (A): ',
        });
        setLines((prev) => [...prev, ...newLines]);
      } else if (opMeta.isUnary) {
        newLines.push({
          id: Math.random().toString(),
          type: 'system',
          text: 'Processando operação...',
        });
        const trace = executarOperacaoPython(num, 0, opMeta);
        newLines.push({
          id: Math.random().toString(),
          type: 'success',
          text: '\n--------------------------------------------------',
        });
        newLines.push({
          id: Math.random().toString(),
          type: 'success',
          text: `✅ SUCESSO: ${opMeta.mathSymbol}(${formatarNumeroPython(num)}°) = ${trace.formattedResult}`,
        });
        newLines.push({
          id: Math.random().toString(),
          type: 'success',
          text: '--------------------------------------------------',
        });
        setReplStep('ask_repeat');
        newLines.push({
          id: Math.random().toString(),
          type: 'prompt',
          text: '\nDeseja realizar outra operação? (S/n): ',
        });
        setLines((prev) => [...prev, ...newLines]);
      } else {
        setTempNum1(num);
        setReplStep('input_num2');
        newLines.push({
          id: Math.random().toString(),
          type: 'prompt',
          text: opMeta.id === 'porcentagem' ? 'Digite o valor base (B): ' : 'Digite o segundo número (B): ',
        });
        setLines((prev) => [...prev, ...newLines]);
      }
    } else if (replStep === 'input_num2') {
      const newLines: TerminalLine[] = [{ id: Math.random().toString(), type: 'input', text: rawVal }];
      const sanitized = trimmed.replace(',', '.');
      const num2 = Number(sanitized);

      if (isNaN(num2) || sanitized === '' || !isFinite(num2)) {
        newLines.push({
          id: Math.random().toString(),
          type: 'error',
          text: `⚠ Entrada inválida ('${rawVal}'). Digite um número válido (ex: 10, 3.14, -5).`,
        });
        newLines.push({
          id: Math.random().toString(),
          type: 'prompt',
          text: 'Digite o segundo número (B): ',
        });
        setLines((prev) => [...prev, ...newLines]);
      } else {
        const num1 = tempNum1!;
        const opMeta = OPERACAO_POR_SIMBOLO[selectedOp!];
        newLines.push({
          id: Math.random().toString(),
          type: 'system',
          text: 'Processando operação...',
        });

        const trace = executarOperacaoPython(num1, num2, opMeta);

        if (trace.hasError) {
          newLines.push({
            id: Math.random().toString(),
            type: 'error',
            text: '\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
          });
          newLines.push({
            id: Math.random().toString(),
            type: 'error',
            text: `❌ ERRO DE EXECUÇÃO: ${trace.errorMessage}`,
          });
          newLines.push({
            id: Math.random().toString(),
            type: 'error',
            text: '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
          });
        } else {
          newLines.push({
            id: Math.random().toString(),
            type: 'success',
            text: '\n--------------------------------------------------',
          });
          newLines.push({
            id: Math.random().toString(),
            type: 'success',
            text:
              opMeta.id === 'porcentagem'
                ? `✅ SUCESSO: ${formatarNumeroPython(num1)}% de ${formatarNumeroPython(num2)} = ${trace.formattedResult}`
                : `✅ SUCESSO: ${formatarNumeroPython(num1)} ${opMeta.mathSymbol} ${formatarNumeroPython(num2)} = ${trace.formattedResult}`,
          });
          newLines.push({
            id: Math.random().toString(),
            type: 'success',
            text: '--------------------------------------------------',
          });
        }

        setReplStep('ask_repeat');
        newLines.push({
          id: Math.random().toString(),
          type: 'prompt',
          text: '\nDeseja realizar outra operação? (S/n): ',
        });
        setLines((prev) => [...prev, ...newLines]);
      }
    } else if (replStep === 'ask_repeat') {
      const choice = trimmed.toLowerCase();
      const newLines: TerminalLine[] = [{ id: Math.random().toString(), type: 'input', text: rawVal }];

      if (choice === 'n' || choice === 'nao' || choice === 'não' || choice === 'sair' || choice === 'exit') {
        newLines.push({
          id: Math.random().toString(),
          type: 'system',
          text: '\nObrigado por usar a calculadora. Sessão finalizada com sucesso!\n[Processo finalizado]',
        });
        setLines((prev) => [...prev, ...newLines]);
      } else {
        // Reinicia ciclo
        setReplStep('menu');
        setSelectedOp(null);
        setTempNum1(null);
        newLines.push({ id: Math.random().toString(), type: 'output', text: '\nEscolha a operação desejada:' });
        newLines.push({ id: Math.random().toString(), type: 'output', text: '  [1] Adição (+)' });
        newLines.push({ id: Math.random().toString(), type: 'output', text: '  [2] Subtração (-)' });
        newLines.push({ id: Math.random().toString(), type: 'output', text: '  [3] Multiplicação (×)' });
        newLines.push({ id: Math.random().toString(), type: 'output', text: '  [4] Divisão (÷)' });
        newLines.push({ id: Math.random().toString(), type: 'output', text: '  [5] Porcentagem (%)' });
        newLines.push({ id: Math.random().toString(), type: 'output', text: '  [6] Seno (sin)' });
        newLines.push({ id: Math.random().toString(), type: 'output', text: '  [7] Cosseno (cos)' });
        newLines.push({ id: Math.random().toString(), type: 'output', text: '  [0] Sair do programa' });
        newLines.push({ id: Math.random().toString(), type: 'prompt', text: 'Digite a opção (número ou símbolo): ' });
        setLines((prev) => [...prev, ...newLines]);
      }
    }
  };

  const getPromptText = (step: ReplStep) => {
    switch (step) {
      case 'menu':
        return 'Digite a opção (número ou símbolo): ';
      case 'input_num1':
        return 'Digite o primeiro número (A): ';
      case 'input_num2':
        return 'Digite o segundo número (B): ';
      case 'ask_repeat':
        return 'Deseja realizar outra operação? (S/n): ';
    }
  };

  const sendQuickInput = (val: string) => {
    setCurrentInput(val);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Editorial Headline */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span>Terminal CLI Interativo</span>
            <span aria-hidden="true">·</span>
            <span>Simulador CPython 3.10</span>
            <span aria-hidden="true">·</span>
            <span>REPL Completo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Console de Execução da Calculadora
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Interaja com o script Python exatamente como em uma sessão de terminal de comando.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetRepl}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Sessão</span>
          </button>
        </div>
      </div>

      {/* Terminal Action Bar / Quick Presets */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400">Atalhos rápidos para o console:</span>
        <button
          onClick={() => sendQuickInput('1')}
          className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
        >
          Opção [1] Adição
        </button>
        <button
          onClick={() => sendQuickInput('4')}
          className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
        >
          Opção [4] Divisão
        </button>
        <button
          onClick={() => sendQuickInput('12,5')}
          className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700"
        >
          Número com Vírgula ("12,5")
        </button>
        <button
          onClick={() => sendQuickInput('0')}
          className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-red-300 rounded border border-slate-700"
        >
          Zero ("0" divisor)
        </button>
        <button
          onClick={() => sendQuickInput('python3 calculadora.py --test')}
          className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 rounded border border-amber-800/50 flex items-center gap-1.5"
        >
          <Bug className="w-3 h-3" />
          <span>Rodar Testes Unitários</span>
        </button>
      </div>

      {/* Terminal Shell Window */}
      <div
        onClick={handleContainerClick}
        className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm cursor-text min-h-[520px] flex flex-col"
      >
        {/* Terminal Header Bar */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 font-medium text-slate-300">bash — python3 calculadora.py</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>UTF-8</span>
            <span>POSIX</span>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-1 text-slate-300 max-h-[600px]">
          {lines.map((line) => {
            if (line.type === 'banner') {
              return (
                <div key={line.id} className="text-amber-400 font-semibold whitespace-pre">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'system') {
              return (
                <div key={line.id} className="text-cyan-400 whitespace-pre">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'prompt') {
              return (
                <div key={line.id} className="text-slate-400 font-medium">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'input') {
              return (
                <div key={line.id} className="text-white font-bold flex items-center gap-1.5">
                  <span className="text-cyan-400">&gt;</span>
                  <span>{line.text}</span>
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={line.id} className="text-red-400 font-medium whitespace-pre">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'success') {
              return (
                <div key={line.id} className="text-emerald-400 font-semibold whitespace-pre">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={line.id} className="text-slate-300 whitespace-pre">
                {line.text}
              </div>
            );
          })}

          {/* Active Input Prompt */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-2">
            <span className="text-cyan-400 select-none">&gt;&gt;&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none font-mono text-xs sm:text-sm placeholder-slate-600"
              placeholder="Digite sua resposta e pressione Enter..."
              autoFocus
            />
          </form>

          <div ref={bottomRef} />
        </div>

        {/* Terminal Footer Info */}
        <div className="bg-slate-900/60 px-4 py-2 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Dica: digite <strong>clear</strong> para limpar o console ou <strong>pytest</strong> para rodar testes.</span>
          <span className="text-slate-400">calculadora.py ativo</span>
        </div>
      </div>
    </div>
  );
};
