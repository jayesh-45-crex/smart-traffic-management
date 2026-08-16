# Nagpur AI Traffic Command Center — Final

A browser-based traffic command-center prototype for Nagpur with public/police dashboards, map, camera views, rally mode and an API-backed traffic intelligence layer.

## Run the complete site

Use the bundled Python server so the website and JSON API work together:

```bash
python server.py
```

Open `http://127.0.0.1:8080/`.

The API is available at:

- `/api/health`
- `/api/traffic/summary`
- `/api/ai/analyze`
- `/api/junctions`

The server uses only Python's standard library, so the core site needs no pip packages.

## Authentication

Two modes are supported:

- **Demo/offline mode:** no Firebase credentials required.
- **Firebase mode:** populate `firebase-config.js`, enable Email/Password Authentication and create Firestore rules for the `users` collection.

Firebase client API keys are not server secrets. Never put a Firebase service-account JSON or private key in the frontend.

## AI / YOLO

The bundled API provides deterministic traffic analysis from the included junction dataset, so the demo does not depend on random values or a missing external service.

For real camera/video inference, install the optional packages:

```bash
pip install -r requirements.txt
```

Then add a production inference service around `AI/yolo11n.pt`. Keep model inference on the server; never expose the model-processing credentials or private infrastructure to the browser.

## Deployment

### Static frontend

The frontend can be hosted on Firebase Hosting, Vercel, Netlify, GitHub Pages, or another static host. Configure Firebase if real authentication is required.

### Full-stack demo

Run `server.py` on a Python host. The same process serves the website and `/api/*` endpoints.

### Production AI

For live CCTV/YOLO inference, deploy a separate HTTPS AI service and set the frontend API base to that service. Add authentication, CORS restrictions, rate limiting and secure camera credentials before public deployment.

## Project structure

- `index.html` — landing page
- `login.html` — authentication
- `public-dashboard.html` — public dashboard
- `police-dashboard.html` — police dashboard
- `map.html` — Nagpur junction map
- `cameras.html` — camera command network UI
- `ai-traffic.html` — AI traffic intelligence UI
- `rally-mode.html` — event/emergency mode
- `server.py` — website + API server
- `AI/` — YOLO/video assets
- `deta/` — canonical junction dataset
- `firebase-config.js` — Firebase Web App configuration
