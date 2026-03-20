// ═══════════════════════════════════════════════
// UFHE — Main Application
// ═══════════════════════════════════════════════

import {
    WARD_DATA, HOTSPOT_DATA, DRAINAGE_DATA, PIPELINE_SEGMENTS, SLOPE_DATA,
    ALERTS_DATA, ACTION_ITEMS, COMPLAINTS_DATA, COMPLAINT_TYPES, CONDITION_COLORS,
    getPMRSComponents, SEVERITY_COLORS, GRADE_COLORS, ALERT_COLORS, MUMBAI_CENTER,
    MICRO_BASIN_FEATURE_COLLECTION
} from '../data/mumbai-data.js';

import {
    fetchCurrentWeather, fetchForecast, fetchHistoricalRainfall,
    fetchLast10MonthsRainfall, computeMonthlySummaries,
    fetchElevation, reverseGeocode,
    getWeatherDescription, getWeatherEmoji, formatMonthName,
    generateWeatherAlerts
} from './weather-api.js';

// ─── State ──────────────────────────────────
let currentPage = 'dashboard';
let weatherData = null;
let forecastData = null;
let liveAlerts = []; // Dynamic alerts from live weather
let dashMap = null;
let explorerMap = null;
let mapMarkers = [];
let deckglOverlay = null; // Deck.gl reference

// ─── Navigation ─────────────────────────────
function initNavigation() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });
}

function navigateTo(page) {
    currentPage = page;
    // Update nav
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');
    // Update pages
    document.querySelectorAll('.page').forEach(el => el.classList.add('page-hidden'));
    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) {
        pageEl.classList.remove('page-hidden');
        pageEl.classList.add('animate-in');
    }
    // Update topbar title
    const titles = {
        dashboard: ['Dashboard', 'City-wide flood intelligence overview'],
        map: ['Map Explorer', 'Interactive GIS map with layers'],
        hotspots: ['Flood Hotspots', 'Vulnerability analysis & ranking'],
        readiness: ['Pre-Monsoon Readiness', 'PMRS ward scorecards'],
        drainage: ['Drainage & Pipelines', 'Pipeline network with slope & flow analysis'],
        rainfall: ['Rainfall Analysis', 'Current, forecast & historical'],
        alerts: ['Alerts & Operations', 'Active alerts and response'],
        citizen: ['Citizen Reporting', 'Public complaints — blockages, overflow & waterlogging'],
        scenario: ['Scenario Simulator', 'What-if rainfall flood prediction'],
        analytics: ['Analytics', 'Trends and reporting'],
        admin: ['Administration', 'System configuration'],
    };
    const [title, subtitle] = titles[page] || ['UFHE', ''];
    document.getElementById('topbar-title').textContent = title;
    document.getElementById('topbar-subtitle').textContent = subtitle;

    // Initialize page-specific content
    if (page === 'map') initExplorerMap();
    if (page === 'rainfall') renderRainfallPage();
    if (page === 'hotspots') renderHotspotsPage();
    if (page === 'drainage') renderDrainagePage();
    if (page === 'citizen') renderCitizenPage();
}

// ─── Dashboard ──────────────────────────────
async function renderDashboard() {
    // Metric cards
    const totalHotspots = HOTSPOT_DATA.length;
    const veryHighCount = HOTSPOT_DATA.filter(h => h.severity === 'VERY_HIGH').length;
    const avgPMRS = Math.round(WARD_DATA.reduce((s, w) => s + w.pmrs, 0) / WARD_DATA.length);

    document.getElementById('metric-hotspots').textContent = totalHotspots;
    document.getElementById('metric-hotspots-sub').innerHTML = `<span class="metric-change-up">🔴 ${veryHighCount} Very High</span>`;
    document.getElementById('metric-pmrs').textContent = `${avgPMRS}/100`;
    const avgGrade = avgPMRS >= 80 ? 'A' : avgPMRS >= 60 ? 'B' : avgPMRS >= 40 ? 'C' : 'D';
    document.getElementById('metric-pmrs-sub').innerHTML = `Grade: <strong style="color:${GRADE_COLORS[avgGrade]}">${avgGrade}</strong>`;

    // Load live weather
    weatherData = await fetchCurrentWeather();
    forecastData = await fetchForecast();

    if (weatherData?.current) {
        const c = weatherData.current;
        document.getElementById('metric-rainfall').textContent = `${c.precipitation || 0} mm/hr`;
        document.getElementById('metric-rainfall-sub').innerHTML =
            `${getWeatherEmoji(c.weather_code)} ${getWeatherDescription(c.weather_code)}`;
    } else {
        document.getElementById('metric-rainfall').textContent = '—';
        document.getElementById('metric-rainfall-sub').textContent = 'API loading...';
    }

    // Generate dynamic alerts from live weather data
    liveAlerts = generateWeatherAlerts(weatherData, forecastData, HOTSPOT_DATA);
    const activeAlerts = liveAlerts.filter(a => a.level !== 'GREEN').length;
    document.getElementById('metric-alerts').textContent = activeAlerts;
    document.getElementById('metric-alerts-sub').innerHTML = liveAlerts.filter(a => a.level !== 'GREEN')
        .map(a => `<span style="color:${ALERT_COLORS[a.level]}">●</span>`).join(' ') || '<span style="color:var(--accent-green)">✓ All clear</span>';

    // Update alert banner with live info
    updateAlertBanner();

    // Ward Rankings
    renderWardRankings();
    // Alerts feed
    renderAlertsFeed();
    // Action items
    renderActionItems();
    // Mini map
    initDashMap();
    // Render alerts page content
    renderAlertsPage();
}

function renderWardRankings() {
    const sorted = [...WARD_DATA].sort((a, b) => b.pmrs - a.pmrs);
    const tbody = document.getElementById('ward-rankings-body');
    tbody.innerHTML = sorted.map((w, i) => {
        const color = GRADE_COLORS[w.grade];
        return `<tr>
      <td style="color:var(--text-muted);font-family:var(--font-mono)">${i + 1}</td>
      <td><span style="font-weight:500">${w.code}</span> <span style="color:var(--text-muted);font-size:11px">${w.name.split('(')[1]?.replace(')', '') || ''}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="score-bar"><div class="score-bar-fill" style="width:${w.pmrs}%;background:${color}"></div></div>
          <span style="font-family:var(--font-mono);font-size:12px;min-width:28px">${w.pmrs}</span>
        </div>
      </td>
      <td><span class="grade-badge" style="background:${color}22;color:${color}">${w.grade}</span></td>
    </tr>`;
    }).join('');
}

