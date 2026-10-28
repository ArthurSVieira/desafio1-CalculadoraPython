# 🧮 PyCalc Studio — Calculadora Python & Análise de Arquitetura

![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

Projeto desenvolvido durante a **Imersão IA da Alura (Desafio 1)**. O **PyCalc Studio** combina um módulo de **Calculadora Básica em Python** (`calculadora.py`), construído com foco em boas práticas de Engenharia de Software, com uma **Aplicação Web Interativa** em React + TypeScript que simula a execução do motor Python, inspeciona o estado interno, oferece um terminal REPL interativo e apresenta a análise arquitetural completa do código.

---

## ✨ Funcionalidades Principais

### 🐍 Script Python (`calculadora.py`)
- **Núcleo Matemático com Funções Puras (SRP):** Implementação desacoplada das quatro operações fundamentais (`somar`, `subtrair`, `multiplicar`, `dividir`) sem efeitos colaterais de I/O.
- **Roteamento Declarativo (Dispatch Table):** Uso de dicionário tipado (`TABELA_OPERACOES`) mapeando opções numéricas (`1` a `4`) e símbolos matemáticos (`+`, `-`, `*`, `x`, `/`) diretamente para as funções em tempo constante $O(1)$.
- **Sanitização e Validação Defensiva de Entrada:**
  - Suporte nativo ao padrão decimal brasileiro (conversão automática de `,` para `.`).
  - Limpeza de espaços extras (`.strip()`).
  - Bloqueio de valores não finitos (`NaN`, `inf`, `-inf`).
  - Tratamento de exceções (`ValueError`, `ZeroDivisionError`, `OverflowError`, `KeyboardInterrupt`).
- **Formatação Inteligente de Saída:** Remoção automática de casas decimais redundantes em números inteiros (ex.: `5.0` → `5`) e mitigação de imprecisões de ponto flutuante IEEE 754 (ex.: `0.1 + 0.2` → `0.3`).
- **Suíte de Testes Unitários Embutida:** Execução rápida de testes automatizados via flag `--test`.

### 💻 Aplicação Web Interativa (PyCalc Studio)
1. **Calculadora Visual:** Interface gráfica moderna com inspeção em tempo real do trace de execução Python (chamada da função, tipos dos operandos, despacho na `TABELA_OPERACOES` e tratamento de exceções).
2. **Terminal REPL Interativo:** Simulador fiel do terminal executando `$ python3 calculadora.py` passo a passo, incluindo suporte aos comandos `clear` e `python3 calculadora.py --test` / `pytest`.
3. **Análise de Código & Arquitetura:** Documentação interativa dividida em três pilares:
   - *Principais Componentes* (diagrama arquitetural em camadas).
   - *Entrada & Roteamento* (simulador ao vivo do pipeline de sanitização e casting).
   - *Lógica & Casos de Borda* (playground de casos extremos como divisão por zero e ruído binário IEEE 754).
4. **Código & Testes:** Visualizador do código-fonte completo com opção de cópia, download direto do arquivo `calculadora.py` e executor visual da suíte de 12 testes unitários com medição de tempo.

---

## 🗂️ Estrutura do Projeto

```text
desafio1-CalculadoraPython/
├── calculadora.py                 # Script Python standalone (CLI + Testes Unitários)
├── index.html                     # Entrada HTML da aplicação web
├── package.json                   # Dependências e scripts NPM
├── tsconfig.json                  # Configuração do TypeScript
├── vite.config.ts                 # Configuração do bundler Vite
├── metadata.json                  # Metadados do aplicativo
└── src/
    ├── main.tsx                   # Ponto de entrada do React
    ├── App.tsx                    # Componente raiz e gerenciamento de abas
    ├── index.css                  # Estilos globais e configuração Tailwind CSS
    ├── types/
    │   └── calculator.ts          # Contratos e tipagens TypeScript
    ├── services/
    │   └── pythonEngine.ts        # Motor de simulação fiel da lógica Python no browser
    └── components/
        ├── TopBar.tsx             # Cabeçalho de navegação e download do script
        ├── VisualCalculator.tsx   # Aba 1: Calculadora Visual + Inspetor de Estado
        ├── TerminalRepl.tsx       # Aba 2: Simulador de Terminal REPL
        ├── ArchitectureAnalysis.tsx # Aba 3: Análise Arquitetural e Simulador de Casting
        └── CodeAndTests.tsx       # Aba 4: Visualizador de Código e Runner de Testes
```

---

## 🚀 Como Executar o Projeto

### Opção 1: Executando o Script Python Diretamente no Terminal

Pré-requisito: **Python 3.10+** instalado (utiliza apenas bibliotecas padrão da linguagem).

1. **Modo Interativo (REPL no terminal):**
   ```bash
   python3 calculadora.py
   ```

2. **Executar a Suíte de Testes Unitários:**
   ```bash
   python3 calculadora.py --test
   ```

---

### Opção 2: Executando a Interface Web (PyCalc Studio)

Pré-requisito: **Node.js 18+** e **npm** instalados.

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse no navegador:**
   Abra `http://localhost:3000` para utilizar a calculadora visual, o simulador REPL e explorar a análise de arquitetura.

4. **Scripts adicionais disponíveis:**
   - `npm run build` — Gera a versão otimizada para produção na pasta `dist/`.
   - `npm run preview` — Visualiza localmente o build de produção.
   - `npm run lint` — Verifica a tipagem estática com TypeScript (`tsc --noEmit`).

---

## 🏗️ Decisões de Arquitetura (Destaques)

| Camada | Responsabilidade | Benefício Técnico |
| :--- | :--- | :--- |
| **1. Núcleo Matemático** | Funções puras (`somar`, `subtrair`, `multiplicar`, `dividir`) | Facilidade de testes unitários sem necessidade de *mocks* de `input`/`print`. |
| **2. Dispatch Table** | Dicionário `TABELA_OPERACOES` | Elimina cadeias extensas de `if/elif/else` e facilita a adição de novas operações (OCP). |
| **3. Sanitização & I/O** | `capturar_numero()` e `capturar_operacao()` | Isola a interação com o usuário e garante que o núcleo receba apenas `float` válidos e finitos. |
| **4. Formatação** | `formatar_numero()` | Corrige artefatos visuais do padrão IEEE 754 e melhora a experiência do usuário na exibição. |
| **5. Controle REPL** | `executar_ciclo_calculadora()` e `main()` | Gerencia o ciclo de vida da aplicação e captura interrupções de sistema de forma graciosa. |

---

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais durante a **Imersão IA da Alura**. Sinta-se à vontade para estudar, modificar e reutilizar o código!
