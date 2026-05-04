/* VCS DYNAMIC DATA ENGINE - v09.DIAGNOSTIC */

document.addEventListener("DOMContentLoaded", () => {
    loadResources();
    loadGuilds();
});

function getTargetAttribute(url) {
    if (url && !url.startsWith("mailto:") && url !== "#") {
        if (url.startsWith('http') || url.startsWith('//')) {
            return 'target="_blank" rel="noopener noreferrer"';
        }
    }
    return 'target="_self"';
}

async function loadResources() {
    const container = document.getElementById('resources-container');
    try {
        const response = await fetch('json/resources.json');
        
        // This checks if the file path is actually correct
        if (!response.ok) throw new Error(`HTTP Error ${response.status} - Path not found`);
        
        const data = await response.json();
        container.innerHTML = ''; 
        
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
        // This will print the EXACT error to your screen
        container.innerHTML = `<p style="color: #ff5f1f;">[ SYSTEM FAULT: ${error.message} ]<br><span style="font-size: 0.8rem; color: #8b949e;">Check Console (F12) or verify JSON formatting / Local Server status.</span></p>`;
    }
}

async function loadGuilds() {
    const container = document.getElementById('guilds-container');
    try {
        const response = await fetch('json/guilds.json');
        
        if (!response.ok) throw new Error(`HTTP Error ${response.status} - Path not found`);
        
        const data = await response.json();
        container.innerHTML = ''; 
        
        data.forEach(guild => {
            const lockedClass = guild.locked ? 'locked' : '';
            const targetInfo = getTargetAttribute(guild.link);
            
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
        // Prints error to screen
        container.innerHTML = `<p style="color: #ff5f1f;">[ SYSTEM FAULT: ${error.message} ]<br><span style="font-size: 0.8rem; color: #8b949e;">Check Console (F12) or verify JSON formatting / Local Server status.</span></p>`;
    }
}