function updateAlertBanner() {
    const banner = document.querySelector('.alert-banner');
    if (!banner) return;
    const topAlert = liveAlerts[0];
    if (!topAlert) return;
    const precip = weatherData?.current?.precipitation || 0;
    const weatherCode = weatherData?.current?.weather_code || 0;
    const emoji = getWeatherEmoji(weatherCode);
    const desc = getWeatherDescription(weatherCode);
    const bannerColor = ALERT_COLORS[topAlert.level] || 'var(--accent-green)';
    banner.querySelector('.status-alive').style.background = bannerColor;
    banner.querySelector('span:nth-child(2)').innerHTML = `<strong>Mumbai Weather:</strong> ${emoji} ${desc} — ${precip > 0 ? `Precipitation: ${precip.toFixed(1)} mm/hr` : 'No rainfall detected'}. ${topAlert.level !== 'GREEN' ? topAlert.title : 'All systems nominal.'}`;
}

function renderAlertsFeed() {
    const container = document.getElementById('alerts-feed');
    if (!container) return;
    const alertsToShow = liveAlerts.length > 0 ? liveAlerts : ALERTS_DATA;
    container.innerHTML = alertsToShow.map(a => `
    <div class="alert-item">
      <div class="alert-dot" style="background:${ALERT_COLORS[a.level]}"></div>
      <div class="alert-content">
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.message}</div>
      </div>
      <div class="alert-time">${a.time}</div>
    </div>
  `).join('');
}

function renderActionItems() {
    const container = document.getElementById('action-items-list');
    container.innerHTML = ACTION_ITEMS.map(a => {
        const priorityTag = a.priority === 1 ? 'P0' : `P${a.priority - 1}`;
        const pClass = a.priority === 1 ? 'priority-p0' : 'priority-p1';

        let progress = 0;
        let pColor = 'var(--bg-elevated)';
        if (a.status === 'DONE') { progress = 100; pColor = 'var(--accent-green)'; }
        else if (a.status === 'IN_PROGRESS') { progress = 50; pColor = 'var(--accent-blue)'; }
        else if (a.status === 'BEHIND') { progress = 25; pColor = 'var(--accent-red)'; }

        // Create conic gradient for the ring
        const ringStyle = `background: conic-gradient(${pColor} ${progress}%, var(--border-default) 0);`;

        return `
      <div class="action-card">
        <div class="action-card-header">
          <div class="action-card-title">${a.desc}</div>
          <div class="priority-tag ${pClass}">${priorityTag}</div>
        </div>
        <div class="action-card-meta">
          <span>📍 Ward ${a.ward}</span>
          <span>👤 ${a.assignee}</span>
        </div>
        <div class="action-card-footer">
          <div style="font-size:11px;color:var(--text-muted)">📅 Due: <span style="color:var(--text-primary)">${a.due}</span></div>
          <div class="progress-ring-container" title="Status: ${a.status.replace('_', ' ')}">
            <div class="progress-ring" style="${ringStyle}"></div>
            <div class="progress-ring-inner">${progress}%</div>
          </div>
        </div>
      </div>
    `;
    }).join('');
}

// ─── Dashboard Mini Map ─────────────────────
function initDashMap() {
    if (dashMap) return;
    dashMap = L.map('dashMap', {
        center: [MUMBAI_CENTER.lat, MUMBAI_CENTER.lng],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
    }).addTo(dashMap);

    // Add hotspot markers
    HOTSPOT_DATA.forEach(h => {
        const color = SEVERITY_COLORS[h.severity];
        const circle = L.circleMarker([h.lat, h.lng], {
            radius: 4 + h.fvi * 6,
            fillColor: color,
            fillOpacity: 0.7,
            color: color,
            weight: 1,
            opacity: 0.9,
        }).addTo(dashMap);
        circle.bindTooltip(`<strong>${h.name}</strong><br>FVI: ${h.fvi} | ${h.severity}`, { className: 'map-tooltip' });
    });

    setTimeout(() => dashMap.invalidateSize(), 450);
}

// ─── Explorer Map ───────────────────────────
function initExplorerMap() {
    if (explorerMap) {
        setTimeout(() => explorerMap.invalidateSize(), 450);
        return;
    }
    explorerMap = L.map('explorerMap', {
        center: [MUMBAI_CENTER.lat, MUMBAI_CENTER.lng],
        zoom: 12,
        zoomControl: true,
        attributionControl: true,
    });

    // Base layers
    const lightTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 18, attribution: '© CARTO' });
    const streetTile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OSM' });
    const topoTile = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '© OpenTopoMap' });

    lightTile.addTo(explorerMap);

    // Layer control
    const baseMaps = { "Light": lightTile, "Street": streetTile, "Terrain": topoTile };
    L.control.layers(baseMaps).addTo(explorerMap);

    // Add hotspot markers
    const hotspotLayer = L.layerGroup();
    HOTSPOT_DATA.forEach(h => {
        const color = SEVERITY_COLORS[h.severity];
        const marker = L.circleMarker([h.lat, h.lng], {
            radius: 5 + h.fvi * 8,
            fillColor: color,
            fillOpacity: 0.6,
            color: color,
            weight: 2,
            opacity: 0.9,
        });
        marker.bindPopup(`
      <div style="font-family:Inter,sans-serif;font-size:13px;min-width:180px">
        <strong style="font-size:14px">${h.name}</strong><br>
        <span style="color:#888">Code: ${h.code} | Ward: ${h.ward}</span>
        <hr style="border:0;border-top:1px solid #ddd;margin:6px 0">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">
          <div>FVI: <strong>${h.fvi}</strong></div>
          <div>Severity: <strong style="color:${color}">${h.severity.replace('_', ' ')}</strong></div>
          <div>Depth: <strong>${h.depth}cm</strong></div>
          <div>Deficit: <strong>${h.deficit}%</strong></div>
          <div>Pop: <strong>${h.pop.toLocaleString()}</strong></div>
          <div>History: <strong>${h.history} events</strong></div>
        </div>
      </div>
    `);
        marker.addTo(hotspotLayer);
    });
    hotspotLayer.addTo(explorerMap);

    // Add micro-basins layer
    const microBasinLayer = L.geoJSON(MICRO_BASIN_FEATURE_COLLECTION, {
        style: function (feature) {
            const color = SEVERITY_COLORS[feature.properties.severity];
            return {
                fillColor: color,
                fillOpacity: 0.1,
                color: '#0ea5e9', // Hydrology Blue thin lines
                weight: 1,
                opacity: 0.6
            };
        },
        onEachFeature: function (feature, layer) {
            layer.on({
                mouseover: function (e) {
                    const l = e.target;
                    l.setStyle({ fillOpacity: 0.25, weight: 2, color: '#0284c7' });
                    l.bringToFront();
                },
                mouseout: function (e) {
                    microBasinLayer.resetStyle(e.target);
                }
            });
            const props = feature.properties;
            layer.bindTooltip(`<strong>Micro-Basin: ${props.name}</strong><br>Avg FVI: ${props.fvi}`, { className: 'map-tooltip' });
        }
    });

    // Layer toggles
    setupLayerToggles(hotspotLayer, microBasinLayer);

    setTimeout(() => explorerMap.invalidateSize(), 450);
}

