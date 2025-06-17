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
  const prompt = `Génère une Illustration à l’aquarelle d’une bouteille d’huile essentielle de ${cleaned}, en verre ambré avec un compte-gouttes noir. Autour de la bouteille, des éléments naturels évoquant l’huile essentielle de ${cleaned}, dans les tons de ces éléments. Un ruban de couleur dans les mêmes tons est délicatement noué AUTOUR du flacon. Le style est doux, naturel, artistique, avec un fond blanc pur, dans l’esprit des planches botaniques vintage, sans aucun texte ni watermark.`;
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
