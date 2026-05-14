const OpenAI = require('openai');

module.exports = async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API Key not configured on Vercel.' });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const { prompt, history } = req.body;

    const messages = [
      ...(history || []).map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: prompt }
    ];

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 2048,
      temperature: 0.8,
      stream: true,
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(content);
      }
    }
    res.end();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Error communicating with OpenAI' });
    } else {
      res.end();
    }
  }
};
