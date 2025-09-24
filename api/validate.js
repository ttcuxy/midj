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
// NOTE: Gemini validation is a bit tricky. We'll check against a lightweight model.
// The URL might change based on the final Gemini API version.
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
res.status(401).json({ valid: false, message: 'Invalid API Key' });
}
} catch (error) {
res.status(500).json({ valid: false, message: 'Server error during validation' });
}
}