function setupLayerToggles(hotspotLayer, microBasinLayer) {
    document.getElementById('layer-hotspots')?.addEventListener('change', (e) => {
        if (e.target.checked) explorerMap.addLayer(hotspotLayer);
        else explorerMap.removeLayer(hotspotLayer);
    });

    document.getElementById('layer-microbasins')?.addEventListener('change', (e) => {
        if (e.target.checked) explorerMap.addLayer(microBasinLayer);
        else explorerMap.removeLayer(microBasinLayer);
    });

    // 3D Terrain Toggle
    document.getElementById('layer-3d')?.addEventListener('change', (e) => {
        toggleDeckGLTerrain(e.target.checked);
    });
}

// ─── Deck.gl 3D Terrain ─────────────────────
function toggleDeckGLTerrain(enable) {
    const canvas = document.getElementById('deck-canvas');
    if (!canvas) return;

    if (enable) {
        canvas.style.pointerEvents = 'auto'; // enable interaction
        // Hide leaflet panes for better 3D experience
        document.querySelector('.leaflet-pane.leaflet-map-pane').style.opacity = '0.3';

        if (!deckglOverlay) {
            // First time init
            const { Deck, OrthographicView } = deck;
            const { TerrainLayer } = deck;
            const { TileLayer } = deck;

            deckglOverlay = new Deck({
                canvas: 'deck-canvas',
                initialViewState: {
                    longitude: MUMBAI_CENTER.lng,
                    latitude: MUMBAI_CENTER.lat,
                    zoom: 11,
                    pitch: 60,
                    bearing: 0,
                    maxPitch: 89
                },
                controller: true,
                layers: [
                    new TerrainLayer({
                        id: 'terrain-layer',
                        elevationDecoder: {
                            rScaler: 256,
                            gScaler: 1,
                            bScaler: 1 / 256,
                            offset: -32768
                        },
                        elevationData: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
                        texture: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                        maxZoom: 14,
                        color: [255, 255, 255]
                    })
                ],
                onViewStateChange: ({ viewState }) => {
                    // Sync leaflet map subtly, mostly visual
                    explorerMap.setView([viewState.latitude, viewState.longitude], viewState.zoom, { animate: false });
                }
            });
        }
    } else {
        canvas.style.pointerEvents = 'none';
        document.querySelector('.leaflet-pane.leaflet-map-pane').style.opacity = '1';
        if (deckglOverlay) {
            deckglOverlay.finalize();
            deckglOverlay = null; // Clean up canvas context
        }
    }
}

// ─── Hotspots Page ──────────────────────────
function renderHotspotsPage() {
    const tbody = document.getElementById('hotspots-table-body');
    if (!tbody) return;
    const sorted = [...HOTSPOT_DATA].sort((a, b) => b.fvi - a.fvi);
    tbody.innerHTML = sorted.map((h, i) => {
        const color = SEVERITY_COLORS[h.severity];
        const sevLabel = h.severity.replace('_', ' ');
        return `<tr>
      <td style="font-family:var(--font-mono);color:var(--text-muted)">${i + 1}</td>
      <td style="font-weight:500">${h.name}</td>
      <td style="font-family:var(--font-mono)">${h.code}</td>
      <td>${h.ward}</td>
      <td style="font-family:var(--font-mono);font-weight:600">${h.fvi.toFixed(2)}</td>
      <td><span class="severity-badge" style="background:${color}22;color:${color}">${sevLabel}</span></td>
      <td style="font-family:var(--font-mono)">${h.depth} cm</td>
      <td style="font-family:var(--font-mono)">${h.deficit}%</td>
      <td style="font-family:var(--font-mono)">${h.pop.toLocaleString()}</td>
      <td style="font-family:var(--font-mono)">${h.history}</td>
    </tr>`;
    }).join('');

    // Stats
    document.getElementById('hs-total').textContent = HOTSPOT_DATA.length;
    document.getElementById('hs-very-high').textContent = HOTSPOT_DATA.filter(h => h.severity === 'VERY_HIGH').length;
    document.getElementById('hs-high').textContent = HOTSPOT_DATA.filter(h => h.severity === 'HIGH').length;
    document.getElementById('hs-moderate').textContent = HOTSPOT_DATA.filter(h => h.severity === 'MODERATE').length;
    document.getElementById('hs-low').textContent = HOTSPOT_DATA.filter(h => h.severity === 'LOW').length;
}

