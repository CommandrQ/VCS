/* VCS DYNAMIC DATA ENGINE & SORT CONTROLLER */

// --- BROWSER CACHE DEFEAT PROTOCOL ---
// Forces the page to completely reload if the user navigates here via the "Back" button
window.addEventListener("pageshow", function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});

let allGuilds = []; // Stores the master list in original order
let sortState = 0;  // 0: Default, 1: Name A-Z, 2: State A-Z

document.addEventListener("DOMContentLoaded", () => {
    loadResources();
    loadGuilds();
});

// --- SECURE LINK ROUTER ---
function getTargetAttribute(url) {
    if (url && !url.startsWith("mailto:") && url !== "#" && !url.startsWith("javascript:")) {
        if (url.startsWith('http') || url.startsWith('//')) {
            return 'target="_blank" rel="noopener noreferrer"';
        }
    }
    return 'target="_self"';
}

// --- FETCH RESOURCES ---
async function loadResources() {
    const container = document.getElementById('resources-container');
    try {
        const response = await fetch('json/resources.json', { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        const data = await response.json();
        container.innerHTML = ''; 
        
        data.forEach(item => {
            const targetInfo = getTargetAttribute(item.link);
            container.innerHTML += `
                <div class="resource-item">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <a href="${item.link}" class="tier-btn" ${targetInfo}>${item.buttonText}</a>
                </div>
            `;
        });
    } catch (error) {
        console.error("Resource Uplink Failed:", error);
        container.innerHTML = `<p style="color: #ff5f1f;">[ SYSTEM FAULT: Check JSON path ]</p>`;
    }
}

// --- FETCH GUILDS ---
async function loadGuilds() {
    const container = document.getElementById('guilds-container');
    try {
        const response = await fetch('json/guilds.json', { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        allGuilds = await response.json(); 
        renderGuilds(allGuilds); // Render default order
    } catch (error) {
        console.error("Guild Uplink Failed:", error);
        container.innerHTML = `<p style="color: #ff5f1f;">[ SYSTEM FAULT: Check JSON path ]</p>`;
    }
}

// --- DRAW GUILDS TO SCREEN ---
function renderGuilds(guildArray) {
    const container = document.getElementById('guilds-container');
    container.innerHTML = ''; 
    
    guildArray.forEach(guild => {
        const lockedClass = guild.locked ? 'locked' : '';
        const targetInfo = getTargetAttribute(guild.link);
        
        // Adds the [STATE] tag next to the title if a state exists
        const stateDisplay = guild.state ? `<span style="font-size:0.75rem; color:#888; font-family:'Inter'; margin-left: 10px;">[${guild.state.toUpperCase()}]</span>` : '';
        
        const buttonHTML = guild.locked 
            ? `<button class="contact-btn" disabled>${guild.buttonText}</button>`
            : `<a href="${guild.link}" class="contact-btn" ${targetInfo}>${guild.buttonText}</a>`;

        container.innerHTML += `
            <div class="guild-card ${lockedClass}">
                <div class="guild-header" style="display:flex; align-items:baseline;">
                    ${guild.title} ${stateDisplay}
                </div>
                <p>${guild.description}</p>
                ${buttonHTML}
            </div>
        `;
    });
}

// --- SORTING ENGINE ---
function toggleSort() {
    sortState = (sortState + 1) % 3; // Cycles 0, 1, 2
    const btn = document.getElementById('sort-btn');
    let sortedList = [...allGuilds]; // Copy array to prevent overwriting default order

    if (sortState === 1) {
        // Sort 1: Alphabetical by Name (A-Z)
        btn.innerText = "SORT: A-Z";
        btn.style.color = "#ffffff";
        sortedList.sort((a, b) => a.title.localeCompare(b.title));
    } 
    else if (sortState === 2) {
        // Sort 2: Alphabetical by State
        btn.innerText = "SORT: STATE";
        btn.style.color = "#ffffff";
        sortedList.sort((a, b) => {
            const stateA = a.state || "ZZZ"; // Pushes items without a state to the bottom
            const stateB = b.state || "ZZZ";
            return stateA.localeCompare(stateB);
        });
    } 
    else {
        // Sort 0: Default (Original JSON order)
        btn.innerText = "SORT: DEFAULT";
        btn.style.color = "var(--gold)";
    }

    renderGuilds(sortedList);
}

// --- MODAL CONTROLS ---
function openModal(modalId) { document.getElementById(modalId).style.display = 'flex'; }
function closeModal(modalId) { document.getElementById(modalId).style.display = 'none'; }
function closeModalOnOutsideClick(event, modalId) {
    if (event.target === document.getElementById(modalId)) closeModal(modalId);
}
