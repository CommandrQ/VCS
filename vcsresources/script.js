/* VCS DYNAMIC DATA ENGINE & SORT CONTROLLER */

let allGuilds = []; // Stores the master list in original order
let sortState = 0;  // 0: Default, 1: A-Z, 2: State

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
        allGuilds = await response.json(); 
        renderGuilds(allGuilds); // Render default order
    } catch (error) {
        console.error("Guild Uplink Failed:", error);
        container.innerHTML = `<p style="color: #ff5f1f;">[ SYSTEM FAULT: ${error.message} ]</p>`;
    }
}

// Draws the guilds to the screen
function renderGuilds(guildArray) {
    const container = document.getElementById('guilds-container');
    container.innerHTML = ''; 
    
    guildArray.forEach(guild => {
        const lockedClass = guild.locked ? 'locked' : '';
        const targetInfo = getTargetAttribute(guild.link);
        
        // Adds the [STATE] tag next to the title if a state exists
        const stateDisplay = guild.state ? `<span style="font-size:0.75rem; color:var(--text-muted); margin-left: 8px;">[${guild.state.toUpperCase()}]</span>` : '';
        
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
    let sortedList = [...allGuilds]; // Copy the array so we don't destroy the original order

    if (sortState === 1) {
        // Sort A-Z by Title
        btn.innerText = "SORT: A-Z";
        btn.style.color = "var(--vcs-amber)";
        sortedList.sort((a, b) => a.title.localeCompare(b.title));
    } 
    else if (sortState === 2) {
        // Sort by State (Alphabetical)
        btn.innerText = "SORT: STATE";
        btn.style.color = "#00ff00"; // Green indicator
        sortedList.sort((a, b) => {
            const stateA = a.state || "ZZZ"; // Pushes items without a state to the bottom
            const stateB = b.state || "ZZZ";
            return stateA.localeCompare(stateB);
        });
    } 
    else {
        // Default Order
        btn.innerText = "SORT: DEFAULT";
        btn.style.color = "var(--text-main)";
        // sortedList is already the default copy
    }

    renderGuilds(sortedList);
}

// --- MODAL CONTROLS ---
function openModal(modalId) { document.getElementById(modalId).style.display = 'flex'; }
function closeModal(modalId) { document.getElementById(modalId).style.display = 'none'; }
function closeModalOnOutsideClick(event, modalId) {
    if (event.target === document.getElementById(modalId)) closeModal(modalId);
}
