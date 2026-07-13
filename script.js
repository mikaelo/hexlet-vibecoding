'use strict';

// Коэффициенты корректировки калорий в зависимости от цели
const GOAL_FACTORS = {
  lose: 0.85, // дефицит 15%
  maintain: 1, // поддержание
  gain: 1.15, // профицит 15%
};

// Распределение макронутриентов (доля от суточной нормы калорий)
const MACRO_SPLIT = {
  protein: 0.3,
  fat: 0.3,
  carbs: 0.4,
};

// Калорийность 1 грамма макронутриента
const KCAL_PER_GRAM = {
  protein: 4,
  fat: 9,
  carbs: 4,
};

const form = document.getElementById('calc-form');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');

/**
 * Базовый обмен веществ (BMR) по формуле Миффлина — Сан Жеора.
 * @returns {number} ккал в сутки
 */
function calcBmr({ gender, weight, height, age }) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
  resultEl.hidden = true;
}

function renderResult({ bmr, tdee, target }) {
  document.getElementById('bmr-value').textContent = Math.round(bmr);
  document.getElementById('tdee-value').textContent = Math.round(tdee);
  document.getElementById('target-calories').textContent = Math.round(target);

  document.getElementById('protein').textContent = Math.round(
    (target * MACRO_SPLIT.protein) / KCAL_PER_GRAM.protein
  );
  document.getElementById('fat').textContent = Math.round(
    (target * MACRO_SPLIT.fat) / KCAL_PER_GRAM.fat
  );
  document.getElementById('carbs').textContent = Math.round(
    (target * MACRO_SPLIT.carbs) / KCAL_PER_GRAM.carbs
  );

  errorEl.hidden = true;
  resultEl.hidden = false;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const gender = data.get('gender');
  const age = Number(data.get('age'));
  const weight = Number(data.get('weight'));
  const height = Number(data.get('height'));
  const activity = Number(data.get('activity'));
  const goal = data.get('goal');

  if (!age || !weight || !height) {
    showError('Пожалуйста, заполните возраст, вес и рост.');
    return;
  }

  if (age < 1 || age > 120 || weight < 20 || weight > 400 || height < 80 || height > 250) {
    showError('Проверьте корректность введённых данных.');
    return;
  }

  const bmr = calcBmr({ gender, weight, height, age });
  const tdee = bmr * activity;
  const target = tdee * (GOAL_FACTORS[goal] ?? 1);

  renderResult({ bmr, tdee, target });
});
