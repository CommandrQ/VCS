const STATE_MAP = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
    "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
    "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
    "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
    "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
    "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
    "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
    "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
};

const USER_AGENT = '(Vanguard Weather Mx, commandrq@gmail.com)';

document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('update-btn');
    const resetBtn = document.getElementById('reset-loc-btn');
    const searchInput = document.getElementById('location-search');
    const resultsList = document.getElementById('autocomplete-results');
    const notifyBtn = document.getElementById('notify-btn');
    const aiShareBtn = document.getElementById('ai-share-btn');

    // System Boot
    initializeLocation();

    // Event Listeners
    updateBtn.addEventListener('click', () => {
        const savedState = localStorage.getItem('vanguard_mx_state');
        if (savedState) executeWeatherSweep(savedState);
    });

    resetBtn.addEventListener('click', () => {
        localStorage.removeItem('vanguard_mx_state');
        searchInput.value = '';
        searchInput.placeholder = 'Enter City or Zip';
        updateUI('status-green', 'AWAITING LOCATION DATA.', 'Enter your sector to begin monitoring.', 'SYSTEM RESET.');
    });

    notifyBtn.addEventListener('click', requestNotificationPermission);
    aiShareBtn.addEventListener('click', shareForAISummary);

    // Background Polling (3 Minutes)
    setInterval(() => {
        const savedState = localStorage.getItem('vanguard_mx_state');
        if (savedState) executeWeatherSweep(savedState, true);
    }, 180000);

    // Autocomplete Input Logic
    let timeoutId;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        const query = e.target.value.trim();
        
        if (query.length < 3) {
            resultsList.classList.add('hidden');
            return;
        }

        timeoutId = setTimeout(() => {
            if (/^\d{5}$/.test(query)) {
                fetchZipCode(query);
            } else if (!/^\d/.test(query)) {
                fetchCityData(query);
            }
        }, 500);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            resultsList.classList.add('hidden');
        }
    });
});

// --- LOCATION LOGIC ---

function initializeLocation() {
    const searchInput = document.getElementById('location-search');
    const savedState = localStorage.getItem('vanguard_mx_state');

    if (savedState) {
        searchInput.value = savedState;
        executeWeatherSweep(savedState);
    } else {
        requestGeolocation();
    }
}

function requestGeolocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const response = await fetch(`https://api.weather.gov/points/${lat},${lon}`, {
                        headers: { 'User-Agent': USER_AGENT }
                    });
                    if (!response.ok) throw new Error('NWS Point API Failed');
                    const data = await response.json();
                    const stateCode = data.properties.relativeLocation.properties.state;
                    commitLocation(stateCode, stateCode);
                } catch (error) {
                    enableManualSearch();
                }
            },
            () => enableManualSearch()
        );
    } else {
        enableManualSearch();
    }
}

function enableManualSearch() {
    const searchInput = document.getElementById('location-search');
    searchInput.placeholder = "Enter City or Zip";
    searchInput.value = "";
}

function commitLocation(stateCode, displayText) {
    const searchInput = document.getElementById('location-search');
    const resultsList = document.getElementById('autocomplete-results');
    localStorage.setItem('vanguard_mx_state', stateCode);
    searchInput.value = displayText;
    resultsList.classList.add('hidden');
    executeWeatherSweep(stateCode);
}

// --- FALLBACK SEARCH APIs ---

async function fetchZipCode(zip) {
    try {
        const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
        if (!response.ok) return;
        const data = await response.json();
        const stateCode = data.places[0]["state abbreviation"];
        const city = data.places[0]["place name"];
        renderSuggestions([{ display: `${city}, ${stateCode} (${zip})`, stateCode: stateCode }]);
    } catch (error) { console.error("Zip Fetch Error"); }
}

async function fetchCityData(city) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&format=json`);
        const data = await response.json();
        if (!data.results) return;

        const suggestions = data.results
            .filter(place => place.country_code === "US")
            .map(place => {
                const stateCode = STATE_MAP[place.admin1];
                return { display: `${place.name}, ${stateCode || place.admin1}`, stateCode: stateCode };
            })
            .filter(item => item.stateCode);
        renderSuggestions(suggestions);
    } catch (error) { console.error("City Fetch Error"); }
}

function renderSuggestions(suggestions) {
    const resultsList = document.getElementById('autocomplete-results');
    resultsList.innerHTML = '';
    if (suggestions.length === 0) {
        resultsList.classList.add('hidden');
        return;
    }
    suggestions.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.display;
        li.addEventListener('click', () => commitLocation(item.stateCode, item.display));
        resultsList.appendChild(li);
    });
    resultsList.classList.remove('hidden');
}

// --- NWS DATA BRIDGE ---

async function executeWeatherSweep(stateCode, isBackground = false) {
    const state = stateCode.toUpperCase().trim();
    const cacheBuster = Date.now();
    const apiUrl = `https://api.weather.gov/alerts/active?area=${state}&cb=${cacheBuster}`;

    try {
        const response = await fetch(apiUrl, {
            headers: { 'User-Agent': USER_AGENT },
            cache: 'no-store'
        });
        if (!response.ok) throw new Error('API Bridge Failed.');
        const data = await response.json();
        processTelemetry(data.features, state);
    } catch (error) {
        updateUI('status-red', 'DATA FEED OFFLINE.', 'Check connection. Data bridge compromised.', 'SYSTEM ERROR.');
    }
}

