export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  const { title } = req.query;

  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API OpenAI manquante dans les variables d\'environnement' });
  }

  if (!title) {
    return res.status(400).json({ error: 'Le paramètre "title" est requis.' });
  }

  // Nettoyer le titre et extraire le nom de l'huile
  const cleaned = title.trim().toLowerCase();
  let oilName = cleaned;
  if (cleaned.startsWith('huile essentielle de ')) {
    oilName = cleaned.slice(20).trim();
  } else if (cleaned.startsWith('huile essentielle d\'')) {
    oilName = cleaned.slice(19).trim();
  } else if (cleaned.startsWith('huile de ')) {
    oilName = cleaned.slice(9).trim();
  } else if (cleaned.startsWith('huile d\'')) {
    oilName = cleaned.slice(8).trim();
  }

  // Mettre en majuscule chaque mot du nom de l'huile
  const oilNameCapitalized = oilName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Prompt en français pour générer l'image
  const prompt = `Illustration à l’aquarelle d’une bouteille d’huile essentielle de ${oilNameCapitalized}, en verre ambré avec un compte-gouttes noir. Autour de la bouteille, des éléments naturels évoquant l’${oilNameCapitalized}, dans les tons de ces éléments. Un ruban de couleur dans les mêmes tons est délicatement noué autour du flacon. Le style est doux, naturel, artistique, avec un fond blanc pur, dans l’esprit des planches botaniques vintage, sans texte ni watermark.`;

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
      return res.status(500).json({ error: 'Erreur de l\'API OpenAI', details: errorDetails });
    }

    const data = await dalleResponse.json();
    const imageUrl = data.data[0].url;

    return res.status(200).json({ url: imageUrl, prompt });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