// ─── Readiness (PMRS) Page ──────────────────
function renderReadinessPage() {
    const container = document.getElementById('pmrs-ward-cards');
    if (!container) return;
    const sorted = [...WARD_DATA].sort((a, b) => b.pmrs - a.pmrs);
    container.innerHTML = sorted.map(w => {
        const comp = getPMRSComponents(w);
        const color = GRADE_COLORS[w.grade];
        return `
      <div class="card" style="margin-bottom:var(--space-sm)">
        <div style="padding:var(--space-md) var(--space-lg);display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-weight:600;font-size:14px">${w.code} — ${w.name.match(/\(([^)]+)\)/)?.[1] || w.name}</div>
            <div style="font-size:11px;color:var(--text-muted)">${w.zone} Zone · ${w.area} km² · Pop: ${w.pop.toLocaleString()}</div>
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-md)">
            <div style="text-align:right">
              <div style="font-size:24px;font-weight:700;font-family:var(--font-mono);color:${color}">${w.pmrs}</div>
              <div style="font-size:10px;color:var(--text-muted)">/ 100</div>
            </div>
            <span class="grade-badge" style="background:${color}22;color:${color};width:32px;height:32px;font-size:14px">${w.grade}</span>
          </div>
        </div>
        <div style="padding:0 var(--space-lg) var(--space-md);display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-sm)">
          ${renderComponentBar('Infrastructure', comp.infrastructure, 30)}
          ${renderComponentBar('Vulnerability', comp.vulnerability, 25)}
          ${renderComponentBar('Response', comp.response, 25)}
          ${renderComponentBar('Historical', comp.historical, 20)}
        </div>
      </div>
    `;
    }).join('');
}

function renderComponentBar(label, value, weight) {
    const color = value >= 70 ? 'var(--accent-green)' : value >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)';
    return `
    <div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-bottom:3px">
        <span>${label} (${weight}%)</span>
        <span style="font-family:var(--font-mono);color:var(--text-secondary)">${value}</span>
      </div>
      <div class="score-bar"><div class="score-bar-fill" style="width:${value}%;background:${color}"></div></div>
    </div>
  `;
}

let rainfallPulseInterval;

// ─── Rainfall Page ──────────────────────────
async function renderRainfallPage() {
    if (!weatherData) weatherData = await fetchCurrentWeather();
    if (!forecastData) forecastData = await fetchForecast();

    const parentCard = document.getElementById('rain-condition')?.closest('.card');
    if (parentCard && !rainfallPulseInterval) {
        // Start 15-second "live pulse" sync simulation
        rainfallPulseInterval = setInterval(() => {
            parentCard.classList.add('aws-sync-pulse');
            setTimeout(() => parentCard.classList.remove('aws-sync-pulse'), 1000);

            // Randomly jiggle humidity or temp to simulate live data
            if (weatherData?.current) {
                const c = weatherData.current;
                const newHum = Math.max(0, Math.min(100, Math.round(c.relative_humidity_2m + (Math.random() * 2 - 1))));
                document.getElementById('rain-humidity').textContent = `${newHum}%`;
            }
        }, 15000);
    }

    // Current conditions
    if (weatherData?.current) {
        const c = weatherData.current;
        document.getElementById('rain-temp').textContent = `${Math.round(c.temperature_2m)}°C`;
        document.getElementById('rain-humidity').textContent = `${c.relative_humidity_2m}%`;
        document.getElementById('rain-precip').textContent = `${c.precipitation} mm/hr`;
        document.getElementById('rain-wind').textContent = `${Math.round(c.wind_speed_10m)} km/h`;
        document.getElementById('rain-pressure').textContent = `${Math.round(c.surface_pressure)} hPa`;
        document.getElementById('rain-condition').textContent = `${getWeatherEmoji(c.weather_code)} ${getWeatherDescription(c.weather_code)}`;
    }

    // Forecast
    if (forecastData?.daily) {
        const d = forecastData.daily;
        const forecastContainer = document.getElementById('forecast-list');
        if (forecastContainer) {
            forecastContainer.innerHTML = d.time.map((date, i) => {
                const emoji = getWeatherEmoji(d.weather_code[i]);
                const precip = d.precipitation_sum[i];
                const maxT = Math.round(d.temperature_2m_max[i]);
                const minT = Math.round(d.temperature_2m_min[i]);
                const prob = d.precipitation_probability_max[i];
                const dayName = new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
                return `
          <div style="background:var(--bg-secondary);border-radius:var(--radius-sm);padding:var(--space-md);text-align:center">
            <div style="font-size:11px;color:var(--text-muted)">${dayName}</div>
            <div style="font-size:24px;margin:6px 0">${emoji}</div>
            <div style="font-family:var(--font-mono);font-size:13px">${maxT}° / ${minT}°</div>
            <div style="font-size:11px;color:var(--accent-blue);margin-top:4px">💧 ${precip} mm</div>
            <div style="font-size:10px;color:var(--text-muted)">${prob}% chance</div>
          </div>
        `;
            }).join('');
        }
    }

    // Render hourly precipitation chart
    if (forecastData?.hourly) renderHourlyChart(forecastData.hourly);
}

function renderHourlyChart(hourly) {
    const canvas = document.getElementById('hourlyChart');
    if (!canvas || !window.Chart) return;

    const ctx = canvas.getContext('2d');
    const next24 = hourly.time.slice(0, 48);
    const precip = hourly.precipitation.slice(0, 48);
    const labels = next24.map(t => {
        const d = new Date(t);
        return d.getHours() + ':00';
    });

    if (window.hourlyChartInstance) window.hourlyChartInstance.destroy();

    window.hourlyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Precipitation (mm)',
                data: precip,
                backgroundColor: precip.map(v => v > 10 ? '#ef444488' : v > 5 ? '#f9731688' : v > 2 ? '#eab30888' : '#6395ff44'),
                borderColor: precip.map(v => v > 10 ? '#ef4444' : v > 5 ? '#f97316' : v > 2 ? '#eab308' : '#6395ff'),
                borderWidth: 1,
                borderRadius: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a2236',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    titleFont: { family: 'Inter' },
                    bodyFont: { family: 'JetBrains Mono' },
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    ticks: { color: '#5a6478', font: { size: 10, family: 'JetBrains Mono' }, maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    ticks: { color: '#5a6478', font: { size: 10, family: 'JetBrains Mono' } },
                    title: { display: true, text: 'mm', color: '#5a6478' },
                }
            }
        }
    });
}

