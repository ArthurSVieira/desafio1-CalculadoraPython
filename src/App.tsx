import React, { useState } from 'react';
import { TopBar, ActiveTab } from './components/TopBar';
import { VisualCalculator } from './components/VisualCalculator';
import { TerminalRepl } from './components/TerminalRepl';
import { ArchitectureAnalysis } from './components/ArchitectureAnalysis';
import { CodeAndTests } from './components/CodeAndTests';

const PYTHON_FULL_SCRIPT = `"""
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
            
        print(f"⚠ Opção inválida ('{escolha}'). Digite 1, 2, 3, 4 ou o símbolo correspondente.")


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

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('visual');

  const handleDownloadScript = () => {
    const blob = new Blob([PYTHON_FULL_SCRIPT], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calculadora.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3-Zone Header Contract */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDownloadScript={handleDownloadScript}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'visual' && <VisualCalculator />}
        {activeTab === 'terminal' && <TerminalRepl />}
        {activeTab === 'architecture' && <ArchitectureAnalysis />}
        {activeTab === 'code' && <CodeAndTests onDownloadScript={handleDownloadScript} />}
      </main>

      {/* Footer following Anti-Slop Discipline */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>PyCalc Studio</span>
            <span aria-hidden="true">·</span>
            <span>Python 3.10 Engine</span>
            <span aria-hidden="true">·</span>
            <span>4 Operações Básicas</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Adição (+)</span>
            <span aria-hidden="true">·</span>
            <span>Subtração (−)</span>
            <span aria-hidden="true">·</span>
            <span>Multiplicação (×)</span>
            <span aria-hidden="true">·</span>
            <span>Divisão (÷)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
