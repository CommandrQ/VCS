// --- 1. SUPABASE INITIALIZATION ---
const SB_URL = 'https://dvyjupytbwbrcoyouxpf.supabase.co';
const SB_KEY = 'sb_publishable_wjgbPekKmodd5mSDXIeUeg_Wq73GzOk';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// --- 2. GLOBAL STATE ---
let currentSelection = { tier: '', price: '' };
let isUserSignedIn = false;

// --- 3. SYSTEM BOOT ---
window.onload = () => {
    // Set persistent footer year
    document.getElementById('current-year').innerText = new Date().getFullYear();
    
    // Build page data
    loadTiers();
    checkAuth();
};

// --- 4. FETCH & RENDER TIERS ---
async function loadTiers() {
    try {
        const response = await fetch('tiers.json');
        const tiers = await response.json();
        const container = document.getElementById('tiers-container');

        tiers.forEach(tier => {
            // Build features list
            const featuresHTML = tier.features.map(f => `<li>${f}</li>`).join('');
            
            // Build footnote (if exists)
            const footnoteHTML = tier.footnote ? `<p class="tier-footnote">${tier.footnote}</p>` : '';

            // Construct Card
            const card = document.createElement('div');
            card.className = 'solid-card';
            card.innerHTML = `
                <h3 class="tier-title">${tier.title}</h3>
                <p class="tier-price">${tier.price}</p>
                <ul class="tier-features">${featuresHTML}</ul>
                ${footnoteHTML}
                <button class="btn-request" onclick="openModal('${tier.title}', '${tier.price}')">Request Help</button>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Failed to load tiers.json:", error);
        document.getElementById('tiers-container').innerHTML = '<p style="color:#f87171;">Failed to load service tiers. Please check network connection.</p>';
    }
}

// --- 5. DYNAMIC AUTH LOGIC ---
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const authSection = document.getElementById('auth-section');

    if (session) {
        isUserSignedIn = true;
        authSection.style.display = 'block';

        // Fetch Citizen Data to Auto-fill
        const { data } = await supabaseClient.from('citizens').select('full_name').eq('auth_id', session.user.id).single();
        
        if (data && data.full_name) {
            document.getElementById('f-name').value = data.full_name;
        }
        document.getElementById('f-email').value = session.user.email;
        document.getElementById('f-email').disabled = true; 
    } else {
        isUserSignedIn = false;
        authSection.style.display = 'none';
    }
}

// --- 6. MODAL LOGIC ---
function openModal(tierName, price) {
    currentSelection.tier = tierName;
    currentSelection.price = price;
    
    document.getElementById('modal-tier-title').innerText = `${tierName} (${price})`;
    document.getElementById('sys-msg').innerText = ''; 
    document.getElementById('request-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('request-modal').style.display = 'none';
    document.getElementById('sys-msg').innerText = '';
}

// --- 7. SUBMISSION LOGIC (Mailto Compiler) ---
function submitRequest() {
    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const issue = document.getElementById('f-issue').value.trim();
    const sysMsg = document.getElementById('sys-msg');

    // Basic Validation
    if (!name || !email || !phone || !issue) {
        sysMsg.innerText = "Error: Please fill out all standard fields.";
        return;
    }

    let address = "";
    let adultVerification = "";

    // Advanced Validation if Signed In
    if (isUserSignedIn) {
        address = document.getElementById('f-address').value.trim();
        adultVerification = document.getElementById('f-adult').value.trim().toUpperCase();

        if (!address) {
            sysMsg.innerText = "Error: Verified Citizens must provide a Service Address.";
            return;
        }
        if (adultVerification !== "YES") {
            sysMsg.innerText = "Error: You must type 'YES' to confirm an adult will be present.";
            return;
        }
    }

    // Construct Dispatch Log
    let emailBody = `--- VANGUARD DISPATCH LOG ---\n`;
    emailBody += `Requested Tier: ${currentSelection.tier} (${currentSelection.price})\n\n`;
    
    emailBody += `[CITIZEN DETAILS]\n`;
    emailBody += `Name: ${name}\n`;
    emailBody += `Email: ${email}\n`;
    emailBody += `Phone: ${phone}\n\n`;

    emailBody += `[ISSUE DESCRIPTION]\n`;
    emailBody += `${issue}\n\n`;

    // Append Advanced Details if Signed in
    if (isUserSignedIn) {
        emailBody += `[SERVICE LOGISTICS]\n`;
        emailBody += `Address: ${address}\n`;
        emailBody += `Adult Present Verified: ${adultVerification}\n`;
        emailBody += `Policy Agreement Confirmed: YES\n`;
    }
    
    emailBody += `\n--- END OF TRANSMISSION ---`;

    // Mailto Execution
    const subjectLine = encodeURIComponent(`Vanguard Support Request: ${currentSelection.tier}`);
    const encodedBody = encodeURIComponent(emailBody);
    const mailtoLink = `mailto:commandrq@gmail.com?subject=${subjectLine}&body=${encodedBody}`;

    // Trigger Email Client and Close Modal
    window.location.href = mailtoLink;
    closeModal();
}
