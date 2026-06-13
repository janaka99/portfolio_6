# Autonomous AI Developer Portfolio

A next-generation, interactive developer portfolio built with Next.js 15 and React 19. It goes beyond a static resume by embedding a context-aware, autonomous AI assistant that can answer questions about your experience, summarize your projects, and securely send emails on your behalf.

The front end is designed with a premium, strict dark-mode aesthetic utilizing Framer Motion for kinetic typography and React Three Fiber for interactive 3D WebGL scenes.

## ✨ Key Features

### 🤖 Embedded Agentic AI
- **LangGraph & LangChain**: Multi-agent orchestration capable of parallel tool execution and asynchronous task management.
- **Vercel AI SDK**: Provides edge-optimized, real-time token-by-token streaming with persistent conversation memory.
- **Custom RAG Pipeline**: MongoDB Vector Search combined with OpenAI/Gemini embeddings provides sub-second semantic retrieval across unstructured knowledge bases (PDFs, text).
- **Human-in-the-Loop (HITL)**: Secure authorization layer that safely prompts the user before executing sensitive actions like sending emails.

### 🌌 Premium 3D & UI/UX
- **Three.js & React Three Fiber**: Features a lightweight, interactive 3D hero scene with a rotating, light-reactive wireframe sphere.
- **Framer Motion**: Smooth scroll animations, staggered layout reveals, and a custom magnetic cursor.
- **Tailwind CSS v4**: Strict, high-contrast dark mode palette with glassmorphism and subtle tactical film-grain overlays.

### 🛡️ Full-Stack Admin Dashboard
- **NextAuth.js**: Secure login to manage your portfolio content.
- **Knowledge Base Training**: Upload PDFs or paste text directly into the admin panel to instantly embed and train the AI on your latest skills.
- **Project CMS**: Manage, edit, and reorder portfolio projects dynamically via PostgreSQL and Prisma ORM.
- **UploadThing**: Seamless image and cover art uploading for your project case studies.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Lucide React
- **3D Rendering**: Three.js, @react-three/fiber, @react-three/drei
- **AI / LLM**: Vercel AI SDK, LangChain, LangGraph, Google GenAI
- **Database**: PostgreSQL (Prisma), MongoDB (Vector Search)
- **Authentication**: NextAuth.js
- **File Uploads**: UploadThing
- **Emails**: Nodemailer

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- MongoDB Database (for Vector Search)
- UploadThing Account
- Google Gemini API Key (or OpenAI)

### 1. Clone & Install
```bash
git clone https://github.com/janaka99/portfolio5_0.git
cd portfolio5_0
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add the following keys:

```env
# Database
DATABASE_URL="postgresql://..."
MONGODB_URI="mongodb+srv://..."

# Auth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# AI
GOOGLE_API_KEY="your-gemini-key"

# UploadThing
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."

# Email (Nodemailer)
JANAKA_EMAIL="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### 3. Database Setup
Generate the Prisma client and push the schema to your PostgreSQL database:
```bash
npm run prisma:generate
npx prisma db push
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portfolio. Navigate to `/admin` to log in and start adding projects or training the AI.

## 📝 License
This project is open-sourced under the MIT License.
