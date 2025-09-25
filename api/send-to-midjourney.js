// File: api/send-to-midjourney.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Only POST requests allowed' }));
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { prompt } = JSON.parse(body);
      const apiKey = process.env.USERAPI_AI_KEY;

      if (!apiKey) {
        console.error('USERAPI_AI_KEY is not configured on the server.');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error: API key is not configured.' }));
        return;
      }

      const apiResponse = await fetch('https://api.userapi.ai/midjourney/v2/imagine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await apiResponse.json();

      res.writeHead(apiResponse.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));

    } catch (error)
    {
      console.error('Error in API handler:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: error.message || 'An unexpected error occurred.' }));
    }
  });
}
