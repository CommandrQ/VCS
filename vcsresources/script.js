/* VCS DYNAMIC DATA ENGINE & LOCATION SCANNER */

let allGuilds = []; // Stores the master list of guilds in memory

document.addEventListener("DOMContentLoaded", () => {
    loadResources();
    loadGuilds();
});

function getTargetAttribute(url) {
    if (url && !url.startsWith("mailto:") && url !== "#" && !url.startsWith("javascript:")) {
        if (url.startsWith('http') || url.startsWith('//')) {
            return 'target="_blank" rel="noopener noreferrer"';
        }
    }
    return 'target="_self"';
}

async function loadResources() {
    const container = document.getElementById('resources-container');
    try {
        const response = await fetch('json/resources.json', { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        const data = await response.json();
        container.innerHTML = ''; 
        
        data.forEach(item => {
            const highlightClass = item.highlight ? 'highlight' : '';
            const targetInfo = getTargetAttribute(item.link);
            container.innerHTML += `
                <div class="resource-item ${highlightClass}">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <a href="${item.link}" class="tier-btn" ${targetInfo}>${item.buttonText}</a>
                </div>
            `;
        });
    } catch (error) {
        console.error("Resource Uplink Failed:", error);
        container.innerHTML = `<p style="color: #ff5f1f;">[ SYSTEM FAULT: ${error.message} ]</p>`;
    }
}

async function loadGuilds() {
    const container = document.getElementById('guilds-container');
    try {
        const response = await fetch('json/guilds.json', { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        allGuilds = await response.json(); // Save to memory
        renderGuilds(allGuilds); // Render all by default
    } catch (error) {
        console.error("Guild Uplink Failed:", error);
        container.innerHTML = `<p style="color: #ff5f1f;">[ SYSTEM FAULT: ${error.message} ]</p>`;
    }
}

// Function to draw the guilds based on an array
function renderGuilds(guildArray) {
    const container = document.getElementById('guilds-container');
    container.innerHTML = ''; 
    
    if (guildArray.length === 0) {
        container.innerHTML = `<p style="color: var(--text-main);">[ NO LOCAL PARTNERS FOUND IN THIS SECTOR ]</p>`;
        return;
    }

    guildArray.forEach(guild => {
        const lockedClass = guild.locked ? 'locked' : '';
        const targetInfo = getTargetAttribute(guild.link);
        const stateTag = guild.state ? `<span style="font-size:0.7rem; color:var(--vcs-amber);">[${guild.state.toUpperCase()}]</span>` : '';
        
        const buttonHTML = guild.locked 
            ? `<button class="contact-btn" disabled>${guild.buttonText}</button>`
            : `<a href="${guild.link}" class="contact-btn" ${targetInfo}>${guild.buttonText}</a>`;

        container.innerHTML += `
            <div class="guild-card ${lockedClass}">
                <div class="guild-header">${guild.title} ${stateTag}</div>
                <p>${guild.description}</p>
                ${buttonHTML}
            </div>
        `;
    });
}

// --- LOCATION SCANNER ---
async function scanLocation() {
    const btn = document.getElementById('scan-btn');
    btn.innerText = "SCANNING...";
    btn.style.color = "var(--vcs-amber)";

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        btn.innerText = "SCAN FAILED";
        return;
    }

    // Request GPS access
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        try {
            // Free API to reverse geocode lat/lon into a US State
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            const data = await res.json();
            
            const userState = data.principalSubdivision; // e.g., "Kentucky"
            
            // Filter the guilds: Show if state matches, or if state is "ALL"
            const localGuilds = allGuilds.filter(g => 
                g.state && (g.state.toLowerCase() === userState.toLowerCase() || g.state.toUpperCase() === "ALL")
            );
            
            renderGuilds(localGuilds);
            btn.innerText = `SECTOR: ${userState.toUpperCase()}`;
            btn.style.color = "#00ff00"; // Green for success
            
        } catch (e) {
            console.error("Geocoding failed:", e);
            btn.innerText = "API FAULT";
        }
    }, () => {
        btn.innerText = "LOC DENIED";
        alert("Location access denied. Please check your browser privacy settings.");
    });
}

// --- MODAL CONTROLS ---
function openModal(modalId) { document.getElementById(modalId).style.display = 'flex'; }
function closeModal(modalId) { document.getElementById(modalId).style.display = 'none'; }
function closeModalOnOutsideClick(event, modalId) {
    if (event.target === document.getElementById(modalId)) closeModal(modalId);
}