// ─── Scenario Simulator ─────────────────────
function initScenarioSim() {
    const rainSlider = document.getElementById('sim-rainfall');
    const durSlider = document.getElementById('sim-duration');
    const rainVal = document.getElementById('sim-rainfall-val');
    const durVal = document.getElementById('sim-duration-val');
    const runBtn = document.getElementById('sim-run-btn');

    if (!rainSlider) return;

    rainSlider.addEventListener('input', () => { rainVal.textContent = rainSlider.value + ' mm'; });
    durSlider.addEventListener('input', () => { durVal.textContent = durSlider.value + ' hrs'; });

    runBtn?.addEventListener('click', () => runSimulation(+rainSlider.value, +durSlider.value));
}

function runSimulation(rainfall, duration) {
    const intensity = rainfall / duration;
    const container = document.getElementById('sim-results');
    if (!container) return;

    // Simple SCS-CN based simulation
    const results = HOTSPOT_DATA.map(h => {
        const CN = 85 + h.fvi * 10;
        const S = (25400 / CN) - 254;
        const Ia = 0.2 * S;
        const P = rainfall;
        const runoff = P > Ia ? Math.pow(P - Ia, 2) / (P - Ia + S) : 0;
        const depthFactor = h.fvi * (intensity / 50);
        const predictedDepth = Math.round(Math.max(0, runoff * depthFactor * 0.8 + h.depth * (rainfall / 150)));
        const willFlood = predictedDepth > 15;
        return { ...h, predictedDepth, willFlood };
    }).filter(r => r.willFlood).sort((a, b) => b.predictedDepth - a.predictedDepth);

    document.getElementById('sim-count').textContent = results.length;
    document.getElementById('sim-summary').textContent = `${results.length} of ${HOTSPOT_DATA.length} hotspots will flood at ${rainfall}mm / ${duration}hrs`;

    container.innerHTML = results.map(r => {
        const color = r.predictedDepth > 80 ? SEVERITY_COLORS.VERY_HIGH :
            r.predictedDepth > 50 ? SEVERITY_COLORS.HIGH :
                r.predictedDepth > 25 ? SEVERITY_COLORS.MODERATE : SEVERITY_COLORS.LOW;
        return `
      <div class="sim-result-item">
        <div class="sim-result-dot" style="background:${color}"></div>
        <span class="sim-result-name">${r.name}</span>
        <span class="sim-result-depth" style="color:${color}">${r.predictedDepth} cm</span>
      </div>
    `;
    }).join('');
}

// ─── Drainage & Pipelines Page ──────────────
function renderDrainagePage() {
    renderDrainageTable();
    renderPipelineTable();
    renderSlopeTable();
}

function renderDrainageTable() {
    const tbody = document.getElementById('drainage-table-body');
    if (!tbody) return;
    tbody.innerHTML = DRAINAGE_DATA.map(d => {
        const condColor = CONDITION_COLORS[d.condition] || '#94a3b8';
        const siltColor = d.siltation_pct > 70 ? '#ef4444' : d.siltation_pct > 40 ? '#f97316' : '#22c55e';
        return `<tr>
      <td style="font-weight:500">${d.name}</td>
      <td><span class="severity-badge" style="background:${d.type === 'PRIMARY' ? 'var(--accent-blue-dim)' : 'var(--bg-elevated)'};color:${d.type === 'PRIMARY' ? 'var(--accent-blue)' : 'var(--text-secondary)'}">${d.type}</span></td>
      <td>${d.ward}</td>
      <td style="font-family:var(--font-mono)">${d.length}</td>
      <td>
        <div class="pipe-profile">
          <div class="pipe-diameter-viz" style="border-color:${condColor}">${d.diameter_mm > 2000 ? '⬤' : '●'}</div>
          <span style="font-family:var(--font-mono);font-size:12px">${d.diameter_mm}mm</span>
        </div>
      </td>
      <td style="font-size:12px">${d.material}</td>
      <td>
        <span class="slope-indicator">
          <span class="slope-arrow">↘</span>
          <strong style="color:${d.slope_pct < 0.08 ? '#ef4444' : d.slope_pct < 0.15 ? '#eab308' : '#22c55e'}">${d.slope_pct}%</strong>
        </span>
      </td>
      <td>
        <span class="elev-tag">${d.elevation_up}m</span> → <span class="elev-tag">${d.elevation_down}m</span>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <div class="siltation-bar"><div class="siltation-fill" style="width:${d.siltation_pct}%;background:${siltColor}"></div></div>
          <span style="font-family:var(--font-mono);font-size:11px;color:${siltColor}">${d.siltation_pct}%</span>
        </div>
      </td>
      <td><span class="severity-badge" style="background:${condColor}22;color:${condColor}">${d.condition}</span></td>
      <td style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted)">${d.lastDesilt}</td>
    </tr>`;
    }).join('');
}

function renderPipelineTable() {
    const tbody = document.getElementById('pipeline-table-body');
    if (!tbody) return;
    tbody.innerHTML = PIPELINE_SEGMENTS.map(p => {
        const riskColor = SEVERITY_COLORS[p.risk] || '#94a3b8';
        const utilPct = Math.round((1 - p.currentCapacity / p.designCapacity) * 100);
        const utilColor = utilPct > 70 ? '#ef4444' : utilPct > 40 ? '#f97316' : '#22c55e';
        return `<tr>
      <td style="font-weight:500;font-size:12px">${p.segName}</td>
      <td>
        <span class="slope-indicator">
          <span class="slope-arrow">↘</span>
          <strong style="color:${p.slope_pct < 0.15 ? '#ef4444' : p.slope_pct < 0.3 ? '#eab308' : '#22c55e'}">${p.slope_pct}%</strong>
        </span>
      </td>
      <td style="font-family:var(--font-mono)">${p.flowVelocity} m/s</td>
      <td style="font-family:var(--font-mono)">${p.designCapacity} m³/s</td>
      <td style="font-family:var(--font-mono);color:${utilColor}">${p.currentCapacity} m³/s</td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <div class="siltation-bar" style="width:80px"><div class="siltation-fill" style="width:${utilPct}%;background:${utilColor}"></div></div>
          <span style="font-family:var(--font-mono);font-size:11px">${utilPct}%</span>
        </div>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <div class="siltation-bar"><div class="siltation-fill" style="width:${p.siltation_pct}%;background:${p.siltation_pct > 70 ? '#ef4444' : p.siltation_pct > 40 ? '#f97316' : '#22c55e'}"></div></div>
          <span style="font-family:var(--font-mono);font-size:11px">${p.siltation_pct}%</span>
        </div>
      </td>
      <td style="font-size:12px">${p.material}</td>
      <td><span class="severity-badge" style="background:${riskColor}22;color:${riskColor}">${p.risk}</span></td>
    </tr>`;
    }).join('');
}

