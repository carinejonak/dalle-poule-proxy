export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  const title = req.query.title || 'poule';

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key in environment variables' });
  }

  try {
    const breed = title.toLowerCase().startsWith('poule ') ? title.slice(6).trim() : title.trim();

    const prompt = `A vintage illustration of the French chicken breed ${breed}, in a rustic farmyard, with soft feathers, natural colors, and a gentle, elegant hen look.`;

    const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024'
      })
    });

    if (!dalleResponse.ok) {
      const errorDetails = await dalleResponse.text();
      return res.status(500).json({ error: 'OpenAI API error', details: errorDetails });
    }

    const data = await dalleResponse.json();
    const imageUrl = data.data[0].url;

    return res.status(200).json({ url: imageUrl });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
