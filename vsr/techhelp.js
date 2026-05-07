const SB_URL = 'https://dvyjupytbwbrcoyouxpf.supabase.co';
const SB_KEY = 'sb_publishable_wjgbPekKmodd5mSDXIeUeg_Wq73GzOk';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

let currentSelection = { tier: '', price: '' };
let isUserSignedIn = false;

window.onload = () => {
    document.getElementById('current-year').innerText = new Date().getFullYear();
    loadTiers();
    checkAuth();
};

async function loadTiers() {
    try {
        const response = await fetch('tiers.json');
        const tiers = await response.json();
        const container = document.getElementById('tiers-container');
        const now = new Date();

        tiers.forEach(tier => {
            const featuresHTML = tier.features.map(f => `<li>${f}</li>`).join('');
            let promoBadge = '';
            let displayPrice = tier.price;
            
            // Evaluates Student Promo
            if (tier.studentPromo && tier.studentPromo.active && now <= new Date(tier.studentPromo.deadline)) {
                promoBadge = `<div class="student-badge">${tier.studentPromo.label}</div>`;
                displayPrice = `${tier.price} <span style="display:block; font-size:0.8rem; font-weight:400; color:#fff; margin-top:4px;">(${tier.studentPromo.price} Student Rate)</span>`;
            }

            const card = document.createElement('div');
            card.className = 'solid-card';
            card.innerHTML = `
                ${promoBadge}
                <h3 class="tier-title">${tier.title}</h3>
                <p class="tier-price">${displayPrice}</p>
                <ul class="tier-features">${featuresHTML}</ul>
                <button class="btn-request" onclick="openModal('${tier.title}', '${tier.price}', ${!!tier.studentPromo})">Request Help</button>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading tiers:", error);
    }
}

async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        isUserSignedIn = true;
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('auth-address-field').style.display = 'block';
        
        const { data } = await supabaseClient.from('citizens').select('full_name').eq('auth_id', session.user.id).single();
        if (data) document.getElementById('f-name').value = data.full_name;
        
        const emailInput = document.getElementById('f-email');
        emailInput.value = session.user.email;
        emailInput.disabled = true;
    }
}

function openModal(tier, price, hasPromo) {
    currentSelection = { tier, price };
    document.getElementById('modal-tier-title').innerText = tier;
    document.getElementById('student-check-container').style.display = hasPromo ? 'block' : 'none';
    document.getElementById('request-modal').style.display = 'flex';
}

function closeModal() { 
    document.getElementById('request-modal').style.display = 'none'; 
}

function submitRequest() {
    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const issue = document.getElementById('f-issue').value.trim();
    const isStudent = document.getElementById('f-student').checked;

    if (!name || !phone || !issue) { 
        alert("Please complete the required fields (Name, Phone, Message)."); 
        return; 
    }

    let body = `--- VANGUARD DISPATCH LOG ---\nTier: ${currentSelection.tier}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nStudent Rate Active: ${isStudent ? 'YES' : 'NO'}\n\n[MESSAGE DETAILS]\n${issue}`;
    
    if (isUserSignedIn) {
        const address = document.getElementById('f-address').value.trim();
        const adult = document.getElementById('f-adult').value.toUpperCase();
        if (!address || adult !== "YES") { 
            alert("Vanguard protocol requires Service Address and Adult Verification for dispatch."); 
            return; 
        }
        body += `\n\n[LOGISTICS]\nAddress: ${address}\nAdult Present: YES`;
    }

    window.location.href = `mailto:commandrq@gmail.com?subject=Vanguard Support Request: ${currentSelection.tier}&body=${encodeURIComponent(body)}`;
    closeModal();
}
