# NASA Space Apps Port Louis 2026 — PlanetCred

PlanetCred is an Earth observation intelligence dashboard that brings community climate project records together with satellite imagery, environmental indicators, and verification milestones.

## Run locally

The app uses a small Node.js server for username/password authentication and to serve the dashboard. Node.js 18 or newer is recommended; no npm packages are needed.

1. Copy `.env.example` to `.env`.
2. Edit `.env` and set your own `PLANETCRED_USERNAME` and a unique `PLANETCRED_PASSWORD` of at least 12 characters. Keep `.env` private; it is excluded from Git.
3. Start the app:

```bash
node server.js
```

4. Open [http://127.0.0.1:8000](http://127.0.0.1:8000). You will be sent to the login page first, then to the dashboard after signing in.

New users can select **Sign Up** on the login page. Accounts are stored locally in `.auth/accounts.json`; passwords are stored as salted scrypt hashes, never as plain text. The `.auth/` folder is excluded from Git. Use a username of 3–32 letters, numbers, dots, underscores, or hyphens and a password of at least 12 characters.

Do not use Live Server or `python -m http.server` for the authenticated app: those static servers do not run the authentication API. The dashboard uses Leaflet, Chart.js, Tailwind CSS, and online map imagery from CDNs, so an internet connection is needed for those services.

Python analysis dependencies are listed in `requirements.txt`. Install them when working with the data analysis scripts:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```
