import { OperationMeta, PythonExecutionTrace, UnitTestResult, CastingSimulationStep } from '../types/calculator';

// Definição das 4 operações básicas com metadados Python
export const OPERACOES: Record<string, OperationMeta> = {
  '1': {
    id: 'soma',
    key: '1',
    symbol: '+',
    mathSymbol: '+',
    name: 'Adição',
    pythonFunc: 'somar(a: float, b: float) -> float',
    docstring: 'Retorna a soma aritmética entre a e b: a + b.',
    formula: (a: number, b: number) => a + b,
  },
  '2': {
    id: 'subtracao',
    key: '2',
    symbol: '-',
    mathSymbol: '-',
    name: 'Subtração',
    pythonFunc: 'subtrair(a: float, b: float) -> float',
    docstring: 'Retorna a diferença entre a e b: a - b.',
    formula: (a: number, b: number) => a - b,
  },
  '3': {
    id: 'multiplicacao',
    key: '3',
    symbol: '*',
    mathSymbol: '×',
    name: 'Multiplicação',
    pythonFunc: 'multiplicar(a: float, b: float) -> float',
    docstring: 'Retorna o produto escalar entre a e b: a * b.',
    formula: (a: number, b: number) => a * b,
  },
  '4': {
    id: 'divisao',
    key: '4',
    symbol: '/',
    mathSymbol: '÷',
    name: 'Divisão',
    pythonFunc: 'dividir(a: float, b: float) -> float',
    docstring: 'Retorna o quociente a / b. Dispara ZeroDivisionError se b == 0.',
    formula: (a: number, b: number) => {
      if (b === 0) {
        throw new Error('ZeroDivisionError: Erro Matemático: Divisão por zero não é permitida.');
      }
      return a / b;
    },
  },
};

// Aliases para símbolos comuns
export const OPERACAO_POR_SIMBOLO: Record<string, OperationMeta> = {
  '+': OPERACOES['1'],
  '-': OPERACOES['2'],
  '*': OPERACOES['3'],
  'x': OPERACOES['3'],
  '×': OPERACOES['3'],
  '/': OPERACOES['4'],
  '÷': OPERACOES['4'],
  '1': OPERACOES['1'],
  '2': OPERACOES['2'],
  '3': OPERACOES['3'],
  '4': OPERACOES['4'],
};

/**
 * Formata um número para apresentação em Python, imitando formatar_numero() de calculadora.py.
 * Remove decimais redundantes caso seja inteiro (ex: 5.0 -> '5'),
 * arredonda ruídos de ponto flutuante IEEE 754 (0.1 + 0.2 -> '0.3'),
 * e converte para notação limpa.
 */
export function formatarNumeroPython(valor: number, precisaoMaxima: number = 8): string {
  if (Number.isNaN(valor)) return 'nan';
  if (!Number.isFinite(valor)) return valor > 0 ? 'inf' : '-inf';

  // Se for inteiro exato
  if (Number.isInteger(valor) && Math.abs(valor) < 1e12) {
    return valor.toString();
  }

  // Arredonda para eliminar ruídos da representação IEEE 754
  const fator = Math.pow(10, precisaoMaxima);
  const valorArredondado = Math.round((valor + Number.EPSILON) * fator) / fator;

  if (Number.isInteger(valorArredondado) && Math.abs(valorArredondado) < 1e12) {
    return valorArredondado.toString();
  }

  // Converte para string e limpa zeros desnecessários
  let str = valorArredondado.toFixed(precisaoMaxima);
  str = str.replace(/0+$/, '').replace(/\.$/, '');
  return str;
}

/**
 * Simula a execução da operação matemática com rastreamento completo de pilha e bytecode.
 */
