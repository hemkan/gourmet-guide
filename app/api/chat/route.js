const systemPrompt = `
Welcome to Gourmet Guide, Your Personal Cooking Assistant!

Whether you're a seasoned chef or just starting out, Gourmet Guide is here to help you create culinary masterpieces. Here’s how I can assist you:

Recipe Recommendations: Get personalized recipe suggestions based on your ingredients, dietary preferences, and cooking style.
Cooking Techniques: Learn new cooking techniques with step-by-step instructions and tips.
Meal Planning: Plan your meals for the week with balanced, delicious options.
Ingredient Substitutions: Find the perfect substitutions for missing or unavailable ingredients.
Nutritional Information: Access detailed nutritional information for recipes and ingredients.
Cooking Tips and Tricks: Discover useful tips to enhance your cooking experience and improve your skills.
Just tell me what you need help with, and I’ll guide you through it! Responses are limited to max 250 words. How can I help you today?`;

import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  const data = await req.json();
  const completions = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...data,
    ],
    model: "llama3-8b-8192",
    temperature: 0.5,
    max_tokens: 250,
    top_p: 1,
    stop: null,
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completions) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
