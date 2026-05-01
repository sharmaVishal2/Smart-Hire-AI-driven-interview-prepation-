# SmartHire - AI Resume Driven Interview Platform

SmartHire is a full-stack web application that turns a candidate resume into a personalized AI interview. Users can register, upload a PDF resume, generate resume-specific technical questions, answer them in an interview flow, and review scored feedback and history.

This repository was migrated from the old Smart Career Assistant project to SmartHire while keeping the same GitHub project and backend service naming.

## Features

- Secure register/login with Spring Security and JWT
- PDF resume upload and text extraction with Apache Tika
- Resume-context prompt building for RAG-inspired question generation
- Groq/OpenAI-compatible LLM integration using the existing `GROQ_API_KEY`
- Real-time interview flow with STOMP over SockJS
- AI answer evaluation with score and feedback
- Interview history and dashboard analytics
- React protected routes, loading states, timer, and browser speech-to-text

## Tech Stack

- Backend: Spring Boot 3, Spring Security, JWT, Spring Data JPA, PostgreSQL, WebSockets, Apache Tika
- Frontend: React, Vite, Tailwind CSS, Axios, SockJS, STOMP
- Database: PostgreSQL, tested with Neon Postgres
- AI: Groq chat completions API, OpenAI-compatible request format

## Project Structure

```text
.
|-- src/                 Spring Boot backend
|-- frontend/            React + Vite frontend
|-- pom.xml              Backend Maven config
|-- render.yaml          Render backend deployment config
|-- Dockerfile           Backend Docker image
|-- .env.example         Backend environment template
`-- README.md
```

## Backend Environment

Create environment variables from `.env.example`.

```properties
DATABASE_URL=jdbc:postgresql://localhost:5432/smarthire
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=change-this-development-secret-change-this-development-secret
JWT_EXPIRATION_MINUTES=1440
FRONTEND_URL=http://localhost:5173
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-8b-instant
GROQ_URL=https://api.groq.com/openai/v1/chat/completions
```

For Neon, use the JDBC URL format:

```properties
DATABASE_URL=jdbc:postgresql://your-neon-host/your-db?sslmode=require
DATABASE_USERNAME=your_neon_user
DATABASE_PASSWORD=your_neon_password
```

Do not enable Neon Auth. SmartHire uses its own JWT auth.

## Run Locally

Start the backend:

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Deployment

### Backend on Render

The `render.yaml` keeps the old backend service name:

```text
smart-career-assistant-backend
```

Set these Render environment variables:

```properties
DATABASE_URL=jdbc:postgresql://your-neon-host/smarthire?sslmode=require
DATABASE_USERNAME=your_neon_user
DATABASE_PASSWORD=your_neon_password
JWT_SECRET=use-a-long-random-secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.1-8b-instant
GROQ_URL=https://api.groq.com/openai/v1/chat/completions
```

### Frontend on Vercel

Deploy from the `frontend` directory and set:

```properties
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `PUT /api/users/me`
- `POST /api/resumes`
- `GET /api/resumes`
- `POST /api/interviews/start`
- `POST /api/interviews/{id}/answers`
- `GET /api/interviews`
- `GET /api/interviews/{id}`
- `GET /api/interviews/stats`
- WebSocket endpoint: `/ws`
- WebSocket app destination: `/app/interviews/{id}/answers`
- WebSocket topic: `/topic/interviews/{id}`

## Database Tables

Hibernate creates these tables:

- `users`
- `resumes`
- `interviews`
- `questions`
- `answers`
- `scores`

## Verification

```bash
mvn test
cd frontend
npm run build
```

## Security Notes

- Never commit `.env`, API keys, database passwords, or Render/Vercel secrets.
- Rotate any secret that has been pasted into chat or logs.
- Use a long random `JWT_SECRET` in production.
