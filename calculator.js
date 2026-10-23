export const formatNumber = (value) => {
  if (!Number.isFinite(value)) throw new Error('Hasil tidak valid');
  if (Object.is(value, -0)) return '0';

  const rounded = Number.parseFloat(value.toPrecision(12));
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 10,
    useGrouping: false,
  }).format(rounded);
};

export const calculate = (expression) => {
  const normalized = expression
    .replaceAll('×', '*')
    .replaceAll('÷', '/')
    .replaceAll('−', '-')
    .replaceAll(',', '.')
    .trim();

  if (!/^[-+]?\d+(?:\.\d+)?(?:\s*[+\-*\/]\s*[-+]?\d+(?:\.\d+)?)*$/.test(normalized)) {
    throw new Error('Ekspresi tidak lengkap');
  }

  const tokens = normalized.match(/\d+(?:\.\d+)?|[+\-*\/]/g) ?? [];
  const terms = [];
  let pendingOperator = '+';
  let index = 0;

  if (tokens[0] === '-') {
    pendingOperator = '-';
    index = 1;
  }

  for (; index < tokens.length; index += 1) {
    if (/^[+\-*\/]/.test(tokens[index])) {
      pendingOperator = tokens[index];
      continue;
    }

    const value = Number(tokens[index]);
    const previousTerm = terms.at(-1);

    if (pendingOperator === '*' && previousTerm !== undefined) {
      terms[terms.length - 1] = previousTerm * value;
    } else if (pendingOperator === '/' && previousTerm !== undefined) {
      terms[terms.length - 1] = previousTerm / value;
    } else if (pendingOperator === '-') {
      terms.push(-value);
    } else {
      terms.push(value);
    }
  }

  const result = terms.reduce((total, term) => total + term, 0);
  if (!Number.isFinite(result)) throw new Error('Pembagian tidak valid');
  return formatNumber(result);
};
