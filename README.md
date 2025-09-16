# Magneto365 page clone

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/junio14245252626236s-projects/v0-magneto365-page-clone)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/UatbtJrc1lF)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/junio14245252626236s-projects/v0-magneto365-page-clone](https://vercel.com/junio14245252626236s-projects/v0-magneto365-page-clone)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/UatbtJrc1lF](https://v0.app/chat/projects/UatbtJrc1lF)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

---

## Added: Auth, Jobs & Chat (local dev)

This project now includes:
- Credentials auth with NextAuth + Prisma (SQLite in dev)
- Jobs minimal API and chat with persisted threads/messages

### Env
- Copy `.env.example` to `.env` and set a strong `NEXTAUTH_SECRET`.

### Prisma
- Run `npx prisma migrate dev` to apply schema
- Run `npx prisma studio` to browse data

### Jobs API
- GET `/api/jobs` -> list jobs
- POST `/api/jobs` -> create `{ title, company, location?, description }`

### Chat API
- POST `/api/chat` -> `{ text, threadId?, jobId? }` returns `{ threadId, messages }` and stores conversation

### Copilot API integration (placeholder)
The function `generateBotReply` in `app/api/chat/route.ts` is a stub. Replace it with a call to your Copilot (or any LLM) API and keep persisting the bot output as shown now.
