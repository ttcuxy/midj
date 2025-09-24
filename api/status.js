// File: api/status.js
import { URL } from 'url';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Only GET requests allowed' }));
    return;
  }

  // In a Vite/Node.js environment, we need to parse the URL to get query params.
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const hash = requestUrl.searchParams.get('hash');
  const apiKey = process.env.USERAPI_AI_KEY;

  if (!hash) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hash parameter is required' }));
    return;
  }

  if (!apiKey) {
    console.error('API key is not configured on the server.');
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error: API key missing.' }));
    return;
  }

  try {
    const apiResponse = await fetch(`https://api.userapi.ai/midjourney/v2/status?hash=${hash}`, {
      headers: { 'api-key': apiKey },
    });

    const data = await apiResponse.json();

    res.writeHead(apiResponse.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));

  } catch (error) {
    console.error('Error in status function:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: error.message || 'An unexpected error occurred.' }));
  }
}
