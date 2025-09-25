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
// --- ИЗМЕНЕННЫЙ КОД ---
// Используем более надежный эндпоинт для проверки - список моделей
validationUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
headers = { 'Content-Type': 'application/json' };
// --- КОНЕЦ ИЗМЕНЕНИЙ ---
} else {
return res.status(400).json({ message: 'Invalid network specified' });
}

try {
// Для обоих API мы делаем GET-запрос
const response = await fetch(validationUrl, { method: 'GET', headers });

if (response.ok) {
  res.status(200).json({ valid: true });
} else {
  const errorBody = await response.json();
  console.error("Authorization Error Details:", errorBody);
  res.status(401).json({
    valid: false,
    message: 'Authorization Failed.',
    details: errorBody
  });
}
} catch (error) {
console.error("Internal Server Error:", error);
res.status(500).json({ valid: false, message: 'Internal server error during validation' });
}
}
