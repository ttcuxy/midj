// DOM Elements
const networkRadios = document.querySelectorAll('input[name="network"]');
const openaiSettings = document.getElementById('openai-settings');
const geminiSettings = document.getElementById('gemini-settings');
const openaiApiKeyInput = document.getElementById('openai-api-key');
const geminiApiKeyInput = document.getElementById('gemini-api-key');
const validateOpenaiBtn = document.getElementById('validate-openai-btn');
const validateGeminiBtn = document.getElementById('validate-gemini-btn');
const openaiStatus = document.getElementById('openai-status');
const geminiStatus = document.getElementById('gemini-status');
const openaiModelSelector = document.getElementById('openai-model-selector');
const geminiModelSelector = document.getElementById('gemini-model-selector');
const generateBtn = document.getElementById('generate-btn');
const testMidjourneyBtn = document.getElementById('test-midjourney-btn');

// App State
let currentNetwork = null;
let apiKeyValid = false;

// --- Functions ---

function updateUI() {
    openaiSettings.classList.toggle('hidden', currentNetwork !== 'openai');
    geminiSettings.classList.toggle('hidden', currentNetwork !== 'gemini');

    // Disable generate button if key is not validated
    generateBtn.disabled = !apiKeyValid;
}

async function validateApiKey(network) {
    const input = network === 'openai' ? openaiApiKeyInput : geminiApiKeyInput;
    const statusIndicator = network === 'openai' ? openaiStatus : geminiStatus;
    const modelSelector = network === 'openai' ? openaiModelSelector : geminiModelSelector;
    const apiKey = input.value;

    if (!apiKey) {
        alert('Пожалуйста, введите API ключ.');
        return;
    }
    // Reset status
    statusIndicator.className = 'status-indicator';
    modelSelector.classList.add('hidden');
    apiKeyValid = false;
    updateUI();
    try {
        const response = await fetch('/api/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ network, apiKey }),
        });
        if (response.ok) {
            statusIndicator.classList.add('valid');
            modelSelector.classList.remove('hidden');
            apiKeyValid = true;
        } else {
            statusIndicator.classList.add('invalid');
            apiKeyValid = false;
        }
    } catch (error) {
        console.error('Validation error:', error);
        statusIndicator.classList.add('invalid');
        apiKeyValid = false;
    }
    updateUI();
}

// --- Event Listeners ---

networkRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        currentNetwork = event.target.value;
        apiKeyValid = false; // Reset validation on network change
        openaiStatus.className = 'status-indicator';
        geminiStatus.className = 'status-indicator';
        openaiModelSelector.classList.add('hidden');
        geminiModelSelector.classList.add('hidden');
        updateUI();
    });
});

validateOpenaiBtn.addEventListener('click', () => validateApiKey('openai'));
validateGeminiBtn.addEventListener('click', () => validateApiKey('gemini'));

// Placeholder for the actual generation logic
generateBtn.addEventListener('click', () => {
    alert('Логика генерации будет добавлена на следующем шаге!');
    // Here you would collect the prompt, selected model, and API key
    // and send it to a new serverless function like '/api/generate-text'.
});

testMidjourneyBtn.addEventListener('click', async () => {
    const testPrompt = '/imagine prompt: a white cat in space, cinematic lighting';
    console.log('Отправка тестового промта в Midjourney:', testPrompt);

    try {
        const response = await fetch('/api/send-to-midjourney', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: testPrompt }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Успешный ответ:', result);
        } else {
            console.error('Ошибка от сервера:', result);
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
    }
});