function renderSlopeTable() {
    const tbody = document.getElementById('slope-table-body');
    if (!tbody) return;
    const sorted = [...SLOPE_DATA].sort((a, b) => a.avgSlope - b.avgSlope);
    tbody.innerHTML = sorted.map(s => {
        const riskColor = s.flatAreaPct > 55 ? '#ef4444' : s.flatAreaPct > 35 ? '#f97316' : s.flatAreaPct > 20 ? '#eab308' : '#22c55e';
        const riskLabel = s.flatAreaPct > 55 ? 'VERY HIGH' : s.flatAreaPct > 35 ? 'HIGH' : s.flatAreaPct > 20 ? 'MODERATE' : 'LOW';
        return `<tr>
      <td style="font-weight:500">${s.ward}</td>
      <td style="font-family:var(--font-mono)">${s.avgElevation}</td>
      <td style="font-family:var(--font-mono);font-size:12px">${s.minElevation} / ${s.maxElevation}</td>
      <td style="font-family:var(--font-mono)">${s.avgSlope}°</td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <div class="siltation-bar" style="width:80px"><div class="siltation-fill" style="width:${s.flatAreaPct}%;background:${riskColor}"></div></div>
          <span style="font-family:var(--font-mono);font-size:11px;color:${riskColor}">${s.flatAreaPct}%</span>
        </div>
      </td>
      <td style="font-size:12px">${s.direction}</td>
      <td><span class="severity-badge" style="background:${riskColor}22;color:${riskColor}">${riskLabel}</span></td>
    </tr>`;
    }).join('');
}

// ─── Citizen Reporting Page ─────────────────
let citizenLocation = null;
let selectedFiles = [];

function renderCitizenPage() {
    renderComplaintsList();
    initComplaintForm();
}

function renderComplaintsList() {
    const container = document.getElementById('complaints-list');
    if (!container) return;
    const sorted = [...COMPLAINTS_DATA].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    container.innerHTML = sorted.map(c => {
        const type = COMPLAINT_TYPES[c.type] || COMPLAINT_TYPES.OTHER;
        const statusClass = c.status === 'OPEN' ? 'cstatus-open' :
            c.status === 'ASSIGNED' ? 'cstatus-assigned' :
                c.status === 'IN_PROGRESS' ? 'cstatus-inprogress' : 'cstatus-resolved';
        const timeAgo = getTimeAgo(c.timestamp);
        return `
      <div class="complaint-card">
        <div class="complaint-type-icon" style="background:${type.color}22">${type.icon}</div>
        <div class="complaint-body">
          <div class="complaint-header">
            <span class="complaint-id">${c.id}</span>
            <span class="complaint-status ${statusClass}">${c.status.replace('_', ' ')}</span>
          </div>
          <div class="complaint-desc">${c.desc}</div>
          <div class="complaint-meta">
            <span>👤 ${c.citizen}</span>
            <span>📍 Ward ${c.ward}</span>
            <span>🕐 ${timeAgo}</span>
            ${c.hasImage ? '<span>📷 Photo attached</span>' : ''}
            <span class="complaint-upvotes" title="Upvote this issue">👍 ${c.upvotes}</span>
          </div>
        </div>
      </div>
    `;
    }).join('');
}

