# Urban Flooding & Hydrology Engine (UFHE)

## Team Name & Affiliation
**Team Name:** [Meghalytics]
**Members:** [Deepakkumar Prajapati,Prateek Pandey,Tanishq Bhosale ]

## Problem Statement
Indian cities lose ₹15,000–50,000 Cr annually to urban flooding, with average response times ranging from 4 to 12 hours after waterlogging occurs. Currently, 70% of drainage infrastructure conditions remain unknown, pre-monsoon preparation is unstructured, and disaster response is reactive rather than data-driven. There is no unified spatial view of terrain, drainage, and predictive rainfall to identify micro-level vulnerabilities before chaos ensues.

## Solution
UFHE transforms urban flood management from a reactive crisis response to a proactive, data-driven prevention model. By combining a GIS Map Engine, real-time meteorological data (Open-Meteo), and micro-basin delineation, the engine acts as a living flood intelligence system. It assigns a Flood Vulnerability Index (FVI) to every 50m × 50m city patch and computes a Pre-Monsoon Readiness Score (PMRS) across wards, empowering civic authorities and engineers to pre-position resources hours before the rain starts.

## Architecture
The system employs a multi-tiered architecture:
- **Data Ingestion Layer:** Pulls real-time rainfall data (AWS, IMD, Open-Meteo API) and forecasts.
- **Processing & ML Engine:** Calculates Flood Vulnerability Index (FVI), runs physics-ML hybrid flood simulation, and computes hardware/team readiness (PMRS).
- **Core backend:** Node.js server (`server.js`) with an SQLite database for persistent tracking.
- **Presentation / GIS Layer:** An interactive Mapbox GL / Deck.gl web interface overlaying 3D terrain visualizations alongside real-time hotspots, actionable dashboards, and citizen alerts.

## Technology Used
- **Frontend:** Vanilla JavaScript (`app.js`), HTML5, CSS3 (Glassmorphism UI, Responsive Design)
- **Mapping & GIS:** Mapbox GL, Deck.gl
- **Backend:** Node.js, Express.js (`server.js`)
- **Database:** SQLite
- **APIs:** Open-Meteo API (for real-time and forecasted weather data)

## Feature / USP
- **Micro-level Predictability:** Generates a granular Flood Vulnerability Index at a 50x50m micro-basin level.
- **PMRS (Pre-Monsoon Readiness Score):** Quantifiable accountability metric for ward-level infrastructure readiness.
- **Physics-ML Hybrid Forecasting:** Shifts resource deployment from "gut-feel" to predictive action with 3+ hours lead time.
- **Immersive Glassmorphism UI:** Rain-slicked, refractive dynamic dashboard that offers "single-screen" clarity to commissioners and granular tools to engineers.

## References / Links
- **Weather Data:** [Open-Meteo API](https://open-meteo.com/)
- **Mapping:** [Mapbox](https://www.mapbox.com/), [Deck.gl](https://deck.gl/)
