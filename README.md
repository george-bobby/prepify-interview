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
- **AI & Voice:** Vapi SDK, Gemini API, ChatGPT API
- **Backend & Auth:** Firebase (Firestore & Authentication)
- **News API:** NewsAPI.org for dynamic news fetching

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin (Server-side)
FIREBASE_ADMIN_PROJECT_ID=your_firebase_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_ADMIN_PRIVATE_KEY=your_firebase_private_key

# AI APIs
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Vapi SDK
VAPI_API_KEY=your_vapi_api_key

# News API (Optional - for Insights page)
NEWS_API_KEY=your_newsapi_key
```

### 📰 News API Setup (Optional)

The Insights page can work with or without a News API key:

1. **With API Key:** Get a free API key from [NewsAPI.org](https://newsapi.org/)
2. **Without API Key:** The page will show curated sample articles

To get a News API key:

1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key
4. Add it to your `.env.local` file as `NEWS_API_KEY`
