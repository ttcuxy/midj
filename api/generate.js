// File: api/generate.js
export default async function handler(req, res) {
  // In a Vite/Node.js environment, we need to handle the request stream
  // to get the body, as it's not pre-parsed like in some serverless environments.
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
        // This is a server-side error, so we shouldn't expose the exact reason to the client.
        console.error('API key is not configured on the server.');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error: API key missing.' }));
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

    } catch (error) {
      console.error('Error in serverless function:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: error.message || 'An unexpected error occurred.' }));
    }
  });
}