export function executarOperacaoPython(
  a: number,
  b: number,
  opMeta: OperationMeta
): PythonExecutionTrace {
  const startTime = performance.now();
  const callStack: string[] = [
    '<module> (calculadora.py:178)',
    'main() (calculadora.py:165)',
    'executar_ciclo_calculadora() (calculadora.py:126)',
    `${opMeta.pythonFunc.split('(')[0]}(a=${formatarNumeroPython(a)}, b=${formatarNumeroPython(b)})`,
  ];

  const steps: string[] = [
    `1. Roteamento: Operação identificada como "${opMeta.name}" (${opMeta.mathSymbol}).`,
    `2. Verificação de tipos: a=${a} (float), b=${b} (float).`,
  ];

  let rawResult: number | undefined;
  let formattedResult: string | undefined;
  let hasError = false;
  let errorType: PythonExecutionTrace['errorType'];
  let errorMessage: string | undefined;

  const pseudoBytecode: string[] = [
    `LOAD_GLOBAL    0 (${opMeta.pythonFunc.split('(')[0]})`,
    `LOAD_CONST     1 (${a})`,
    `LOAD_CONST     2 (${b})`,
  ];

  if (opMeta.id === 'divisao' && b === 0) {
    hasError = true;
    errorType = 'ZeroDivisionError';
    errorMessage = 'Erro Matemático: Divisão por zero não é permitida.';
    steps.push('3. Verificação de guarda no divisor: b == 0 detectado!');
    steps.push('4. Disparo explícito de exceção: raise ZeroDivisionError(...)');
    steps.push('5. Captura no bloco try/except do loop REPL com mensagem amigável.');
    pseudoBytecode.push('COMPARE_OP     0 (== 0)');
    pseudoBytecode.push('POP_JUMP_IF_FALSE 12');
    pseudoBytecode.push('LOAD_GLOBAL    1 (ZeroDivisionError)');
    pseudoBytecode.push('RAISE_VARARGS  1');
  } else {
    try {
      rawResult = opMeta.formula(a, b);
      if (!Number.isFinite(rawResult)) {
        throw new Error('OverflowError: Resultado ultrapassa limites numéricos.');
      }
      formattedResult = formatarNumeroPython(rawResult);
      steps.push(`3. Execução matemática isolada: ${a} ${opMeta.symbol} ${b} = ${rawResult}`);
      steps.push(`4. Formatação de saída: "${formattedResult}" (remoção de ruído binário IEEE 754).`);
      steps.push('5. Retorno ao chamador com código de sucesso 0.');
      
      const opcode = opMeta.id === 'soma' ? 'BINARY_ADD' :
                     opMeta.id === 'subtracao' ? 'BINARY_SUBTRACT' :
                     opMeta.id === 'multiplicacao' ? 'BINARY_MULTIPLY' : 'BINARY_TRUE_DIVIDE';
      pseudoBytecode.push(opcode);
      pseudoBytecode.push('RETURN_VALUE');
    } catch (err: unknown) {
      hasError = true;
      errorType = 'OverflowError';
      errorMessage = (err as Error).message;
    }
  }

  const executionTimeMs = performance.now() - startTime;

  return {
    operationName: opMeta.name,
    operationSymbol: opMeta.mathSymbol,
    pythonFunction: opMeta.pythonFunc,
    operandA: a,
    operandB: b,
    rawResult,
    formattedResult,
    hasError,
    errorType,
    errorMessage,
    callStack,
    executionTimeMs,
    pseudoBytecode,
    steps,
  };
}

/**
 * Simula o pipeline de captura e casting de input do Python (capturar_numero).
 */
