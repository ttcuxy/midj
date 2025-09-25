// File: api/validate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }
const { network, apiKey } = req.body;

if (!network || !apiKey) {
return res.status(400).json({ message: 'Network and apiKey are required' });
}

let validationUrl = '';
let headers = {};

if (network === 'openai') {
validationUrl = 'https://api.openai.com/v1/models';
headers = { 'Authorization': `Bearer ${apiKey}` };
} else if (network === 'gemini') {
validationUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro?key=${apiKey}`;
headers = { 'Content-Type': 'application/json' };
} else {
return res.status(400).json({ message: 'Invalid network specified' });
}

try {
const response = await fetch(validationUrl, { headers });

if (response.ok) {
  res.status(200).json({ valid: true });
} else {
  // --- НОВЫЙ КОД ДЛЯ ОТЛАДКИ ---
  // Получаем тело ошибки от Google
  const errorBody = await response.json();
  // Логируем на сервере для себя
  console.error("Error from Google API:", errorBody);
  // Отправляем подробную ошибку обратно в браузер
  res.status(401).json({
    valid: false,
    message: 'Invalid API Key or API not enabled.',
    details: errorBody // Добавляем детали от Google
  });
  // --- КОНЕЦ НОВОГО КОДА ---
}
} catch (error) {
res.status(500).json({ valid: false, message: 'Server error during validation' });
}
}
