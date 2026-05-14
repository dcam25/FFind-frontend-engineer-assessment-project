// Next.js Route Handler — Server-side OpenAI API call
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt cannot be empty.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    // Build history in OpenAI format
    const messages = [
      ...(history ?? []).map((msg: { role: string; content: string }) => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: prompt.trim() },
    ];

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

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (err: unknown) {
    console.error('[OpenAI API Error]', err);
    const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
