// ═══════════════════════════════════════════════
// UFHE — API Integration Layer
// Open-Meteo (weather), Open-Elevation, Nominatim
// All free, no API keys required!
// ═══════════════════════════════════════════════

const MUMBAI_LAT = 19.076;
const MUMBAI_LNG = 72.8777;

// ─── Open-Meteo: Current Weather ────────────
async function fetchCurrentWeather() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${MUMBAI_LAT}&longitude=${MUMBAI_LNG}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=precipitation_probability,precipitation&timezone=Asia/Kolkata&forecast_days=3`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('Weather fetch failed:', err);
        return null;
    }
}

// ─── Open-Meteo: 7-Day Forecast ─────────────
async function fetchForecast() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${MUMBAI_LAT}&longitude=${MUMBAI_LNG}&hourly=precipitation,precipitation_probability,temperature_2m,weather_code&daily=precipitation_sum,precipitation_probability_max,weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia/Kolkata&forecast_days=7`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('Forecast fetch failed:', err);
        return null;
    }
}

// ─── Open-Meteo: Historical Rainfall ────────
// Fetches daily rainfall for any date range (up to 10 months back)
async function fetchHistoricalRainfall(startDate, endDate) {
    try {
        const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${MUMBAI_LAT}&longitude=${MUMBAI_LNG}&start_date=${startDate}&end_date=${endDate}&daily=precipitation_sum,rain_sum,precipitation_hours,temperature_2m_max,temperature_2m_min,weather_code&timezone=Asia/Kolkata`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('Historical rainfall fetch failed:', err);
        return null;
    }
}

// Fetch past 10 months of daily rainfall data
async function fetchLast10MonthsRainfall() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 10);

    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    return await fetchHistoricalRainfall(start, end);
}

// Compute monthly summaries from daily data
function computeMonthlySummaries(historicalData) {
    if (!historicalData?.daily) return [];

    const { time, precipitation_sum, rain_sum, precipitation_hours, temperature_2m_max, temperature_2m_min } = historicalData.daily;

    const monthMap = {};
    time.forEach((date, i) => {
        const monthKey = date.substring(0, 7); // "YYYY-MM"
        if (!monthMap[monthKey]) {
            monthMap[monthKey] = {
                month: monthKey,
                totalPrecip: 0,
                totalRain: 0,
                rainyDays: 0,
                precipHours: 0,
                maxTemp: -Infinity,
                minTemp: Infinity,
                dailyData: [],
                days: 0,
            };
        }
        const m = monthMap[monthKey];
        m.totalPrecip += precipitation_sum[i] || 0;
        m.totalRain += (rain_sum?.[i]) || (precipitation_sum[i] || 0);
        m.precipHours += precipitation_hours[i] || 0;
        if (precipitation_sum[i] > 2.5) m.rainyDays++;
        if (temperature_2m_max[i] > m.maxTemp) m.maxTemp = temperature_2m_max[i];
        if (temperature_2m_min[i] < m.minTemp) m.minTemp = temperature_2m_min[i];
        m.dailyData.push({ date, precip: precipitation_sum[i] || 0 });
        m.days++;
    });

    return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
}

// ─── Open-Elevation API ─────────────────────
async function fetchElevation(lat, lng) {
    try {
        const url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.results?.[0]?.elevation || null;
    } catch (err) {
        console.error('Elevation fetch failed:', err);
        return null;
    }
}

// Batch elevation lookup
async function fetchElevationBatch(coords) {
    try {
        const locations = coords.map(c => `${c.lat},${c.lng}`).join('|');
        const url = `https://api.open-elevation.com/api/v1/lookup?locations=${locations}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.results?.map(r => r.elevation) || [];
    } catch (err) {
        console.error('Batch elevation fetch failed:', err);
        return [];
    }
}

