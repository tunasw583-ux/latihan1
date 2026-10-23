import { calculate, formatNumber } from './calculator.js';

const expressionElement = document.querySelector('#expression');
const resultElement = document.querySelector('#result');
const keypad = document.querySelector('.keypad');
const historyPanel = document.querySelector('#historyPanel');
const historyList = document.querySelector('#historyList');

const operators = ['+', '−', '×', '÷'];
let expression = '';
let history = JSON.parse(localStorage.getItem('arka-history') ?? '[]');
let justCalculated = false;

const render = () => {
  expressionElement.textContent = expression || '0';
  if (!expression) {
    resultElement.textContent = '0';
    return;
  }

  if (justCalculated) return;

  const preview = expression.replace(/[+−×÷]$/, '').trim();
  if (!preview || preview === expression) return;

  try {
    resultElement.textContent = calculate(preview);
  } catch {
    resultElement.textContent = '—';
  }
};

const commit = (value) => {
  if (value === 'AC') {
    expression = '';
    justCalculated = false;
  } else if (value === '⌫') {
    expression = expression.slice(0, -1);
    justCalculated = false;
  } else if (value === '=') {
    equals();
  } else {
    append(value);
  }
  render();
};

const append = (value) => {
  if (justCalculated && !operators.includes(value)) {
    expression = '';
  }
  justCalculated = false;

  if (operators.includes(value)) {
    if (!expression) {
      if (value === '−') expression = '−';
      return;
    }

    const last = expression.at(-1);
    if (operators.includes(last)) {
      expression = `${expression.slice(0, -1)}${value}`;
      return;
    }
  }

  if (value === '.') {
    const currentNumber = expression.split(/[+−×÷]/).at(-1);
    if (currentNumber.includes('.')) return;
  }

  if (value === '%') {
    const match = expression.match(/(\d+(?:\.\d*)?)$/);
    if (!match) return;

    const valueAtEnd = Number(match[1]);
    expression = `${expression.slice(0, match.index)}${formatNumber(valueAtEnd / 100)}`;
    return;
  }

  expression += value;
};

const equals = () => {
  if (!expression) return;

  try {
    const answer = calculate(expression);
    history.unshift({ expression, answer });
    history = history.slice(0, 20);
    localStorage.setItem('arka-history', JSON.stringify(history));
    expression = answer;
    resultElement.textContent = answer;
    justCalculated = true;
    renderHistory();
  } catch (error) {
    resultElement.textContent = error.message;
  }
};

const renderHistory = () => {
  if (!history.length) {
    historyList.innerHTML = '<p class="history-empty">Belum ada hitungan.</p>';
    return;
  }

  historyList.innerHTML = history.map((item, index) => `
    <button class="history-item" type="button" data-history-index="${index}">
      <span class="history-expression">${item.expression}</span>
      <span class="history-result">= ${item.answer}</span>
    </button>
  `).join('');
};

const setHistoryOpen = (open) => {
  historyPanel.classList.toggle('open', open);
  historyPanel.setAttribute('aria-hidden', String(!open));
};

keypad.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  commit(button.dataset.action === 'clear'
    ? 'AC'
    : button.dataset.action === 'delete'
      ? '⌫'
      : button.dataset.action === 'equals'
        ? '='
        : button.dataset.value);
});

document.querySelector('#historyButton').addEventListener('click', () => setHistoryOpen(true));
document.querySelector('#closeHistory').addEventListener('click', () => setHistoryOpen(false));
document.querySelector('#clearHistory').addEventListener('click', () => {
  history = [];
  localStorage.removeItem('arka-history');
  renderHistory();
});

historyList.addEventListener('click', (event) => {
  const item = event.target.closest('[data-history-index]');
  if (!item) return;
  expression = history[Number(item.dataset.historyIndex)].answer;
  justCalculated = true;
  setHistoryOpen(false);
  render();
});

document.addEventListener('keydown', (event) => {
  const keyMap = { '*': '×', '/': '÷', '-': '−', Enter: '=', Escape: 'AC', Backspace: '⌫' };
  const value = keyMap[event.key] ?? event.key;

  if (/^[0-9.]$/.test(value) || operators.includes(value) || ['=', 'AC', '⌫'].includes(value)) {
    event.preventDefault();
    commit(value);
  }
});

renderHistory();
render();
