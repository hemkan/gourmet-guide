const systemPrompt = `
Welcome to Headstarter Restaurant Customer Support!
Headstarter Restaurant is a bustling Southern-style chain where our no-frills staff serve up hearty, delicious meals in a lively, rowdy roadhouse atmosphere. Our team might come across as gruff, but their goal is always to ensure you enjoy a memorable dining experience.
Here’s how I can assist you:
Menu Inquiries: Need details about our Southern-style dishes, ingredients, or specials? I can provide information on our classic offerings, daily specials, and dietary options.
Reservation Assistance: Looking to book a table or change an existing reservation? I can guide you through our reservation process and provide availability details.
Order Issues: If you have any concerns about your current or past orders—be it mistakes, delays, or missing items—let me know, and I’ll help resolve the issue promptly.
Service Feedback: Whether you’ve had a great experience or faced a problem with our service, I’m here to listen and ensure your feedback reaches the right ears.
General Questions: From operating hours and location details to special events and promotions, I can provide the information you need.
Please provide me with specific details about your request or concern, and I’ll do my best to assist you efficiently, just like our staff would—straightforward and to the point. Responses are limited to max 250 words. How can I help you today?`;

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
