// ═══════════════════════════════════════════════
// UFHE — Bhuvan (ISRO) API Integration
// All Bhuvan REST endpoints and data fetchers
// ═══════════════════════════════════════════════

const BHUVAN_KEYS = {
    geoid:             '3c444e4eccfe7fdcda5fb294d8df6d774b48f91a',
    routing:           '6c30c7a01d8ea69366f73d911f745371228c3d25',
    lulcAOI:           '11b5bd707ec50e7b3e279af14467e78c7e1e525f',
    lulcStats:         'a27f1d06305e6d63c423e33e957cdda2ab952577',
    villageRevGeo:     'e94c815f4c4a08d4b9e721dab670a82e48ecf0c4',
    villageGeo:        'baea9f1a8998060344215a80f40931826c71ac74',
};

// Base URL for all Bhuvan API calls
const BHUVAN_BASE = 'https://bhuvan.nrsc.gov.in';

// ─── Helper: JSON fetch with error handling ──
async function bhuvanFetch(url) {
    try {
        const resp = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return await resp.json();
    } catch (err) {
        console.warn('[Bhuvan API] Fetch failed:', url, err.message);
        return null;
    }
}

// ═══════════════════════════════════════════════
// 1. Village Geocoding
//    Convert village name → coordinates
// ═══════════════════════════════════════════════
export async function bhuvanVillageGeocode(villageName, state = '') {
    const params = new URLSearchParams({
        token: BHUVAN_KEYS.villageGeo,
        villagename: villageName,
        ...(state && { state }),
    });
    const url = `${BHUVAN_BASE}/api/1.0/api_service.php?user=bhuvan&action=vilgeo&${params}`;
    const data = await bhuvanFetch(url);
    if (!data) return null;
    // Normalise: expect array of { villagename, district, state, lat, lon }
    return Array.isArray(data) ? data : (data.data || data.results || []);
}

// ═══════════════════════════════════════════════
// 2. Village Reverse Geocoding
//    Convert lat/lng → village name + admin area
// ═══════════════════════════════════════════════
export async function bhuvanReverseGeocode(lat, lng) {
    const params = new URLSearchParams({
        token: BHUVAN_KEYS.villageRevGeo,
        lat,
        lon: lng,
    });
    const url = `${BHUVAN_BASE}/api/1.0/api_service.php?user=bhuvan&action=vilrevgeo&${params}`;
    const data = await bhuvanFetch(url);
    if (!data) return null;
    return data;
}

// ═══════════════════════════════════════════════
// 3. Geoid / Ellipsoid-to-Geoid Conversion
//    Get geoid height at a lat/lng point
// ═══════════════════════════════════════════════
export async function bhuvanGetGeoid(lat, lng) {
    const params = new URLSearchParams({
        token: BHUVAN_KEYS.geoid,
        lat,
        lon: lng,
    });
    const url = `${BHUVAN_BASE}/api/1.0/api_service.php?user=bhuvan&action=geoid&${params}`;
    const data = await bhuvanFetch(url);
    return data;
}

// ═══════════════════════════════════════════════
// 4. Routing / Shortest Path
//    srcLat, srcLon → dstLat, dstLon
// ═══════════════════════════════════════════════
export async function bhuvanRoute(srcLat, srcLng, dstLat, dstLng) {
    const params = new URLSearchParams({
        token: BHUVAN_KEYS.routing,
        srclat: srcLat,
        srclon: srcLng,
        dstlat: dstLat,
        dstlon: dstLng,
    });
    const url = `${BHUVAN_BASE}/api/1.0/api_service.php?user=bhuvan&action=route&${params}`;
    const data = await bhuvanFetch(url);
    return data;
}

// ═══════════════════════════════════════════════
// 5. LULC AOI-Wise Statistics
//    Get land use/land cover for a polygon AOI
//    aoi: GeoJSON polygon feature or WKT string
// ═══════════════════════════════════════════════
export async function bhuvanLULCAOI(lat, lng, radius_km = 5, scale = '50k') {
    // Build a bounding box around the point for AOI
    const delta = radius_km / 111; // ~1 degree = 111km
    const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
    const params = new URLSearchParams({
        token: BHUVAN_KEYS.lulcAOI,
        bbox,
        scale,
    });
    const url = `${BHUVAN_BASE}/api/1.0/api_service.php?user=bhuvan&action=lulcaoi&${params}`;
    const data = await bhuvanFetch(url);
    return data;
}

// ═══════════════════════════════════════════════
// 6. LULC Statistics
//    District-level LULC statistics
// ═══════════════════════════════════════════════
export async function bhuvanLULCStats(district, state, scale = '50k') {
    const params = new URLSearchParams({
        token: BHUVAN_KEYS.lulcStats,
        district,
        state,
        scale,
    });
    const url = `${BHUVAN_BASE}/api/1.0/api_service.php?user=bhuvan&action=lulcstats&${params}`;
    const data = await bhuvanFetch(url);
    return data;
}

// ═══════════════════════════════════════════════
// 7. Bhuvan WMS Tile Layer URL (use in Leaflet)
//    Returns a Leaflet-compatible WMS tile URL
//    Layers: wms_l2, lulc50k, lulc250k, etc.
// ═══════════════════════════════════════════════
export function bhuvanWMSUrl(layer = 'wms_l2', apiKey = BHUVAN_KEYS.lulcStats) {
    // Bhuvan WMS endpoint — public tiles don't need token for base imagery
    return `https://bhuvan-vec2.nrsc.gov.in/bhuvan/gwc/service/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=${layer}&SRS=EPSG:4326&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`;
}

// ─── Bhuvan base map tile (WMTS/TMS) for Leaflet ──
export const BHUVAN_TILE_URL = 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/tms/1.0.0/bhuvan_imagery@EPSG:900913@jpg/{z}/{x}/{y}.jpg';
export const BHUVAN_HYBRID_URL = 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/tms/1.0.0/bhuvan_hybrid@EPSG:900913@png/{z}/{x}/{y}.png';

// ─── LULC colour legend ────────────────────────────
export const LULC_LEGEND = {
    11: { label: 'Built-up Urban',      color: '#e63946' },
    12: { label: 'Built-up Rural',      color: '#ff6b6b' },
    21: { label: 'Kharif Crop',         color: '#2dc653' },
    22: { label: 'Rabi Crop',           color: '#90e0ef' },
    23: { label: 'Zaid Crop',           color: '#38b2ac' },
    24: { label: 'Double/Triple Crop',  color: '#1a936f' },
    25: { label: 'Plantations',         color: '#52b788' },
    31: { label: 'Evergreen Forest',    color: '#006400' },
    32: { label: 'Deciduous Forest',    color: '#228b22' },
    33: { label: 'Scrub / Degraded',    color: '#c6ac8f' },
    41: { label: 'Grassland',           color: '#a7c957' },
    51: { label: 'Wasteland',           color: '#bc6c25' },
    61: { label: 'Water Body',          color: '#0096c7' },
    71: { label: 'Wetland',             color: '#48cae4' },
    81: { label: 'Snow/Glacier',        color: '#e0fbfc' },
    91: { label: 'Barren/Rocky',        color: '#9c9c9c' },
};
