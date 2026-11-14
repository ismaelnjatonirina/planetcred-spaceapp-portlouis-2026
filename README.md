# NASA Space Apps Port Louis 2026 — PlanetCred

PlanetCred is an Earth observation intelligence dashboard that brings community climate project records together with satellite imagery, environmental indicators, and verification milestones.

## Run locally

The app uses a small Node.js server for local username/password authentication and serving the dashboard. Node.js 20 or newer is recommended.

1. Copy `.env.example` to `.env`.
2. Edit `.env` and set your own `PLANETCRED_USERNAME` and a unique `PLANETCRED_PASSWORD` of at least 12 characters. Keep `.env` private; it is excluded from Git.
3. Install the build tools and compile the production CSS:

```bash
npm install
npm run build
```

4. Start the app:

```bash
npm start
```

5. Open [http://127.0.0.1:8000](http://127.0.0.1:8000). You will be sent to the login page first, then to the dashboard after signing in.

New users can select **Sign Up** on the login page. Accounts are stored locally in `.auth/accounts.json`; passwords are stored as salted scrypt hashes, never as plain text. The `.auth/` folder is excluded from Git. Use a username of 3–32 letters, numbers, dots, underscores, or hyphens and a password of at least 12 characters.

Do not use Live Server or `python -m http.server` for the authenticated app: those static servers do not run the authentication API. The dashboard uses Leaflet, Chart.js, Tailwind CSS, and online map imagery from CDNs, so an internet connection is needed for those services.

Python analysis dependencies are listed in `requirements.txt`. Install them when working with the data analysis scripts:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

## Deploy to Vercel

This repository builds a small static site into `dist/`. Vercel serves the HTML, compiled Tailwind CSS, JavaScript, imagery, and JSON records from its CDN. The build does not query NASA or Earth Engine, so deploys remain quick and do not require Python or Earth Engine credentials. NASA POWER and OpenStreetMap requests on the Waste Management page remain live browser requests.

Authentication uses Vercel Functions in `api/`, a signed HTTP-only session cookie, and a Neon PostgreSQL table for sign-up accounts. Vercel's filesystem is not used for account storage.

1. Import this GitHub repository into Vercel. Keep the project root as the Root Directory. `vercel.json` already selects `npm run build` and the `dist` output directory.
2. Add a Neon Postgres database from the Vercel Marketplace and make its connection string available to the project as `DATABASE_URL` for Production, Preview, and Development as needed.
3. In the Neon SQL editor, run `migrations/001_accounts.sql` once. The API can also create the table on first account use.
4. In Vercel Project Settings → Environment Variables, set:
   - `DATABASE_URL`: the Neon connection string.
   - `PLANETCRED_USERNAME`: the administrator username.
   - `PLANETCRED_PASSWORD`: the administrator password (at least 12 characters).
   - `PLANETCRED_SESSION_SECRET`: a private random value of at least 32 characters. Generate one with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`.
5. Deploy the `main` branch. Every later push to the production branch triggers a new deployment when Git is connected.
6. Open the deployment URL, sign in with the administrator credentials, create a test account through **Sign Up**, then verify the dashboard, projects page, Waste Management data, map, and charts.

Never commit `.env`, database connection strings, or production passwords. The Vercel account email alone does not grant deployment access; import the repository from a signed-in Vercel session. Static analysis JSON is cached briefly at the CDN, while versioned imagery and CSS use longer CDN caching to keep dashboard loads fast.