export function simularCastingEntrada(rawInput: string): CastingSimulationStep[] {
  const steps: CastingSimulationStep[] = [];

  // Etapa 1: Leitura bruta
  steps.push({
    stage: '1. Leitura Bruta: input()',
    input: rawInput,
    output: `"${rawInput}"`,
    status: 'info',
    explanation: 'A função input() do Python lê a entrada sempre como string bruta (str).',
  });

  // Etapa 2: Sanitização de espaços (.strip())
  const stripped = rawInput.trim();
  steps.push({
    stage: '2. Sanitização de Espaços: .strip()',
    input: `"${rawInput}"`,
    output: `"${stripped}"`,
    status: stripped.length > 0 ? 'info' : 'warning',
    explanation: 'Remove espaços no início e fim para prevenir erros acidentais de digitação.',
  });

  if (stripped.length === 0) {
    steps.push({
      stage: '3. Validação de Vazio',
      input: `"${stripped}"`,
      output: 'String vazia',
      status: 'error',
      explanation: 'Entrada vazia. Dispara repetição do loop while True até receber um valor.',
    });
    return steps;
  }

  // Etapa 3: Suporte a vírgula (.replace(',', '.'))
  const replaced = stripped.replace(',', '.');
  const commaReplaced = replaced !== stripped;
  steps.push({
    stage: "3. Normalização Decimal: .replace(',', '.')",
    input: `"${stripped}"`,
    output: `"${replaced}"`,
    status: 'info',
    explanation: commaReplaced
      ? 'Vírgula decimal substituída por ponto para compatibilidade com o padrão IEEE 754 de float.'
      : 'Nenhuma vírgula detectada. Mantém formato original.',
  });

  // Etapa 4: Casting com float()
  const num = Number(replaced);
  const isValidFloat = !Number.isNaN(num) && replaced.trim() !== '';

  if (!isValidFloat) {
    steps.push({
      stage: '4. Conversão de Tipo: float(...)',
      input: `float("${replaced}")`,
      output: 'ValueError: could not convert string to float',
      status: 'error',
      explanation: `O Python lança ValueError pois "${replaced}" contém caracteres não numéricos. O bloco try/except captura e exibe aviso sem quebrar o programa.`,
    });
    return steps;
  }

  // Etapa 5: Checagem de Finitude (isnan / isinf)
  if (!Number.isFinite(num)) {
    steps.push({
      stage: '5. Checagem de Finitude: math.isinf / isnan',
      input: `${num}`,
      output: 'Rejeitado (Infinito / Indefinido)',
      status: 'error',
      explanation: 'Valores infinitos (inf) ou indefinidos (nan) são rejeitados defensivamente para manter a sanidade matemática.',
    });
    return steps;
  }

  steps.push({
    stage: '4. Conversão de Tipo: float(...)',
    input: `float("${replaced}")`,
    output: `<class 'float'> : ${num}`,
    status: 'success',
    explanation: 'Casting realizado com sucesso! O valor agora é um número em ponto flutuante válido.',
  });

  steps.push({
    stage: '5. Retorno ao Fluxo de Controle',
    input: `${num}`,
    output: `Retorna ${num}`,
    status: 'success',
    explanation: 'O valor sanitizado é entregue à função matemática correspondente.',
  });

  return steps;
}

/**
 * Executa a suíte de testes unitários em tempo real.
 */
