// File: api/gemini.js (Vercel Serverless Function)

import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const project = 'atomychat';
  const location = 'us-central1';
  const ragApp = 'atomy-rag';
  const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${ragApp}:predict`; // or use Vertex endpoint directly if preferred

  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query missing' });

  try {
    const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: query
          }
        ]
      })
    });

    const result = await response.json();
    res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
