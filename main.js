// File: main.js
const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const resultContainer = document.getElementById('result-container');
let pollingInterval;

// Функция для проверки статуса
const checkStatus = async (hash) => {
  try {
    const response = await fetch(`/api/status?hash=${hash}`);
    const data = await response.json();

    if (data.status === 'done') {
      clearInterval(pollingInterval);
      resultContainer.innerHTML = `<img src="${data.result.url}" alt="Generated image">`;
      generateBtn.disabled = false;
    } else if (data.status === 'error') {
      clearInterval(pollingInterval);
      resultContainer.innerHTML = `<div class="placeholder">Ошибка: ${data.status_reason}</div>`;
      generateBtn.disabled = false;
    } else {
      // Показываем прогресс, если он есть
      const progressText = data.progress ? `Прогресс: ${data.progress}%` : 'Задача в очереди...';
      resultContainer.innerHTML = `<div class="placeholder">${progressText}</div>`;
    }
  } catch (error) {
    clearInterval(pollingInterval);
    resultContainer.innerHTML = `<div class="placeholder">Ошибка проверки статуса.</div>`;
    generateBtn.disabled = false;
    console.error(error);
  }
};

// Функция для старта генерации
const startGeneration = async () => {
  if (pollingInterval) clearInterval(pollingInterval);

  const prompt = promptInput.value;
  if (!prompt) {
    alert('Введите промт!');
    return;
  }

  generateBtn.disabled = true;
  resultContainer.innerHTML = '<div class="placeholder">Отправка запроса...</div>';

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка API');
    }
    const { hash } = data;
    resultContainer.innerHTML = `<div class="placeholder">Задача принята. Ожидание результата...</div>`;
    // Запускаем проверку статуса каждые 5 секунд
    pollingInterval = setInterval(() => checkStatus(hash), 5000);
    checkStatus(hash); // Проверяем сразу же первый раз

  } catch (error) {
    resultContainer.innerHTML = `<div class="placeholder">Ошибка: ${error.message}</div>`;
    generateBtn.disabled = false;
    console.error(error);
  }
};

generateBtn.addEventListener('click', startGeneration);
