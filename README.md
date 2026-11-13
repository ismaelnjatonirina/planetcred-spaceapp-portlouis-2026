# NASA Space Apps Port Louis 2026 — PlanetCred

PlanetCred is an Earth observation intelligence dashboard that brings community climate project records together with satellite imagery, environmental indicators, and verification milestones.

## Run locally

The interface is a static HTML/CSS/JavaScript site. From this directory, start a local web server so the browser can load the project data files:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). The dashboard uses Leaflet, Chart.js, and Tailwind CSS from CDNs, so an internet connection is needed for those libraries and map tiles.

Python analysis dependencies are listed in `requirements.txt`. Install them when working with the data analysis scripts:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```
