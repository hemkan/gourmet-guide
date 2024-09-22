# Gourmet Guide

Gourmet Guide is a personal cooking assistant designed to help you discover and create delicious recipes with ease. Whether you're seeking new recipe ideas or need advice on cooking techniques, Gourmet Guide provides tailored responses to suit your culinary needs. With a focus on user-friendly interactions and accessibility, this platform is ideal for both beginner and seasoned cooks looking to elevate their culinary skills.


[Live Demo](https://gourmetguide.vercel.app/) | [Source Code](https://github.com/hemkan/gourmet-guide)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-007ACC?style=for-the-badge&logo=data:image/svg+xml;base64,YOUR_BASE64_ENCODED_LOGO)
![Llama 3.1-8B](https://img.shields.io/badge/Llama%203.1--8B-AI%20Model-brightgreen?style=for-the-badge)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white)

## Key Features

- **AI-Powered Responses**: Powered by the Llama 3.1-8B model, the chatbot provides intelligent and context-aware responses for personalized cooking guidance.

- **Conversational Recipe Suggestions**: Get personalized recipe ideas by simply chatting with the Gourmet Guide chatbot. Whether you have specific ingredients or are looking for inspiration, the assistant can suggest recipes tailored to your preferences.

- **Cooking Tips & Techniques**: Ask for cooking advice or techniques, and receive expert tips to improve your culinary skills. The chatbot can guide you through complex steps or offer suggestions to enhance your dishes.

- **Ingredient-Based Search**: Input the ingredients you have on hand, and Gourmet Guide will suggest recipes that make the most of what you already have in your kitchen.

- **Interactive and Intuitive UI**: Enjoy a user-friendly interface that makes navigating the platform and interacting with the chatbot easy and enjoyable.

- **Save and Access Your Favorites**: Bookmark your favorite recipes or tips for easy access later (coming soon).

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/hemkan/gourmet-guide.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Create a .env.local file in the root of your project directory and add your environment variables:**

   ```env
   # Example environment variables
   NEXT_PUBLIC_API_URL=https://api.example.com
   NEXT_PUBLIC_API_KEY=your_api_key
   # API key for GROQ services
   GROQ_API_KEY=your_api_key
   ```


4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

   - You should see the Gourmet Guide interface, where you can start interacting with the chatbot.
   - Begin by typing a question or request, like "Suggest a recipe with chicken and broccoli" or "How do I cook pasta perfectly?"

## Learn More

To learn more about Swift-Cards and the technologies used, check out the following resources:

- [Clerk Documentation](https://clerk.dev/docs) - Learn more about user authentication and account management with Clerk.
- [Stripe Documentation](https://stripe.com/docs) - Explore Stripe's payment platform and API for processing transactions.
- [Next.js Documentation](https://nextjs.org/docs) - Get familiar with Next.js features and APIs for building fast web applications.
- [Firebase Documentation](https://firebase.google.com/docs) - Read about Firebase's real-time database, authentication, and other backend services.
- [Vercel Deployment Documentation](https://vercel.com/docs) - Find out how to deploy your Next.js apps with Vercel.
