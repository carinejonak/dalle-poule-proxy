export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  const { title } = req.query;

  // Sécurité : on vérifie la clé et le param « title »
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key in environment variables' });
  }
  if (!title) {
    return res.status(400).json({ error: 'Le paramètre "title" est requis.' });
  }

  // Nettoyage basique du titre (on garde les majuscules, ça fait plus joli dans le prompt)
  const cleaned = title.trim();

  // ✨ Nouveau prompt DALL·E (format 1024×1024)
  const prompt = `Génère l'illustration d'un animal ${cleaned} représenté comme un animal totem chamanique, dans un style artistique, doux et stylisé. L’animal est de profil ou en légère diagonale, mis en valeur au centre d’un mandala de plumes larges et graphiques dans des teintes dégradées et variées inspirées des couleurs naturelles de l’animal, en accord parfait avec ses nuances. Teintes douces et harmonieuses. L’ambiance est légère, fluide, mystique, avec des éléments tribaux dessinés à la main (plumes, perles, motifs géométriques anciens). Style illustratif, poétique et spirituel. Sans texte.`;

  try {
    const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
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

    // On renvoie l’URL de l’image + le prompt (toujours pratique pour debug)
    return res.status(200).json({ url: imageUrl, prompt });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
