export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  const { title } = req.query;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key in environment variables' });
  }

  if (!title) {
    return res.status(400).json({ error: 'Le paramètre "title" est requis.' });
  }

  const cleaned = title.trim();
  const prompt = `Photo réaliste illustrant le sujet suivant : "${cleaned}". La scène montre une situation crédible liée à l'immobilier. Par exemple, un vendeur préoccupé signe un compromis de vente dans une agence immobilière moderne, pendant qu’un acheteur consulte le document. La lumière est naturelle, l’ambiance professionnelle, le décor neutre. Un modèle réduit de maison est visible sur le bureau. Format horizontal, 1200 x 800 px minimum.`;

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
        size: '1024x1024' // ⚠️ DALL·E ne supporte pas encore 1200x800 → 1024x1024 par défaut
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