function processTelemetry(alerts, stateCode) {
    const events = alerts.map(alert => alert.properties);
    const tornadoWarning = events.find(e => e.event === 'Tornado Warning');
    const severeWarning = events.find(e => e.event === 'Severe Thunderstorm Warning' || e.event === 'Flash Flood Warning');

    let rawLog = '';
    if (events.length === 0) {
        rawLog = `NO ACTIVE ALERTS IN SECTOR [${stateCode}].\n\nMONITORING NOMINAL.`;
    } else {
        events.forEach(e => {
            rawLog += `[EVENT]: ${e.event}\n[AREA]: ${e.areaDesc}\n[DESC]: ${e.description || 'N/A'}\n[INST]: ${e.instruction || 'N/A'}\n\n`;
        });
    }

    // Trigger OS Notification if a new alert appears
    const latestAlertId = alerts.length > 0 ? alerts[0].properties.id : null;
    const lastSeenAlert = localStorage.getItem('vanguard_mx_last_alert');

    if (latestAlertId && latestAlertId !== lastSeenAlert) {
        localStorage.setItem('vanguard_mx_last_alert', latestAlertId);
        if (tornadoWarning) triggerSystemAlert("TORNADO WARNING", `Active threat in ${stateCode}. Take immediate shelter.`);
        else if (severeWarning) triggerSystemAlert(`${severeWarning.event.toUpperCase()}`, `Active threat in ${stateCode}. Secure your location.`);
    }

    // Execute UI Updates
    if (tornadoWarning) {
        updateUI('status-red', `TORNADO WARNING: ${tornadoWarning.areaDesc} - TAKE SHELTER NOW.`, 'IMMEDIATELY MOVE TO A BASEMENT OR INTERIOR ROOM ON THE LOWEST FLOOR. AVOID WINDOWS.', rawLog);
    } else if (severeWarning) {
        updateUI('status-orange', `${severeWarning.event.toUpperCase()} ACTIVE.`, 'STAY INDOORS. SECURE LOOSE OUTDOOR ITEMS. MONITOR UPDATES.', rawLog);
    } else {
        updateUI('status-green', `ALL CLEAR IN ${stateCode}. MONITORING THE SKIES.`, 'No active threats. Maintain standard readiness.', rawLog);
    }
}

function updateUI(statusClass, bannerText, actionText, rawData) {
    const dashboard = document.getElementById('dashboard');
    const primaryAlert = document.getElementById('primary-alert');
    const beginnerAction = document.getElementById('beginner-action');
    const chaserBulletin = document.getElementById('chaser-bulletin');

    dashboard.className = '';
    dashboard.classList.add(statusClass);
    primaryAlert.textContent = bannerText;
    beginnerAction.innerHTML = `<p>${actionText}</p>`;
    chaserBulletin.textContent = rawData;
}

// --- NOTIFICATION & AI BRIDGE ---

function requestNotificationPermission() {
    if (!("Notification" in window)) {
        alert("This browser does not support system notifications.");
        return;
    }
    Notification.requestPermission().then(permission => {
        const notifyBtn = document.getElementById('notify-btn');
        if (permission === "granted") {
            notifyBtn.textContent = "ALERTS ACTIVE";
            notifyBtn.style.background = "#005500";
            new Notification("Vanguard Weather MX", { body: "System communications established." });
        }
    });
}

function triggerSystemAlert(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body: body, requireInteraction: true });
    }
}

async function shareForAISummary() {
    const rawData = document.getElementById('chaser-bulletin').textContent;
    if (rawData.includes("NO ACTIVE ALERTS") || rawData.includes("AWAITING")) {
        alert("No active threats to summarize.");
        return;
    }

    const aiPrompt = `As an emergency weather analyst, summarize the following National Weather Service alert data into 3 simple, actionable bullet points for immediate civilian safety. Focus only on the exact threat, the time frame, and what physical action to take.\n\nRAW DATA:\n${rawData}`;

    if (navigator.share) {
        try {
            await navigator.share({ title: 'Vanguard Weather Data', text: aiPrompt });
        } catch (error) { fallbackCopy(aiPrompt); }
    } else {
        fallbackCopy(aiPrompt);
    }
}

function fallbackCopy(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Data copied to clipboard! Paste this into your AI companion for a summary.");
    }).catch(err => { console.error('Failed to copy data'); });
}
