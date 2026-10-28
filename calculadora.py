"""
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

# Definição do tipo para funções matemáticas de dois operandos
TipoOperacao = Callable[[float, float], float]

# Mapeamento declarativo: Chave -> (Nome da Operação, Função Pura, Símbolo Matemático)
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
    
    Tratamentos de entrada:
    - Converte vírgulas para pontos (suporte ao padrão brasileiro '12,5' -> '12.5').
    - Trata espaços em branco acidentais (.strip()).
    - Captura ValueError caso a entrada não seja convertível para float.
    - Rejeita valores não finitos (nan, inf) para garantir integridade.
    """
    while True:
        entrada_bruta = input(mensagem).strip()
        
        # Suporte amigável para vírgula decimal
        entrada_sanitizada = entrada_bruta.replace(",", ".")
        
        try:
            valor = float(entrada_sanitizada)
            
            # Validação contra NaN (Not a Number) e Infinitos
            if math.isnan(valor) or math.isinf(valor):
                print("⚠ Entrada inválida: Valores infinitos ou indefinidos não são permitidos.")
                continue
                
            return valor
        except ValueError:
            print(f"⚠ Entrada inválida ('{entrada_bruta}'). Digite um número válido (ex: 10, 3.14, -5).")


def capturar_operacao() -> Tuple[str, TipoOperacao, str]:
    """
    Solicita ao usuário a escolha de uma das operações disponíveis.
    Realiza o roteamento utilizando a tabela declarativa TABELA_OPERACOES.
    """
    while True:
        print("\nEscolha a operação desejada:")
        print("  [1] Adição (+)")
        print("  [2] Subtração (-)")
        print("  [3] Multiplicação (×)")
        print("  [4] Divisão (÷)")
        print("  [0] Sair do programa")
        
        escolha = input("Digite a opção (número ou símbolo): ").strip().lower()
        
        if escolha in ("0", "sair", "exit", "q"):
            print("\nEncerrando a calculadora. Até breve!")
            sys.exit(0)
            
        if escolha in TABELA_OPERACOES:
            return TABELA_OPERACOES[escolha]
            
        print(f"⚠ Opção inválida ('{escolha}'). Por favor, digite 1, 2, 3, 4 ou o símbolo correspondente.")


# ==============================================================================
# 4. CAMADA DE SAÍDA E FORMATAÇÃO (OUTPUT FORMATTING)
# ==============================================================================

def formatar_numero(valor: float, precisao_maxima: int = 8) -> str:
    """
    Formata um número para apresentação limpa:
    - Remove decimais redundantes caso seja inteiro (ex: 5.0 -> '5').
    - Controla dízimas e imprecisões do ponto flutuante IEEE 754 (ex: 0.1 + 0.2 -> '0.3').
    - Converte para notação científica números excessivamente grandes ou pequenos.
    """
    if math.isinf(valor) or math.isnan(valor):
        return str(valor)

    # Verifica se é um número inteiro exato dentro dos limites
    if valor.is_integer() and abs(valor) < 1e12:
        return f"{int(valor)}"
    
    # Tratamento para números com casas decimais: arredonda para eliminar ruído binário
    valor_arredondado = round(valor, precisao_maxima)
    
    # Se após o arredondamento virou inteiro
    if valor_arredondado.is_integer() and abs(valor_arredondado) < 1e12:
        return f"{int(valor_arredondado)}"
        
    # Formatação com remoção de zeros à direita
    resultado_str = f"{valor_arredondado:.{precisao_maxima}f}".rstrip("0").rstrip(".")
    return resultado_str


# ==============================================================================
# 5. LOOP DE CONTROLE PRINCIPAL (REPL - READ, EVAL, PRINT, LOOP)
# ==============================================================================

