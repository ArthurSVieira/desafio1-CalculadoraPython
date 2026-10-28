export type OperationType =
  | 'soma'
  | 'subtracao'
  | 'multiplicacao'
  | 'divisao'
  | 'porcentagem'
  | 'seno'
  | 'cosseno';

export interface OperationMeta {
  id: OperationType;
  key: string;
  symbol: string;
  mathSymbol: string;
  name: string;
  pythonFunc: string;
  docstring: string;
  isUnary?: boolean;
  formula: (a: number, b: number) => number;
}

export interface PythonExecutionTrace {
  operationName: string;
  operationSymbol: string;
  pythonFunction: string;
  isUnary?: boolean;
  operandA: number;
  operandB: number;
  rawResult?: number;
  formattedResult?: string;
  hasError: boolean;
  errorType?: 'ZeroDivisionError' | 'OverflowError' | 'ValueError' | 'UnexpectedError';
  errorMessage?: string;
  callStack: string[];
  executionTimeMs: number;
  pseudoBytecode: string[];
  steps: string[];
}

export interface UnitTestResult {
  id: string;
  name: string;
  category:
    | 'Adição'
    | 'Subtração'
    | 'Multiplicação'
    | 'Divisão'
    | 'Porcentagem'
    | 'Trigonometria'
    | 'Casting'
    | 'Formatação';
  expression: string;
  expected: string;
  actual: string;
  passed: boolean;
  durationUs: number;
  explanation: string;
}

export interface CastingSimulationStep {
  stage: string;
  input: string;
  output: string;
  status: 'info' | 'success' | 'warning' | 'error';
  explanation: string;
}
