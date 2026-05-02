/**
 * VANGUARD WEATHER MX: CORE COMMAND SCRIPT
 * STABLE BUILD: SESSION MEMORY + WRAP SUPPORT
 */

const CONFIG = {
    USER_AGENT: '(Vanguard Weather Mx, commandrq@gmail.com)',
    POLL_RATE: 180000, // 3 Mins
    STATE_MAP: { "Kentucky": "KY", "Tennessee": "TN", "Ohio": "OH", "Indiana": "IN" } 
};

let SESSION = {
    sector: null, 
    alerts: [],
    lastId: null
};

const UI = {};

document.addEventListener('DOMContentLoaded', () => {
    // 1. CACHE DOM ELEMENTS
    const ids = ['update-btn', 'reset-loc-btn', 'geo-btn', 'location-search', 'autocomplete-results', 
                 'notify-btn', 'close-modal', 'alert-modal', 'dashboard', 'primary-alert', 
                 'beginner-action', 'chaser-bulletin', 'modal-title', 'modal-body', 'last-scan-time'];
    ids.forEach(id => UI[id.replace(/-([a-z])/g, g => g[1].toUpperCase())] = document.getElementById(id));

    // 2. LOAD PREFS
    if (localStorage.getItem('vanguard_mx_alerts') === 'true' && Notification.permission === 'granted') {
        UI.notifyBtn.style.color = "#00ff00";
    }

    // 3. CORE EVENTS
    UI.updateBtn.onclick = () => SESSION.sector && executeSweep();
    UI.geoBtn.onclick = requestGeolocation;
    UI.notifyBtn.onclick = toggleAlerts;
    UI.closeModal.onclick = () => UI.alertModal.classList.add('hidden');
    UI.resetLocBtn.onclick = resetSystem;

    UI.locationSearch.oninput = (e) => {
        const val = e.target.value.trim();
        if (val.length < 3) return UI.autocompleteResults.classList.add('hidden');
        /^\d{5}$/.test(val) ? fetchZip(val) : fetchCity(val);
    };

    // Auto-update Loop
    setInterval(() => SESSION.sector && executeSweep(true), CONFIG.POLL_RATE);
});

async function executeSweep() {
    const url = `https://api.weather.gov/alerts/active?area=${SESSION.sector.state}&cb=${Date.now()}`;
    try {
        const res = await fetch(url, { headers: { 'User-Agent': CONFIG.USER_AGENT }, cache: 'no-store' });
        if (!res.ok) throw new Error();
        const data = await res.json();
        updateTimestamp();
        processAlerts(data.features);
    } catch (e) {
        updateTimestamp(); 
        renderUI('status-offline', 'SYSTEM INACTIVE', 'Please monitor radio or local weather for additional threats.', '<p>[!] CONNECTION INTERRUPTED. MONITORING SUSPENDED.</p>');
    }
}

function updateTimestamp() {
    const now = new Date();
    // Requirements: Large enough to see, white text (styled in CSS)
    UI.lastScanTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function processAlerts(features) {
    SESSION.alerts = features.map(f => f.properties);
    let tornado = null, severe = null, list = '';

    if (SESSION.alerts.length === 0) {
        list = `<p>Sector ${SESSION.sector.state} is currently clear. No active threats detected.</p>`;
    } else {
        SESSION.alerts.forEach((a, i) => {
            if (a.event === 'Tornado Warning') tornado = a;
            else if (a.event.includes('Thunderstorm') || a.event.includes('Flood')) severe = a;
            list += `<div class="alert-item ${a.event === 'Tornado Warning' ? 'tornado-alert' : ''}" onclick="openModal(${i})">[VIEW]: ${a.event}</div>`;
        });
    }

    if (tornado) {
        renderUI('status-red', `TORNADO WARNING: ${tornado.areaDesc}`, 'Move to an interior room on the lowest floor immediately. Stay away from windows.', list);
    } else if (severe) {
        renderUI('status-orange', `${severe.event.toUpperCase()} ACTIVE`, 'Stay indoors. Secure outdoor property. Monitor for rapid updates.', list);
    } else {
        renderUI('status-green', `ALL CLEAR IN ${SESSION.sector.state}`, 'No forecasted threats. Monitoring nominal. Standard readiness.', list);
    }
}

function renderUI(cls, banner, action, bulletin) {
    UI.dashboard.className = cls;
    UI.primaryAlert.textContent = banner;
    UI.beginnerAction.innerHTML = `<p>${action}</p>`;
    UI.chaserBulletin.innerHTML = bulletin;
}

function requestGeolocation() {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
            const res = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`, { headers: { 'User-Agent': CONFIG.USER_AGENT } });
            const data = await res.json();
            SESSION.sector = { state: data.properties.relativeLocation.properties.state, lat: latitude, lon: longitude };
            UI.locationSearch.value = SESSION.sector.state;
            executeSweep();
        } catch(e) { alert("Tactical Link Failure."); }
    }, () => alert("GPS access required for tactical monitoring."));
}

function openModal(i) {
    const a = SESSION.alerts[i];
    UI.modalTitle.textContent = a.event;
    UI.modalBody.innerHTML = `<strong>AREA:</strong> ${a.areaDesc}<br><br><strong>TELEMETRY:</strong><br>${a.description}<br><br><strong>PROTOCOL:</strong><br>${a.instruction}`;
    UI.alertModal.classList.remove('hidden');
}

function resetSystem() {
    SESSION.sector = null;
    localStorage.removeItem('vanguard_mx_alerts');
    location.reload();
}

function toggleAlerts() {
    Notification.requestPermission().then(p => {
        if (p === 'granted') {
            localStorage.setItem('vanguard_mx_alerts', 'true');
            UI.notifyBtn.style.color = "#00ff00";
        }
    });
}
