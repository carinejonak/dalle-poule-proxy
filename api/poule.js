export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  const { title, plumage, crete, pattes, taille } = req.query;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key in environment variables' });
  }

  try {
    const breed = title.toLowerCase().startsWith('poule ') ? title.slice(6).trim() : title.trim();
    
    // Construire un prompt détaillé pour un dessin vintage
    const prompt = `A vintage naturalist illustration of a ${taille || 'medium-sized'} ${breed} hen, detailed soft feathers with ${plumage || 'standard plumage'}, ${crete || 'standard comb'}, ${pattes || 'standard legs'}, elegant pose in profile, intricate plumage patterns, vibrant red comb, delicate shading, in the style of 19th-century ornithological art, isolated on a pure white background.`;

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