function getTimeAgo(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

function initComplaintForm() {
    // File upload
    const uploadZone = document.getElementById('cc-upload-zone');
    const fileInput = document.getElementById('cc-file-input');
    const preview = document.getElementById('cc-file-preview');

    if (!uploadZone || !fileInput) return;

    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragging'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragging'));
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragging');
        handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.size > 10 * 1024 * 1024) return; // 10MB limit
            selectedFiles.push(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const item = document.createElement('div');
                item.className = 'file-preview-item';
                item.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button class="file-preview-remove" title="Remove">✕</button>
                `;
                item.querySelector('.file-preview-remove').addEventListener('click', () => {
                    item.remove();
                    selectedFiles = selectedFiles.filter(f => f !== file);
                });
                preview.appendChild(item);
            };
            reader.readAsDataURL(file);
        });
    }

    // Geolocation
    const geoBtn = document.getElementById('cc-geoloc-btn');
    const locText = document.getElementById('cc-location-text');
    geoBtn?.addEventListener('click', () => {
        if (!navigator.geolocation) {
            locText.textContent = '❌ Geolocation not supported';
            return;
        }
        locText.textContent = '⏳ Getting location...';
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                citizenLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                locText.innerHTML = `✅ <span style="font-family:var(--font-mono)">${citizenLocation.lat.toFixed(4)}, ${citizenLocation.lng.toFixed(4)}</span>`;
                locText.style.color = 'var(--accent-green)';
            },
            (err) => {
                locText.textContent = '❌ Location access denied';
                locText.style.color = 'var(--accent-red)';
            }
        );
    });

    // Submit
    const submitBtn = document.getElementById('cc-submit-btn');
    submitBtn?.addEventListener('click', () => {
        const name = document.getElementById('cc-name')?.value;
        const phone = document.getElementById('cc-phone')?.value;
        const ward = document.getElementById('cc-ward')?.value;
        const type = document.getElementById('cc-type')?.value;
        const desc = document.getElementById('cc-desc')?.value;

        if (!name || !phone || !ward || !desc) {
            alert('Please fill in all required fields (*)');
            return;
        }

        // Create new complaint
        const newComplaint = {
            id: `CMP-${String(COMPLAINTS_DATA.length + 1).padStart(3, '0')}`,
            citizen: name,
            phone: phone,
            ward: ward,
            type: type,
            desc: desc,
            lat: citizenLocation?.lat || 19.076,
            lng: citizenLocation?.lng || 72.8777,
            timestamp: new Date().toISOString(),
            status: 'OPEN',
            hasImage: selectedFiles.length > 0,
            upvotes: 0,
        };

        COMPLAINTS_DATA.unshift(newComplaint);

        // Clear form
        document.getElementById('cc-name').value = '';
        document.getElementById('cc-phone').value = '';
        document.getElementById('cc-ward').value = '';
        document.getElementById('cc-desc').value = '';
        preview.innerHTML = '';
        selectedFiles = [];
        citizenLocation = null;
        document.getElementById('cc-location-text').textContent = 'No location set';
        document.getElementById('cc-location-text').style.color = 'var(--text-muted)';
        document.getElementById('cc-total-count').textContent = `${COMPLAINTS_DATA.length} reports`;

        // Show success
        alert(`✅ Complaint ${newComplaint.id} submitted successfully!\nAssigned to Ward ${ward} for review.`);

        // Re-render
        renderComplaintsList();
    });
}

// ─── Alerts Page — Dynamic Rendering ────────
function renderAlertsPage() {
    const container = document.getElementById('alerts-dynamic-list');
    if (!container) return;
    const alertsToShow = liveAlerts.length > 0 ? liveAlerts : ALERTS_DATA;

    const alertEmojis = { RED: '🔴', ORANGE: '🟠', YELLOW: '🟡', GREEN: '🟢' };
    const alertLabels = {
        RED: { borderColor: '#ef4444', titleColor: '#ef4444' },
        ORANGE: { borderColor: '#f97316', titleColor: '#f97316' },
        YELLOW: { borderColor: '#eab308', titleColor: '#eab308' },
        GREEN: { borderColor: '#22c55e', titleColor: '#22c55e' },
    };

    container.innerHTML = alertsToShow.map(a => {
        const cfg = alertLabels[a.level] || alertLabels.GREEN;
        const emoji = alertEmojis[a.level] || '🟢';
        const isActionable = a.level === 'RED' || a.level === 'ORANGE';
        return `
        <div class="card" style="margin-bottom:var(--space-md);border-left:3px solid ${cfg.borderColor}">
          <div class="card-body">
            <div style="display:flex;align-items:flex-start;gap:var(--space-md)">
              <div style="font-size:32px">${emoji}</div>
              <div style="flex:1">
                <div style="font-size:16px;font-weight:600;color:${cfg.titleColor};margin-bottom:4px">${a.title}</div>
                <div style="font-size:13px;color:var(--text-secondary);margin-bottom:var(--space-sm)">${a.message}</div>
                <div style="display:flex;gap:var(--space-lg);font-size:12px;color:var(--text-muted)">
                  <span>📍 ${a.ward}</span>
                  <span>🕐 ${a.time}</span>
                  ${a.hotspots > 0 ? `<span>🎯 ${a.hotspots} hotspots</span>` : ''}
                  ${a.precipitation !== undefined ? `<span>🌧️ ${a.precipitation.toFixed(1)} mm</span>` : ''}
                </div>
                ${isActionable ? `
                <div style="margin-top:var(--space-sm);display:flex;gap:var(--space-sm)">
                  ${a.level === 'RED' ? '<button class="btn btn-primary btn-sm">⚡ Deploy Resources</button>' : ''}
                  <button class="btn btn-ghost btn-sm">📋 View Plan</button>
                  <button class="btn btn-ghost btn-sm">✅ Acknowledge</button>
                </div>` : ''}
              </div>
            </div>
          </div>
        </div>`;
    }).join('');
}

// ─── Time Update ────────────────────────────
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    document.getElementById('topbar-time').textContent = `${dateStr}  ${timeStr}`;
}

// ─── Initialize ─────────────────────────────
async function init() {
    initNavigation();
    initScenarioSim();
    renderReadinessPage();
    updateClock();
    setInterval(updateClock, 1000);

    // Load dashboard
    await renderDashboard();

    // Refresh weather every 15 minutes
    setInterval(async () => {
        weatherData = await fetchCurrentWeather();
        forecastData = await fetchForecast();
    }, 15 * 60 * 1000);
}

// Start
document.addEventListener('DOMContentLoaded', init);

// ═══════════════════════════════════════════════
// Historical Rainfall — 10 Month Data Loader
// ═══════════════════════════════════════════════
let historicalChart = null;
let monthlySummaries = [];

window.loadHistoricalData = async function () {
    const loading = document.getElementById('historical-loading');
    const placeholder = document.getElementById('historical-placeholder');
    const monthlyGrid = document.getElementById('historical-monthly-grid');
    const chartContainer = document.getElementById('historical-chart-container');
    const tableContainer = document.getElementById('historical-table-container');

    if (loading) loading.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';

    try {
        const data = await fetchLast10MonthsRainfall();
        if (!data?.daily) throw new Error('No data returned');

        monthlySummaries = computeMonthlySummaries(data);
        const totalRainfall = monthlySummaries.reduce((s, m) => s + m.totalPrecip, 0);
        const totalRainyDays = monthlySummaries.reduce((s, m) => s + m.rainyDays, 0);
        const peakMonth = monthlySummaries.reduce((max, m) => m.totalPrecip > max.totalPrecip ? m : max, monthlySummaries[0]);

        // ─── Monthly Summary Cards ────────
        if (monthlyGrid) {
            monthlyGrid.innerHTML = `
                <div class="metric-card blue"><div class="metric-card-label">Total Rainfall</div><div class="metric-card-value">${totalRainfall.toFixed(0)} mm</div><div class="metric-card-sub">${monthlySummaries.length} months</div></div>
                <div class="metric-card yellow"><div class="metric-card-label">Total Rainy Days</div><div class="metric-card-value">${totalRainyDays}</div><div class="metric-card-sub">&gt; 2.5mm/day</div></div>
                <div class="metric-card red"><div class="metric-card-label">Wettest Month</div><div class="metric-card-value">${peakMonth.totalPrecip.toFixed(0)} mm</div><div class="metric-card-sub">${formatMonthName(peakMonth.month)}</div></div>
                <div class="metric-card green"><div class="metric-card-label">Daily Average</div><div class="metric-card-value">${(totalRainfall / data.daily.time.length).toFixed(1)} mm</div><div class="metric-card-sub">${data.daily.time.length} days</div></div>
            `;
            monthlyGrid.style.display = 'grid';
        }

        // ─── Bar Chart ───────────────────
        if (chartContainer) {
            chartContainer.style.display = 'block';
            const canvas = document.getElementById('historicalBarChart');
            if (canvas && typeof Chart !== 'undefined') {
                if (historicalChart) historicalChart.destroy();
                historicalChart = new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: monthlySummaries.map(m => formatMonthName(m.month)),
                        datasets: [{
                            label: 'Monthly Rainfall (mm)',
                            data: monthlySummaries.map(m => m.totalPrecip.toFixed(1)),
                            backgroundColor: monthlySummaries.map(m =>
                                m.totalPrecip > 400 ? 'rgba(239,68,68,0.7)' :
                                    m.totalPrecip > 200 ? 'rgba(249,115,22,0.7)' :
                                        m.totalPrecip > 50 ? 'rgba(99,149,255,0.7)' :
                                            'rgba(99,149,255,0.3)'
                            ),
                            borderRadius: 6,
                            borderSkipped: false,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b95a5' } },
                            x: { grid: { display: false }, ticks: { color: '#8b95a5', font: { size: 11 } } }
                        }
                    }
                });
            }
        }

        // ─── Monthly Table ────────────────
        if (tableContainer) {
            const tbody = document.getElementById('historical-table-body');
            if (tbody) {
                tbody.innerHTML = monthlySummaries.map((m, i) => {
                    const intensity = m.totalPrecip > 400 ? 'EXTREME' : m.totalPrecip > 200 ? 'HEAVY' : m.totalPrecip > 50 ? 'MODERATE' : 'LOW';
                    const color = { EXTREME: '#ef4444', HEAVY: '#f97316', MODERATE: '#6395ff', LOW: '#34d399' }[intensity];
                    return `<tr style="cursor:pointer" onclick="window.showDailyDetail(${i})">
                        <td style="font-weight:600">${formatMonthName(m.month)}</td>
                        <td>${m.totalPrecip.toFixed(1)}</td>
                        <td>${m.rainyDays}</td>
                        <td>${m.precipHours.toFixed(0)}</td>
                        <td>${m.maxTemp === -Infinity ? '—' : m.maxTemp.toFixed(1)}</td>
                        <td>${m.minTemp === Infinity ? '—' : m.minTemp.toFixed(1)}</td>
                        <td><span class="badge" style="background:${color}20;color:${color}">${intensity}</span></td>
                    </tr>`;
                }).join('');
            }
            tableContainer.style.display = 'block';
        }

    } catch (err) {
        console.error('Historical data load failed:', err);
        if (placeholder) {
            placeholder.innerHTML = `<div style="color:var(--accent-red)">⚠️ Failed to fetch data: ${err.message}</div><button class="btn btn-primary" style="margin-top:var(--space-sm)" onclick="window.loadHistoricalData()">Retry</button>`;
            placeholder.style.display = 'block';
        }
    } finally {
        if (loading) loading.style.display = 'none';
    }
};

// Show daily rainfall detail for a specific month
window.showDailyDetail = function (monthIndex) {
    const m = monthlySummaries[monthIndex];
    if (!m) return;
    const container = document.getElementById('daily-detail-container');
    const title = document.getElementById('daily-detail-title');
    const tbody = document.getElementById('daily-detail-body');
    if (!container || !tbody) return;

    title.textContent = `Daily Rainfall — ${formatMonthName(m.month)}`;
    tbody.innerHTML = m.dailyData.map(d => {
        const level = d.precip > 64.5 ? 'VERY HEAVY' : d.precip > 15.6 ? 'HEAVY' : d.precip > 7.6 ? 'MODERATE' : d.precip > 2.5 ? 'LIGHT' : 'DRY';
        const color = { 'VERY HEAVY': '#ef4444', HEAVY: '#f97316', MODERATE: '#6395ff', LIGHT: '#34d399', DRY: '#4b5563' }[level];
        const date = new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
        return `<tr><td>${date}</td><td style="font-family:var(--font-mono)">${d.precip.toFixed(1)} mm</td><td><span class="badge" style="background:${color}20;color:${color}">${level}</span></td></tr>`;
    }).join('');
    container.style.display = 'block';
};

// ═══════════════════════════════════════════════
// Reverse Geocoding for Citizen Complaints
// ═══════════════════════════════════════════════
// Enhanced geolocation: after getting GPS coords, also get address
const origGetLocation = window._origGetLocation;
window.enhancedGetLocation = async function () {
    const locBtn = document.getElementById('cc-location-btn');
    const locText = document.getElementById('cc-location-text');

    if (!navigator.geolocation) {
        if (locText) locText.textContent = 'Geolocation not supported';
        return;
    }

    if (locBtn) locBtn.disabled = true;
    if (locText) locText.textContent = '📡 Getting location...';

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lng = pos.coords.longitude.toFixed(6);
            let address = `${lat}, ${lng}`;

            // Try reverse geocoding
            try {
                const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                if (geo?.short) address = `${geo.short} (${lat}, ${lng})`;
            } catch (e) { /* fall back to coords */ }

            // Try elevation lookup
            let elevation = null;
            try {
                elevation = await fetchElevation(pos.coords.latitude, pos.coords.longitude);
            } catch (e) { /* optional */ }

            const elevText = elevation !== null ? ` · Elev: ${elevation.toFixed(0)}m` : '';
            if (locText) locText.textContent = `📍 ${address}${elevText}`;
            if (locBtn) locBtn.disabled = false;

            // Store in hidden fields
            const form = document.querySelector('.complaint-form-card');
            if (form) {
                form.dataset.lat = lat;
                form.dataset.lng = lng;
                if (elevation !== null) form.dataset.elevation = elevation;
            }
        },
        (err) => {
            if (locText) locText.textContent = `⚠️ ${err.message}`;
            if (locBtn) locBtn.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
};
