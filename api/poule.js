export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  const { title } = req.query;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key in environment variables' });
  }

  if (!title) {
    return res.status(400).json({ error: 'Le paramètre "title" est requis.' });
  }

  const cleaned = title.trim().toLowerCase();
  const breed = cleaned.startsWith('poule ') ? cleaned.slice(6).trim() : cleaned;
  const breedCapitalized = breed.charAt(0).toUpperCase() + breed.slice(1);

  const prompt = `A vintage naturalist illustration of a ${breedCapitalized} hen, realistic feathers and anatomy, elegant profile pose, intricate feather texture, small red comb, NO TEXT at all, no watermark, pure white background #FFFFFF, 19th-century ornithological art style.`;

  try {
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

    return res.status(200).json({ url: imageUrl, prompt });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
