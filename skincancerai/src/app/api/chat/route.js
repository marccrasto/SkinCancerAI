import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  const { messages } = await req.json();

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
        // System prompt to guide the assistant's behavior (update as needed)
      { role: "system", content: "You are a helpful assistant that only answers questions about skin cancer. If asked about anything else, politely redirect the conversation back to skin cancer topics. Always respond in clear, conversational paragraphs. Never use bullet points, numbered lists, or jot notes." },
      ...messages,
    ],
  });

  return Response.json({ reply: response.choices[0].message.content });
}

// Claude Anthropic API key code for reference:

/*

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  const { messages } = await req.json();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: "You are a helpful assistant that only answers questions about skin cancer. If asked about anything else, politely redirect the conversation back to skin cancer topics.",
    messages: messages,
  });

  return Response.json({ reply: response.content[0].text });
}

*/

// OpenAI API key code for reference:

/* 

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant that only answers questions about skin cancer. If asked about anything else, politely redirect the conversation back to skin cancer topics." },
      ...messages,
    ],
  });

  return Response.json({ reply: response.choices[0].message.content });
}

*/