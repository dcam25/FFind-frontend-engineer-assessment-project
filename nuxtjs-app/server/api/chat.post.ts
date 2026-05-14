import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { prompt, history } = body;

  const config = useRuntimeConfig();
  const apiKey = config.openaiApiKey;

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OpenAI API key is not configured.',
    });
  }

  const openai = new OpenAI({ apiKey });

  // Build history in OpenAI format
  const messages = [
    ...(history ?? []).map((msg: any) => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.content,
    })),
    { role: 'user', content: prompt },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as any,
      max_tokens: 2048,
      temperature: 0.8,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
    setResponseHeader(event, 'Cache-Control', 'no-cache, no-transform');
    return stream;
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Error communicating with OpenAI API',
    });
  }
});
