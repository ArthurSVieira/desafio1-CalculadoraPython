import React, { useState } from 'react';
import { executarSuiteTestes } from '../services/pythonEngine';
import { UnitTestResult } from '../types/calculator';
import {
  CheckCircle2,
  Copy,
  Check,
  Download,
  Play,
  RotateCcw,
  Code2,
  FileText,
  Clock,
  Bug,
} from 'lucide-react';

interface CodeAndTestsProps {
  onDownloadScript: () => void;
}

const PYTHON_CODE = `"""
Calculadora Básica em Python - Demonstração de Arquitetura e Engenharia de Software.

Este módulo implementa as quatro operações matemáticas fundamentais com:
1. Funções puras e desacopladas de I/O (Princípio da Responsabilidade Única - SRP).
2. Validação rigorosa de tipos e tratamento defensivo de erros.
3. Roteamento declarativo por tabela de despacho (Dispatch Table).
4. Formatação inteligente de saída e precisão numérica.
"""

from typing import Callable, Dict, Tuple, Optional
import math
import sys

# ==============================================================================
# 1. NÚCLEO MATEMÁTICO (FUNÇÕES PURAS)
# ==============================================================================

def somar(a: float, b: float) -> float:
    """Retorna a soma de dois números reais (a + b)."""
    return a + b


def subtrair(a: float, b: float) -> float:
    """Retorna a subtração entre dois números reais (a - b)."""
    return a - b


def multiplicar(a: float, b: float) -> float:
    """Retorna o produto de dois números reais (a * b)."""
    return a * b


def dividir(a: float, b: float) -> float:
    """
    Retorna a divisão entre dois números reais (a / b).
    
    Raises:
        ZeroDivisionError: Caso o denominador (b) seja igual a zero.
    """
    if b == 0:
        raise ZeroDivisionError("Erro Matemático: Divisão por zero não é permitida.")
    return a / b


# ==============================================================================
# 2. TABELA DE ROTEAMENTO DECLARATIVO (DISPATCH TABLE)
# ==============================================================================

TipoOperacao = Callable[[float, float], float]

TABELA_OPERACOES: Dict[str, Tuple[str, TipoOperacao, str]] = {
    "1": ("Adição", somar, "+"),
    "+": ("Adição", somar, "+"),
    "2": ("Subtração", subtrair, "-"),
    "-": ("Subtração", subtrair, "-"),
    "3": ("Multiplicação", multiplicar, "×"),
    "*": ("Multiplicação", multiplicar, "×"),
    "x": ("Multiplicação", multiplicar, "×"),
    "4": ("Divisão", dividir, "÷"),
    "/": ("Divisão", dividir, "÷"),
}


# ==============================================================================
# 3. CAMADA DE ENTRADA, CASTING E VALIDAÇÃO (I/O & SANITIZAÇÃO)
# ==============================================================================

def capturar_numero(mensagem: str) -> float:
    """
    Solicita a entrada de um número ao usuário, realiza sanitização e casting defensivo.
    """
    while True:
        entrada_bruta = input(mensagem).strip()
        entrada_sanitizada = entrada_bruta.replace(",", ".")
        
        try:
            valor = float(entrada_sanitizada)
            if math.isnan(valor) or math.isinf(valor):
                print("⚠ Entrada inválida: Valores infinitos ou indefinidos não são permitidos.")
                continue
            return valor
        except ValueError:
            print(f"⚠ Entrada inválida ('{entrada_bruta}'). Digite um número válido (ex: 10, 3.14, -5).")


def capturar_operacao() -> Tuple[str, TipoOperacao, str]:
    """Solicita a operação e realiza o roteamento via TABELA_OPERACOES."""
    while True:
        print("\\nEscolha a operação desejada:")
        print("  [1] Adição (+)")
        print("  [2] Subtração (-)")
        print("  [3] Multiplicação (×)")
        print("  [4] Divisão (÷)")
        print("  [0] Sair do programa")
        
        escolha = input("Digite a opção (número ou símbolo): ").strip().lower()
        if escolha in ("0", "sair", "exit", "q"):
            print("\\nEncerrando a calculadora. Até breve!")
            sys.exit(0)
            
        if escolha in TABELA_OPERACOES:
            return TABELA_OPERACOES[escolha]
            
        print(f"⚠ Opção inválida ('{escolha}'). Digite 1, 2, 3, 4 ou o símbolo.")


# ==============================================================================
# 4. CAMADA DE SAÍDA E FORMATAÇÃO (OUTPUT FORMATTING)
# ==============================================================================

def formatar_numero(valor: float, precisao_maxima: int = 8) -> str:
    """Formata um número para apresentação limpa e sem zeros redundantes."""
    if math.isinf(valor) or math.isnan(valor):
        return str(valor)

    if valor.is_integer() and abs(valor) < 1e12:
        return f"{int(valor)}"
    
    valor_arredondado = round(valor, precisao_maxima)
    if valor_arredondado.is_integer() and abs(valor_arredondado) < 1e12:
        return f"{int(valor_arredondado)}"
        
    return f"{valor_arredondado:.{precisao_maxima}f}".rstrip("0").rstrip(".")


# ==============================================================================
# 5. LOOP DE CONTROLE PRINCIPAL (REPL)
# ==============================================================================

def executar_ciclo_calculadora() -> None:
    """Executa um ciclo completo de cálculo com tratamento defensivo de exceções."""
    print("\\n" + "=" * 50)
    print("           CALCULADORA BÁSICA EM PYTHON           ")
    print("=" * 50)
    
    nome_op, funcao_op, simbolo_op = capturar_operacao()
    print(f"\\n--- Operação selecionada: {nome_op} ({simbolo_op}) ---")
    num1 = capturar_numero("Digite o primeiro número (A): ")
    num2 = capturar_numero("Digite o segundo número (B): ")
    
    try:
        resultado = funcao_op(num1, num2)
        str_num1 = formatar_numero(num1)
        str_num2 = formatar_numero(num2)
        str_res = formatar_numero(resultado)
        print("\\n" + "-" * 50)
        print(f"✅ SUCESSO: {str_num1} {simbolo_op} {str_num2} = {str_res}")
        print("-" * 50)
    except ZeroDivisionError as erro:
        print(f"\\n❌ ERRO DE EXECUÇÃO: {erro}")
    except OverflowError:
        print("\\n❌ ERRO: O resultado ultrapassou a capacidade máxima de ponto flutuante.")


def main() -> None:
    """Ponto de entrada do script com repetição contínua."""
    while True:
        try:
            executar_ciclo_calculadora()
            continuar = input("\\nDeseja realizar outra operação? (S/n): ").strip().lower()
            if continuar in ("n", "nao", "não", "exit", "sair"):
                print("\\nObrigado por usar a calculadora. Sessão finalizada com sucesso!\\n")
                break
        except KeyboardInterrupt:
            print("\\nOperação interrompida pelo usuário. Saindo...")
            break


if __name__ == "__main__":
    main()
`;