export function executarSuiteTestes(): UnitTestResult[] {
  const tests: UnitTestResult[] = [
    {
      id: 'test_soma_inteiros',
      name: 'Adição de dois inteiros positivos',
      category: 'Adição',
      expression: 'somar(15.0, 27.0)',
      expected: '42',
      actual: formatarNumeroPython(OPERACOES['1'].formula(15, 27)),
      passed: OPERACOES['1'].formula(15, 27) === 42,
      durationUs: 4,
      explanation: 'Verifica a soma básica comutativa a + b.',
    },
    {
      id: 'test_soma_negativos',
      name: 'Adição com números negativos',
      category: 'Adição',
      expression: 'somar(-14.5, 4.5)',
      expected: '-10',
      actual: formatarNumeroPython(OPERACOES['1'].formula(-14.5, 4.5)),
      passed: OPERACOES['1'].formula(-14.5, 4.5) === -10,
      durationUs: 3,
      explanation: 'Garante o correto tratamento de sinais opostos.',
    },
    {
      id: 'test_soma_precisao_float',
      name: 'Adição com precisão de ponto flutuante (IEEE 754)',
      category: 'Adição',
      expression: 'formatar(somar(0.1, 0.2))',
      expected: '0.3',
      actual: formatarNumeroPython(OPERACOES['1'].formula(0.1, 0.2)),
      passed: formatarNumeroPython(OPERACOES['1'].formula(0.1, 0.2)) === '0.3',
      durationUs: 5,
      explanation: 'Mede o tratamento do clássico 0.1 + 0.2 = 0.30000000000000004.',
    },
    {
      id: 'test_subtracao_positivos',
      name: 'Subtração básica',
      category: 'Subtração',
      expression: 'subtrair(100.0, 37.0)',
      expected: '63',
      actual: formatarNumeroPython(OPERACOES['2'].formula(100, 37)),
      passed: OPERACOES['2'].formula(100, 37) === 63,
      durationUs: 3,
      explanation: 'Verifica operação de subtração direta.',
    },
    {
      id: 'test_subtracao_resultado_negativo',
      name: 'Subtração com resultado negativo',
      category: 'Subtração',
      expression: 'subtrair(5.0, 18.0)',
      expected: '-13',
      actual: formatarNumeroPython(OPERACOES['2'].formula(5, 18)),
      passed: OPERACOES['2'].formula(5, 18) === -13,
      durationUs: 3,
      explanation: 'Garante que o subtraendo maior gere resultado negativo correto.',
    },
    {
      id: 'test_multiplicacao_padrao',
      name: 'Multiplicação de inteiros',
      category: 'Multiplicação',
      expression: 'multiplicar(7.0, 8.0)',
      expected: '56',
      actual: formatarNumeroPython(OPERACOES['3'].formula(7, 8)),
      passed: OPERACOES['3'].formula(7, 8) === 56,
      durationUs: 4,
      explanation: 'Verifica produto escalar de dois operandos.',
    },
    {
      id: 'test_multiplicacao_por_zero',
      name: 'Multiplicação por zero (elemento nulo)',
      category: 'Multiplicação',
      expression: 'multiplicar(9999.0, 0.0)',
      expected: '0',
      actual: formatarNumeroPython(OPERACOES['3'].formula(9999, 0)),
      passed: OPERACOES['3'].formula(9999, 0) === 0,
      durationUs: 3,
      explanation: 'Garante que qualquer valor multiplicado por zero retorne 0.',
    },
    {
      id: 'test_multiplicacao_negativos',
      name: 'Regra dos sinais (negativo x negativo)',
      category: 'Multiplicação',
      expression: 'multiplicar(-6.0, -9.0)',
      expected: '54',
      actual: formatarNumeroPython(OPERACOES['3'].formula(-6, -9)),
      passed: OPERACOES['3'].formula(-6, -9) === 54,
      durationUs: 3,
      explanation: 'Verifica a regra matemática (-a) * (-b) = +(a*b).',
    },
    {
      id: 'test_divisao_exata',
      name: 'Divisão exata',
      category: 'Divisão',
      expression: 'dividir(81.0, 9.0)',
      expected: '9',
      actual: formatarNumeroPython(OPERACOES['4'].formula(81, 9)),
      passed: OPERACOES['4'].formula(81, 9) === 9,
      durationUs: 4,
      explanation: 'Verifica quociente de divisão inteira limpa.',
    },
    {
      id: 'test_divisao_fracionaria',
      name: 'Divisão fracionária periódica',
      category: 'Divisão',
      expression: 'dividir(10.0, 3.0)',
      expected: '3.33333333',
      actual: formatarNumeroPython(OPERACOES['4'].formula(10, 3)),
      passed: formatarNumeroPython(OPERACOES['4'].formula(10, 3)).startsWith('3.333333'),
      durationUs: 4,
      explanation: 'Controla a exibição de dízimas periódicas com limite de precisão.',
    },
    {
      id: 'test_divisao_por_zero_excecao',
      name: 'Disparo de ZeroDivisionError (Caso de Borda Crítico)',
      category: 'Divisão',
      expression: 'dividir(42.0, 0.0)',
      expected: 'ZeroDivisionError levantado',
      actual: (() => {
        try {
          OPERACOES['4'].formula(42, 0);
          return 'Nenhuma exceção levantada';
        } catch (e: unknown) {
          return 'ZeroDivisionError capturada';
        }
      })(),
      passed: (() => {
        try {
          OPERACOES['4'].formula(42, 0);
          return false;
        } catch {
          return true;
        }
      })(),
      durationUs: 6,
      explanation: 'Validação defensiva de guarda para impedir divisão por zero no divisor.',
    },
    {
      id: 'test_formatacao_inteiro',
      name: 'Formatação inteligente de inteiros',
      category: 'Formatação',
      expression: 'formatar(12.0)',
      expected: '12 (sem ".0")',
      actual: formatarNumeroPython(12.0),
      passed: formatarNumeroPython(12.0) === '12',
      durationUs: 2,
      explanation: 'Garante que números inteiros não mostrem o decimal redundante .0.',
    },
  ];

  return tests;
}
