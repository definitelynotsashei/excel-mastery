export class FormulaEngineError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = details.code ?? "FORMULA_ENGINE_ERROR";
    this.details = details;
  }
}

export class FormulaParseError extends FormulaEngineError {
  constructor(message, details = {}) {
    super(message, { ...details, code: details.code ?? "PARSE_ERROR" });
  }
}

export class FormulaReferenceError extends FormulaEngineError {
  constructor(message, details = {}) {
    super(message, { ...details, code: details.code ?? "REFERENCE_ERROR" });
  }
}

export class FormulaFunctionError extends FormulaEngineError {
  constructor(message, details = {}) {
    super(message, { ...details, code: details.code ?? "FUNCTION_ERROR" });
  }
}

export class FormulaEvaluationError extends FormulaEngineError {
  constructor(message, details = {}) {
    super(message, { ...details, code: details.code ?? "EVALUATION_ERROR" });
  }
}

export function formatFormulaError(error) {
  if (error instanceof FormulaEngineError) {
    return {
      type: error.code,
      message: error.message,
      details: error.details,
    };
  }

  return {
    type: "UNKNOWN_FORMULA_ERROR",
    message: "Unexpected formula error.",
    details: {},
  };
}
