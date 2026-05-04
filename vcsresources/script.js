/* VCS DYNAMIC DATA ENGINE - v09.JSON */

document.addEventListener("DOMContentLoaded", () => {
    loadResources();
    loadGuilds();
});

// Helper function: Smart Link Routing
function getTargetAttribute(url) {
    if (url && !url.startsWith("mailto:") && url !== "#") {
        if (url.startsWith('http') || url.startsWith('//')) {
            return 'target="_blank" rel="noopener noreferrer"';
        }
    }
    return 'target="_self"';
}

// Fetch and render Resources (Left Column)
async function loadResources() {
    const container = document.getElementById('resources-container');
    try {
        const response = await fetch('json/resources.json');
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        
        container.innerHTML = ''; // Clear loading text
        
        data.forEach(item => {
            const highlightClass = item.highlight ? 'highlight' : '';
            const targetInfo = getTargetAttribute(item.link);
            
            container.innerHTML += `
                <div class="resource-item ${highlightClass}">
                    <div class="item-info">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                    <a href="${item.link}" class="tier-btn" ${targetInfo}>${item.buttonText}</a>
                </div>
            `;
        });
    } catch (error) {
        console.error("Resource Uplink Failed:", error);
        container.innerHTML = `<p style="color: red;">[ ERROR: FAILED TO LOAD RESOURCES ]</p>`;
    }
}

// Fetch and render Guilds (Right Column)
async function loadGuilds() {
    const container = document.getElementById('guilds-container');
    try {
        const response = await fetch('json/guilds.json');
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        
        container.innerHTML = ''; // Clear loading text
        
        data.forEach(guild => {
            const lockedClass = guild.locked ? 'locked' : '';
            const targetInfo = getTargetAttribute(guild.link);
            
            // If locked, render a disabled button instead of an anchor tag
            const buttonHTML = guild.locked 
                ? `<button class="contact-btn" disabled>${guild.buttonText}</button>`
                : `<a href="${guild.link}" class="contact-btn" ${targetInfo}>${guild.buttonText}</a>`;

            container.innerHTML += `
                <div class="guild-card ${lockedClass}">
                    <div class="guild-header">${guild.title}</div>
                    <p>${guild.description}</p>
                    ${buttonHTML}
                </div>
            `;
        });
    } catch (error) {
        console.error("Guild Uplink Failed:", error);
        container.innerHTML = `<p style="color: red;">[ ERROR: FAILED TO ESTABLISH GUILD NETWORK ]</p>`;
    }
}
