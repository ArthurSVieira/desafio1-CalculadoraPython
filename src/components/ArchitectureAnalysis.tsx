import React, { useState } from 'react';
import {
  simularCastingEntrada,
  executarOperacaoPython,
  formatarNumeroPython,
  OPERACOES,
} from '../services/pythonEngine';
import {
  Boxes,
  Compass,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertOctagon,
  FileCode,
  Terminal,
  Cpu,
} from 'lucide-react';

export const ArchitectureAnalysis: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'componentes' | 'entrada' | 'saida'>('componentes');

  // Estado para o simulador interativo de casting
  const [testInputString, setTestInputString] = useState<string>('  12,50  ');
  const castingSteps = simularCastingEntrada(testInputString);

  // Estado para o playground de casos de borda
  const [selectedEdgeCase, setSelectedEdgeCase] = useState<string>('div_zero');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Editorial Headline */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <span>Engenharia de Software & Python</span>
          <span aria-hidden="true">·</span>
          <span>Análise Técnica Detalhada</span>
          <span aria-hidden="true">·</span>
          <span>Boas Práticas de Arquitetura</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Análise de Arquitetura & Engenharia de Código
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl">
          Exploração aprofundada dos três pilares solicitados: mapeamento de componentes modulares,
          pipeline de captura e roteamento, e isolamento de lógica com tratamento defensivo de casos de borda.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-xl border border-slate-800 mb-8 max-w-2xl">
        <button
          onClick={() => setActiveSection('componentes')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeSection === 'componentes'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>1. Principais Componentes</span>
        </button>

        <button
          onClick={() => setActiveSection('entrada')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeSection === 'entrada'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>2. Entrada & Roteamento</span>
        </button>

        <button
          onClick={() => setActiveSection('saida')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeSection === 'saida'
              ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>3. Lógica & Casos de Borda</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SEÇÃO 1: PRINCIPAIS COMPONENTES */}
      {/* ===================================================================== */}
      {activeSection === 'componentes' && (
        <div className="space-y-8">
          {/* Architectural Diagram Banner */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center text-xs font-bold">
                01
              </span>
              <span>Mapeamento da Arquitetura do Script Python</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6 max-w-3xl">
              A arquitetura foi estruturada em 4 camadas desacopladas seguindo os princípios de
              <strong> Alta Coesão</strong> e <strong>Baixo Acoplamento</strong> (SOLID / SRP).
            </p>

            {/* Architecture Block Flowchart */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Layer 1 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">Camada 1</div>
                  <h3 className="text-sm font-semibold text-cyan-300 mb-2">Núcleo Matemático</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Funções puras <code className="text-amber-300">somar</code>, <code className="text-amber-300">subtrair</code>, <code className="text-amber-300">multiplicar</code>, <code className="text-amber-300">dividir</code>.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                  Pure Functions (Sem I/O)
                </div>
              </div>

              {/* Layer 2 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">Camada 2</div>
                  <h3 className="text-sm font-semibold text-amber-300 mb-2">Tabela de Despacho</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mapeamento declarativo <code className="text-amber-300">TABELA_OPERACOES</code> associando símbolos aos ponteiros de função em tempo O(1).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                  Dispatch Table (Open/Closed)
                </div>
              </div>

              {/* Layer 3 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">Camada 3</div>
                  <h3 className="text-sm font-semibold text-emerald-300 mb-2">Sanitização & Casting</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Captura com <code className="text-amber-300">input()</code>, limpeza de espaços, normalização de vírgula decimal e validação defensiva com <code className="text-amber-300">try/except</code>.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                  I/O Defensivo & Type Casting
                </div>
              </div>

              {/* Layer 4 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1">Camada 4</div>
                  <h3 className="text-sm font-semibold text-purple-300 mb-2">Loop de Controle</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Orquestração do ciclo REPL, captura de <code className="text-amber-300">ZeroDivisionError</code>, formatação e ponto de entrada <code className="text-amber-300">main()</code>.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                  REPL Lifecycle Orchestrator
                </div>
              </div>
            </div>
          </div>

          {/* Deep Breakdown: Funções, Variáveis de Estado e Blocos de Controle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Funções Puras */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">1.1 Funções Matemáticas Puras</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Cada operação básica é representada por uma função pura, isto é, uma função
                <strong> determinística</strong> e <strong>livre de efeitos colaterais</strong> (side effects):
              </p>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div><span className="text-purple-400">def</span> <span className="text-cyan-300">somar</span>(a: <span className="text-emerald-400">float</span>, b: <span className="text-emerald-400">float</span>) -&gt; <span className="text-emerald-400">float</span>:</div>
                <div className="pl-4 text-slate-400"><span className="text-purple-400">return</span> a + b</div>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Determinismo:</strong> Para as mesmas entradas <code className="text-slate-300">(a, b)</code>, o retorno será invariavelmente idêntico.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Testabilidade:</strong> Podem ser testadas com facilidade por <code className="text-slate-300">pytest</code> ou <code className="text-slate-300">unittest</code> sem necessidade de mocks de terminal.</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Variáveis de Estado */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">1.2 Variáveis de Estado & Escopo</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                O gerenciamento de estado no script adota isolamento de escopo para evitar variáveis globais mutáveis:
              </p>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div><span className="text-slate-500"># Escopo local por iteração:</span></div>
                <div>nome_op, funcao, simbolo = capturar_operacao()</div>
                <div>num1: <span className="text-emerald-400">float</span> = capturar_numero(...)</div>
                <div>num2: <span className="text-emerald-400">float</span> = capturar_numero(...)</div>
                <div>resultado: <span className="text-emerald-400">float</span> = funcao(num1, num2)</div>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Sem Estado Residual:</strong> Ao final de cada ciclo, os valores são descartados ou reinicializados na pilha de chamada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Thread-Safety:</strong> Por não manter estado global compartilhado, múltiplas instâncias da calculadora podem rodar em paralelo.</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Blocos de Controle */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">1.3 Blocos de Controle & Ciclo</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                A aplicação utiliza três estruturas de controle fundamentais:
              </p>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div><span className="text-purple-400">while</span> <span className="text-cyan-300">True</span>: <span className="text-slate-500"># Loop REPL infinito</span></div>
                <div className="pl-3"><span className="text-purple-400">try</span>:</div>
                <div className="pl-6">executar_ciclo_calculadora()</div>
                <div className="pl-3"><span className="text-purple-400">except</span> <span className="text-red-300">KeyboardInterrupt</span>:</div>
                <div className="pl-6"><span className="text-purple-400">break</span></div>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Guarda de Módulo:</strong> <code className="text-slate-300">if __name__ == '__main__':</code> garante que o script possa ser importado como biblioteca sem disparar o loop.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Graceful Shutdown:</strong> Captura de <code className="text-slate-300">KeyboardInterrupt (Ctrl+C)</code> encerra limpo sem stack trace cru.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SEÇÃO 2: ENTRADA E ROTEAMENTO */}
      {/* ===================================================================== */}
      {activeSection === 'entrada' && (
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center text-xs font-bold">
                02
              </span>
              <span>Fluxo de Captura, Sanitização e Roteamento de Operações</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6 max-w-3xl">
              Entenda como a entrada de dados do usuário via console é tratada defensivamente,
              e como a operação selecionada é mapeada para o código executável.
            </p>

            {/* Step-by-Step Flow Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Routing Explanation */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">
                  Tabela de Despacho (Dispatch Table) vs. Condicionais
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Em vez de encadear múltiplos <code className="text-amber-300">if/elif/else</code> propensos a erro, o projeto adota o padrão de <strong>Tabela de Despacho (Dispatch Table)</strong> através de um dicionário:
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                  <div><span className="text-purple-400">TABELA_OPERACOES</span>: Dict[str, Tuple] = &#123;</div>
                  <div className="pl-4"><span className="text-emerald-300">"1"</span>: (<span className="text-amber-300">"Adição"</span>, somar, <span className="text-cyan-300">"+"</span>),</div>
                  <div className="pl-4"><span className="text-emerald-300">"+"</span>: (<span className="text-amber-300">"Adição"</span>, somar, <span className="text-cyan-300">"+"</span>),</div>
                  <div className="pl-4"><span className="text-emerald-300">"2"</span>: (<span className="text-amber-300">"Subtração"</span>, subtrair, <span className="text-cyan-300">"-"</span>),</div>
                  <div className="pl-4"><span className="text-emerald-300">"3"</span>: (<span className="text-amber-300">"Multiplicação"</span>, multiplicar, <span className="text-cyan-300">"×"</span>),</div>
                  <div className="pl-4"><span className="text-emerald-300">"4"</span>: (<span className="text-amber-300">"Divisão"</span>, dividir, <span className="text-cyan-300">"÷"</span>),</div>
                  <div>&#125;</div>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="font-semibold text-slate-200">Vantagens Arquiteturais:</div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Complexidade O(1):</strong> A busca da função é instantânea por tabela hash.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Princípio Aberto/Fechado (OCP):</strong> Para adicionar exponenciação ou módulo, basta adicionar 1 linha no dicionário, sem modificar os loops ou lógica de roteamento.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Múltiplos Aliases:</strong> O usuário pode digitar tanto <code className="text-slate-300">"1"</code> quanto <code className="text-slate-300">"+"</code> para invocar adição.</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Casting Simulator */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">
                      Simulador Interativo de Casting de Entrada
                    </h3>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">Live Pipeline</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Digite qualquer texto abaixo para ver como a função <code className="text-amber-300">capturar_numero()</code> higieniza, converte e valida:
                  </p>

                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={testInputString}
                      onChange={(e) => setTestInputString(e.target.value)}
                      placeholder="Ex: 12,5 ou -42 ou texto..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={() => setTestInputString('  12,50  ')}
                      className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                    >
                      Vírgula
                    </button>
                    <button
                      onClick={() => setTestInputString('abc')}
                      className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-red-300 rounded border border-slate-700"
                    >
                      Inválido
                    </button>
                  </div>

                  {/* Steps output */}
                  <div className="space-y-2">
                    {castingSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border text-xs font-mono ${
                          step.status === 'error'
                            ? 'bg-red-950/40 border-red-800/60 text-red-300'
                            : step.status === 'success'
                            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                            : 'bg-slate-900/90 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                          <span>{step.stage}</span>
                          <span className="text-[10px] uppercase">{step.status}</span>
                        </div>
                        <div className="text-[11px] text-slate-200">
                          Saída: <span className="font-bold">{step.output}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-sans">
                          {step.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SEÇÃO 3: LÓGICA E SAÍDA (CASOS DE BORDA) */}
      {/* ===================================================================== */}
      {activeSection === 'saida' && (
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center text-xs font-bold">
                03
              </span>
              <span>Isolamento da Lógica Matemática, Casos de Borda e Formatação</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6 max-w-3xl">
              Análise do tratamento de exceções fundamentais em Python, por que o cálculo
              é 100% isolado de formatação, e como a saída é lapidada para o usuário final.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Col 1: Isolamento Matemático */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-semibold text-cyan-300">
                  Por que isolar a matemática de print() e input()?
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Misturar operações matemáticas com <code className="text-amber-300">print()</code> dentro da mesma função é um dos maiores anti-padrões de programação.
                </p>
                <div className="p-3 bg-red-950/30 rounded border border-red-900/50 text-[11px] text-red-300 font-mono">
                  ❌ Anti-padrão (Acoplado):<br />
                  def somar(a, b):<br />
                  &nbsp;&nbsp;print(f"Resultado: &#123;a + b&#125;") # Impede testes automatizados!
                </div>
                <div className="p-3 bg-emerald-950/30 rounded border border-emerald-900/50 text-[11px] text-emerald-300 font-mono">
                  ✔ Padrão Correto (Puro & Reutilizável):<br />
                  def somar(a: float, b: float) -&gt; float:<br />
                  &nbsp;&nbsp;return a + b # 100% testável, exportável para API ou GUI!
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ao retornar o valor puro, o mesmo código de cálculo pode ser usado em uma CLI de terminal, em uma API FastAPI/Flask, ou em uma interface web interativa.
                </p>
              </div>

              {/* Col 2: Casos de Borda Críticos */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-semibold text-amber-300">
                  Tratamento de Casos de Borda em Python
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-semibold text-slate-200 block mb-1">
                      1. Divisão por Zero (ZeroDivisionError)
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      A função <code className="text-amber-300">dividir()</code> valida <code className="text-amber-300">if b == 0: raise ZeroDivisionError(...)</code> explicitamente. O chamador captura a exceção no bloco <code className="text-cyan-300">try/except</code>, impedindo crash fatal.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-semibold text-slate-200 block mb-1">
                      2. Imprecisão IEEE 754 (Ponto Flutuante)
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      No padrão IEEE 754 de 64 bits, <code className="text-slate-300">0.1 + 0.2 = 0.30000000000000004</code> devido à representação em base 2 binária. A função <code className="text-amber-300">formatar_numero()</code> aplica <code className="text-slate-300">round(valor, 8)</code> e <code className="text-slate-300">rstrip('0')</code> para exibir <code className="text-emerald-300">0.3</code> limpo.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-semibold text-slate-200 block mb-1">
                      3. Números Grandes e Overflow
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      Floats em Python possuem limite de $1.79 \times 10^{308}$. Operações extremas disparam <code className="text-amber-300">OverflowError</code>, devidamente capturado pelo script.
                    </p>
                  </div>
                </div>
              </div>

              {/* Col 3: Formatação Inteligente de Saída */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-semibold text-emerald-300">
                  Formatação Inteligente de Saída
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A função <code className="text-amber-300">formatar_numero(valor: float)</code> garante polimento visual ao converter os dados para string:
                </p>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
                  <div className="text-slate-400"># Remoção de decimal redundante:</div>
                  <div>12.0 <span className="text-cyan-400">→</span> <span className="text-emerald-300">"12"</span> <span className="text-slate-500">(valor.is_integer())</span></div>
                  
                  <div className="text-slate-400 pt-2"># Controle de dízimas periódicas:</div>
                  <div>10 / 3 <span className="text-cyan-400">→</span> <span className="text-emerald-300">"3.33333333"</span></div>
                  
                  <div className="text-slate-400 pt-2"># Eliminação de ruído binário:</div>
                  <div>0.1 + 0.2 <span className="text-cyan-400">→</span> <span className="text-emerald-300">"0.3"</span> <span className="text-slate-500">(limpeza de zeros)</span></div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-[11px] text-slate-400">
                  Isso evita a poluição visual típica de scripts iniciantes que exibem respostas como <code className="text-slate-300">5.0 + 5.0 = 10.0</code> ao invés de <code className="text-emerald-300">5 + 5 = 10</code>.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
