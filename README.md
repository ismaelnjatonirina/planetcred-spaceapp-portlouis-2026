# NASA Space Apps Port Louis 2026 — PlanetCred

PlanetCred is a public Earth observation dashboard that brings community climate project records together with satellite imagery, environmental indicators, and verification milestones.

## Run locally

The dashboard is public and does not require an account. Node.js 20 or newer is recommended.

```bash
npm install
npm run build
npm start
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). Leaflet, Chart.js, Tailwind CSS, and online map imagery use external services, so an internet connection is needed for those features.

Python analysis dependencies are listed in `requirements.txt`:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

## Deploy to Vercel

This repository builds a static site into `dist/`. Vercel serves the HTML, compiled Tailwind CSS, JavaScript, imagery, and JSON records from its CDN. The build does not query NASA or Earth Engine, so deploys remain quick and do not require Python or Earth Engine credentials. NASA POWER and OpenStreetMap requests on the Waste Management page remain live browser requests.

1. Import this GitHub repository into Vercel and keep the project root as the Root Directory. `vercel.json` selects `npm run build` and the `dist` output directory.
2. Deploy the `main` branch. Later pushes to the production branch trigger new deployments when Git is connected.
3. Open the deployment URL and verify the dashboard, projects page, Waste Management data, map, and charts.

Static analysis JSON is cached briefly at the CDN, while versioned imagery and CSS use longer CDN caching to keep dashboard loads fast.
