Deployment checklist and quick steps

Overview
- Backend: Node.js Express app in /backend
- Frontend: Next.js app in /frontend (or root depending on your setup)

Environment variables (backend)
- DATABASE_URL - Postgres connection string
- JWT_SECRET - secret for signing JWT tokens
- NODE_ENV - production
- PORT - optional, default 5000
- Optional: CLOUDINARY_URL or individual CLOUDINARY_* keys if using Cloudinary

Render (backend) quick guide
1. Create a new Web Service on Render (or Heroku). Connect your GitHub repository and choose the backend folder.
2. Build & Start Command: `npm install && npm run start` (Render will run from backend/; ensure "Root Directory" is set if your repo has both frontend/backend)
3. Set environment variables in the Render dashboard (DATABASE_URL, JWT_SECRET, etc.).
4. Add a health check endpoint: GET /api/health (the app already responds on /api if available). Configure Render health check to use /api/health.
5. Run migrations: connect to the Render shell and run `psql $DATABASE_URL -f backend/migrations.sql`, or run the migrations with your preferred runner.

Vercel (frontend) quick guide
1. Import the repo into Vercel and set the frontend folder (or root) as the project root containing package.json for the Next app.
2. Set environment variables for the frontend: NEXT_PUBLIC_API_URL set to the deployed backend URL.
3. Deploy. Vercel will build the Next app automatically.

Post-deploy
- Verify CORS: ensure backend CORS allows the frontend origin.
- Update environment variables for production readiness (do not use ssl.rejectUnauthorized:false in production without validating the cert chain).
- Optionally set up CI with GitHub Actions to run smoke tests on deploy preview or main branch. See the CI snippet below to add as .github/workflows/ci.yml (requires repository secrets DATABASE_URL and JWT_SECRET):

```yaml
name: CI - Smoke Test
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  smoke-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install backend deps
        working-directory: ./backend
        run: npm ci
      - name: Start backend
        working-directory: ./backend
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
        run: |
          npm start &
          for i in {1..20}; do
            if curl -sS http://localhost:5000/api/health; then break; fi
            sleep 2
          done
      - name: Run smoke test
        working-directory: ./backend
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
        run: npm run smoke-test
```



Running local smoke test
From the repo root, start backend (cd backend && npm install && npm start) and then run `npm run smoke-test` inside backend to run the included smoke test.

Notes
- Do not commit secrets. Set them in host provider UI.
- Consider adding express-rate-limit and helmet for production hardening.
