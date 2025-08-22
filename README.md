# Acerta IA — Next.js 15

## Rodar local
```bash
npm i
npm run dev
# http://localhost:3000
```

## Deploy Vercel
1. Suba para um repositório (GitHub/GitLab/Bitbucket).
2. Na Vercel: Import Project → selecione o repo → Deploy.

Variáveis (opcional):
- `NEXT_PUBLIC_API_URL=https://seu-backend.com` (se vazio, usa as rotas locais `/api`).

## Endpoints
- `GET/POST /api/agents`
- `GET/PUT/DELETE /api/agents/:id`
- `GET/POST /api/teams`
- `GET/PUT/DELETE /api/teams/:id`