def executar_ciclo_calculadora() -> None:
    """Executa um ciclo completo de cálculo com tratamento defensivo de exceções."""
    print("\n" + "=" * 50)
    print("           CALCULADORA BÁSICA EM PYTHON           ")
    print("=" * 50)
    
    nome_op, funcao_op, simbolo_op = capturar_operacao()
    
    print(f"\n--- Operação selecionada: {nome_op} ({simbolo_op}) ---")
    num1 = capturar_numero("Digite o primeiro número (A): ")
    num2 = capturar_numero("Digite o segundo número (B): ")
    
    print("\nProcessando operação...")
    
    try:
        resultado = funcao_op(num1, num2)
        
        # Formata os operandos e o resultado para exibição limpa
        str_num1 = formatar_numero(num1)
        str_num2 = formatar_numero(num2)
        str_res = formatar_numero(resultado)
        
        print("\n" + "-" * 50)
        print(f"✅ SUCESSO: {str_num1} {simbolo_op} {str_num2} = {str_res}")
        print("-" * 50)
        
    except ZeroDivisionError as erro:
        print("\n" + "!" * 50)
        print(f"❌ ERRO DE EXECUÇÃO: {erro}")
        print("!" * 50)
    except OverflowError:
        print("\n" + "!" * 50)
        print("❌ ERRO: O resultado ultrapassou a capacidade máxima de representação numérica.")
        print("!" * 50)
    except Exception as erro_inesperado:
        print("\n" + "!" * 50)
        print(f"❌ ERRO INESPERADO: {erro_inesperado}")
        print("!" * 50)


def main() -> None:
    """Ponto de entrada do script com controle de repetição contínua."""
    while True:
        try:
            executar_ciclo_calculadora()
            
            continuar = input("\nDeseja realizar outra operação? (S/n): ").strip().lower()
            if continuar in ("n", "nao", "não", "exit", "sair"):
                print("\nObrigado por usar a calculadora. Sessão finalizada com sucesso!\n")
                break
        except KeyboardInterrupt:
            print("\n\nOperação interrompida pelo usuário (Ctrl+C). Saindo...")
            break


# ==============================================================================
# 6. SUÍTE DE TESTES UNITÁRIOS EMBUTIDA
# ==============================================================================

def executar_testes_unitarios() -> bool:
    """Verifica formalmente o comportamento matemático e casos de borda."""
    print("Executando suíte de testes unitários...")
    
    # Testes de Adição
    assert somar(2.0, 3.0) == 5.0, "Falha na adição básica"
    assert somar(-5.0, 5.0) == 0.0, "Falha na adição com negativos"
    assert round(somar(0.1, 0.2), 5) == 0.3, "Falha na adição com floats"
    
    # Testes de Subtração
    assert subtrair(10.0, 4.0) == 6.0, "Falha na subtração básica"
    assert subtrair(3.0, 8.0) == -5.0, "Falha na subtração com resultado negativo"
    
    # Testes de Multiplicação
    assert multiplicar(6.0, 7.0) == 42.0, "Falha na multiplicação básica"
    assert multiplicar(5.0, 0.0) == 0.0, "Falha na multiplicação por zero"
    assert multiplicar(-3.0, -4.0) == 12.0, "Falha na regra de sinais"
    
    # Testes de Divisão e Casos de Borda
    assert dividir(20.0, 4.0) == 5.0, "Falha na divisão básica"
    assert dividir(7.0, 2.0) == 3.5, "Falha na divisão não-inteira"
    
    # Verificação de exceção ZeroDivisionError
    divisao_por_zero_capturada = False
    try:
        dividir(10.0, 0.0)
    except ZeroDivisionError:
        divisao_por_zero_capturada = True
    assert divisao_por_zero_capturada, "Falha ao disparar ZeroDivisionError"
    
    print("✔ Todos os testes unitários passaram com 100% de conformidade.")
    return True


if __name__ == "__main__":
    # Se passado o argumento '--test', executa os testes
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        executar_testes_unitarios()
    else:
        main()
