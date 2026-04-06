# 🎯 Prepify - AI-Powered Interview Preparation Platform

**Prepify** is a SaaS platform designed to help users practice interviews with the power of AI.  
Built with **Next.js**, **Tailwind CSS**, **React**, and **shadcn/ui** for a sleek, responsive frontend.  
Powered by **Vapi SDK** for real-time voice interactions, **Gemini API**, **ChatGPT API** for AI responses, and **Firebase** for authentication and data storage.

## 🚀 Features

- 🎙️ AI-powered mock interviews with real-time voice using Vapi SDK
- 🤖 Smart responses and feedback powered by Gemini and ChatGPT
- 🔒 Secure authentication and real-time data storage with Firebase
- 💻 Modern UI/UX built with Next.js, Tailwind CSS, React & shadcn/ui
- 📝 Instant feedback and performance tracking

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, shadcn/ui
- **AI & Voice:** Vapi SDK & Gemini API
- **Backend & Auth:** Firebase (Firestore & Authentication)
- **News API:** NewsAPI.org for dynamic news fetching

## 🔧 Environment Variables

Create a `.env` file in the root directory using `.env.example`

### 📰 News API Setup (Optional)

The Insights page can work with or without a News API key:

1. **With API Key:** Get a free API key from [NewsAPI.org](https://newsapi.org/)
2. **Without API Key:** The page will show curated sample articles

To get a News API key:

1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key
4. Add it to your `.env.local` file as `NEWS_API_KEY`