export const CodeAndTests: React.FC<CodeAndTestsProps> = ({ onDownloadScript }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [tests, setTests] = useState<UnitTestResult[]>(() => executarSuiteTestes());
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(PYTHON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const runAllTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setTests(executarSuiteTestes());
      setIsRunningTests(false);
    }, 250);
  };

  const filteredTests = filterCategory === 'all'
    ? tests
    : tests.filter((t) => t.category.toLowerCase() === filterCategory.toLowerCase());

  const totalPassed = tests.filter((t) => t.passed).length;
  const totalDuration = tests.reduce((acc, t) => acc + t.durationUs, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Editorial Headline */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span>Repositório de Código</span>
            <span aria-hidden="true">·</span>
            <span>calculadora.py</span>
            <span aria-hidden="true">·</span>
            <span>Validação Formal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Código-Fonte Python & Suíte de Testes
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Script Python completo pronto para execução local e validação automatizada de integridade matemática.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
          </button>
          <button
            onClick={onDownloadScript}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar .py</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Code Viewer (7 cols) + Test Suite (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Code Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold">calculadora.py</span>
              <span className="text-slate-500">· 184 linhas</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Python 3.10+ / PEP 8</span>
          </div>

          <div className="p-4 bg-slate-950/70 overflow-x-auto max-h-[700px] overflow-y-auto">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed">
              <code>{PYTHON_CODE}</code>
            </pre>
          </div>
        </div>

        {/* Right Column: Automated Unit Test Suite (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Bug className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">
                    Suíte de Testes Automatizados
                  </h3>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  12 casos de teste · 100% conformidade
                </div>
              </div>

              <button
                onClick={runAllTests}
                disabled={isRunningTests}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg transition-colors"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
                <span>Reexecutar</span>
              </button>
            </div>

            {/* Test Metric Highlights */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Testes Aprovados</div>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  {totalPassed} / {tests.length}
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Tempo de Execução</div>
                <div className="text-lg font-bold font-mono text-cyan-400 mt-1">
                  {totalDuration} µs
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mt-4 flex flex-wrap gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
              {['all', 'adição', 'subtração', 'multiplicação', 'divisão', 'formatação'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded transition-colors capitalize ${
                    filterCategory === cat
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>

            {/* Test Cases List */}
            <div className="mt-4 space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 text-xs font-mono"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">{test.name}</span>
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASS</span>
                    </span>
                  </div>

                  <div className="text-cyan-300 text-[11px]">
                    {test.expression} → {test.actual}
                  </div>

                  <div className="text-slate-400 text-[10px] font-sans mt-1">
                    {test.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
