# 0RB SYSTEM - Deployment Guide

## 🚀 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/miKeDroP-JB/BlkFryday&root-directory=web&project-name=orb-system&repository-name=orb-system)

## Manual Deploy Steps

### Vercel (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `miKeDroP-JB/BlkFryday`
3. Set **Root Directory** to `web`
4. Deploy!

### Netlify
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag & drop the `web` folder
3. Done!

### Railway
```bash
railway login
railway init
railway up
```

## Environment Variables (Optional)

For full AI functionality, add these in your deployment settings:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key for GPT-4 |
| `ANTHROPIC_API_KEY` | Your Anthropic API key for Claude |

Without these, the system runs in **Demo Mode** with intelligent mock responses.

## After Deployment

Your live 0RB SYSTEM will be at:
- `https://your-project.vercel.app`
- `https://your-project.netlify.app`

### API Endpoints Available:
- `/api/status` - System health
- `/api/agents` - Agent management
- `/api/chat` - AI conversations
- `/api/games` - Game sessions

## Local Development

```bash
cd web
npm install
npm run dev
```

Visit `http://localhost:3000`

---

**EVERYBODY EATS** 🌐