// ─── Nominatim Reverse Geocoding ────────────
async function reverseGeocode(lat, lng) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`;
        const res = await fetch(url, {
            headers: { 'User-Agent': 'UFHE-MumbaiFloodEngine/2.0' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return {
            displayName: data.display_name,
            road: data.address?.road || '',
            suburb: data.address?.suburb || data.address?.neighbourhood || '',
            city: data.address?.city || data.address?.town || '',
            postcode: data.address?.postcode || '',
            short: [data.address?.road, data.address?.suburb].filter(Boolean).join(', ') || data.display_name?.split(',').slice(0, 2).join(','),
        };
    } catch (err) {
        console.error('Reverse geocode failed:', err);
        return null;
    }
}

// ─── Weather Code Descriptions ──────────────
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Foggy', 48: 'Depositing rime fog',
        51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
        80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Unknown';
}

function getWeatherEmoji(code) {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 55) return '🌦️';
    if (code <= 65) return '🌧️';
    if (code <= 75) return '❄️';
    if (code <= 82) return '⛈️';
    if (code >= 95) return '🌩️';
    return '🌤️';
}

// ─── Helper: Format Month Name ──────────────
function formatMonthName(monthKey) {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

// ─── Dynamic Alert Generation from Live Data ──
function generateWeatherAlerts(weatherData, forecastData, hotspots) {
    const alerts = [];
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (!weatherData?.current) {
        // Fallback: no data available
        alerts.push({
            id: 1, level: 'GREEN',
            title: 'Weather Data Unavailable',
            message: 'Unable to fetch live weather data. Alerts may be delayed.',
            time: timeStr, ward: '—', hotspots: 0
        });
        return alerts;
    }

    const current = weatherData.current;
    const precip = current.precipitation || 0;
    const weatherCode = current.weather_code || 0;
    const temp = current.temperature_2m;
    const wind = current.wind_speed_10m || 0;
    const humidity = current.relative_humidity_2m || 0;

    // Determine severity from current conditions
    const isThunderstorm = [95, 96, 99].includes(weatherCode);
    const isViolentShower = weatherCode === 82;
    const isHeavyRain = weatherCode === 65 || weatherCode === 81;
    const isModerateRain = [61, 63, 80].includes(weatherCode);
    const isDrizzle = [51, 53, 55].includes(weatherCode);
    const isFoggy = [45, 48].includes(weatherCode);

    // Count hotspots by severity
    const veryHighHotspots = hotspots ? hotspots.filter(h => h.severity === 'VERY_HIGH') : [];
    const highHotspots = hotspots ? hotspots.filter(h => h.severity === 'HIGH') : [];
    const topWards = veryHighHotspots.length > 0
        ? [...new Set(veryHighHotspots.map(h => h.ward))].slice(0, 3)
        : [...new Set(highHotspots.map(h => h.ward))].slice(0, 3);

    let alertId = 1;

    // RED ALERT: Very heavy rainfall / thunderstorm
    if (precip >= 65 || isThunderstorm || isViolentShower) {
        const affectedCount = veryHighHotspots.length + highHotspots.length;
        const totalPop = veryHighHotspots.reduce((s, h) => s + h.pop, 0);
        alerts.push({
            id: alertId++, level: 'RED',
            title: `RED ALERT — ${isThunderstorm ? 'Thunderstorm' : 'Extreme Rainfall'} Warning`,
            message: `Current: ${precip.toFixed(1)} mm/hr precipitation${isThunderstorm ? ' with thunderstorm activity' : ''}. ${affectedCount} hotspots at HIGH/VERY HIGH risk across wards ${topWards.join(', ')}. ~${(totalPop / 1000).toFixed(0)}k population exposed. Immediate deployment required.`,
            time: timeStr, ward: topWards[0] || 'City-wide', hotspots: affectedCount,
            precipitation: precip, weatherCode
        });
    }
    // ORANGE ALERT: Heavy rainfall
    else if (precip >= 15 || isHeavyRain) {
        const affectedCount = veryHighHotspots.length;
        alerts.push({
            id: alertId++, level: 'ORANGE',
            title: 'ORANGE ALERT — Heavy Rain Warning',
            message: `Current: ${precip.toFixed(1)} mm/hr. ${getWeatherDescription(weatherCode)}. ${affectedCount} high-vulnerability hotspots may activate. Deploy pumps to ${topWards.join(', ') || 'key locations'}.`,
            time: timeStr, ward: topWards[0] || 'City-wide', hotspots: affectedCount,
            precipitation: precip, weatherCode
        });
    }
    // YELLOW ALERT: Moderate rain
    else if (precip >= 2.5 || isModerateRain || isDrizzle) {
        alerts.push({
            id: alertId++, level: 'YELLOW',
            title: 'YELLOW ALERT — Moderate Rain',
            message: `Current: ${precip.toFixed(1)} mm/hr. ${getWeatherDescription(weatherCode)}. Monitoring conditions across all wards. Low-lying areas on watch.`,
            time: timeStr, ward: 'City-wide', hotspots: 0,
            precipitation: precip, weatherCode
        });
    }

    // Check forecast for upcoming peaks (next 24 hours)
    if (forecastData?.hourly) {
        const nextHours = forecastData.hourly.precipitation?.slice(0, 24) || [];
        const maxForecast = Math.max(...nextHours);
        const peakHourIdx = nextHours.indexOf(maxForecast);
        const peakTime = forecastData.hourly.time?.[peakHourIdx];
        const peakTimeStr = peakTime ? new Date(peakTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

        if (maxForecast >= 15 && precip < 15) {
            alerts.push({
                id: alertId++, level: 'ORANGE',
                title: 'FORECAST ALERT — Heavy Rain Expected',
                message: `Peak rainfall of ${maxForecast.toFixed(1)} mm expected around ${peakTimeStr}. Pre-position flood response teams. Monitor Mithi River and low-lying wards.`,
                time: `Forecast`, ward: 'City-wide', hotspots: veryHighHotspots.length,
                precipitation: maxForecast, weatherCode: -1
            });
        } else if (maxForecast >= 5 && precip < 2.5) {
            alerts.push({
                id: alertId++, level: 'YELLOW',
                title: 'FORECAST — Rain Expected',
                message: `Rain forecast of ${maxForecast.toFixed(1)} mm expected around ${peakTimeStr}. Standard monitoring in effect.`,
                time: `Forecast`, ward: 'City-wide', hotspots: 0,
                precipitation: maxForecast, weatherCode: -1
            });
        }
    }

    // Fog / visibility warning
    if (isFoggy) {
        alerts.push({
            id: alertId++, level: 'YELLOW',
            title: 'Fog Advisory',
            message: `${getWeatherDescription(weatherCode)} conditions. Reduced visibility may affect drainage inspection and response operations.`,
            time: timeStr, ward: 'City-wide', hotspots: 0,
            precipitation: 0, weatherCode
        });
    }

    // High wind warning
    if (wind >= 50) {
        alerts.push({
            id: alertId++, level: 'ORANGE',
            title: 'High Wind Advisory',
            message: `Wind speed: ${Math.round(wind)} km/h. Secure temporary flood barriers. Risk of debris blocking drains.`,
            time: timeStr, ward: 'City-wide', hotspots: 0,
            precipitation: precip, weatherCode
        });
    }

    // GREEN status if nothing else triggered
    if (alerts.length === 0) {
        alerts.push({
            id: alertId++, level: 'GREEN',
            title: 'All Clear — Normal Conditions',
            message: `${getWeatherEmoji(weatherCode)} ${getWeatherDescription(weatherCode)}, ${Math.round(temp)}°C. ${precip > 0 ? `Light precipitation: ${precip.toFixed(1)} mm/hr.` : 'No significant rainfall.'} All systems nominal.`,
            time: timeStr, ward: 'City-wide', hotspots: 0,
            precipitation: precip, weatherCode
        });
    }

    return alerts;
}

export {
    fetchCurrentWeather, fetchHistoricalRainfall, fetchForecast,
    fetchLast10MonthsRainfall, computeMonthlySummaries,
    fetchElevation, fetchElevationBatch,
    reverseGeocode,
    getWeatherDescription, getWeatherEmoji, formatMonthName,
    generateWeatherAlerts,
    MUMBAI_LAT, MUMBAI_LNG
};
