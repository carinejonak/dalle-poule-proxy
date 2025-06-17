export const config = {
  runtime: 'nodejs',
  maxDuration: 30
};

export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    // Reconstruire l'URL complète pour accéder aux paramètres
    const fullUrl = `https://${req.headers.host}${req.url}`;
    const url = new URL(fullUrl);
    const title = url.searchParams.get("title");

    if (!apiKey) {
      return res.status(500).json({ error: 'Missing OpenAI API key in environment variables' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Le paramètre "title" est requis.' });
    }

    const cleaned = title.trim().toLowerCase().replace(/[“”‘’«»]/g, '');

    const prompt = `Illustration réaliste au format horizontal sur le thème de l'immobilier, ambiance professionnelle, lumière naturelle. Cette image illustre l'article : "${cleaned}". Aucun texte, aucun filigrane.`;

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
        size: '1792x1024'
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
    return res.status(500).json({ error: 'Unhandled server error', message: error.message });
  }
}
