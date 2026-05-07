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
    const response = await fetch('tiers.json');
    const tiers = await response.json();
    const container = document.getElementById('tiers-container');
    const now = new Date();

    tiers.forEach(tier => {
        const featuresHTML = tier.features.map(f => `<li>${f}</li>`).join('');
        const footnoteHTML = tier.footnote ? `<p class="tier-footnote">${tier.footnote}</p>` : '';
        let promoBadge = '';
        let displayPrice = tier.price;
        
        if (tier.studentPromo && tier.studentPromo.active) {
            if (now <= new Date(tier.studentPromo.deadline)) {
                promoBadge = `<div class="student-badge">${tier.studentPromo.label}</div>`;
                displayPrice = `${tier.price} <span class="student-rate">(${tier.studentPromo.price} Student Rate)</span>`;
            }
        }

        const card = document.createElement('div');
        card.className = 'solid-card';
        card.innerHTML = `${promoBadge}<h3 class="tier-title">${tier.title}</h3><p class="tier-price">${displayPrice}</p><ul class="tier-features">${featuresHTML}</ul>${footnoteHTML}<button class="btn-request" onclick="openModal('${tier.title}', '${tier.price}', ${!!tier.studentPromo})">Request Help</button>`;
        container.appendChild(card);
    });
}

async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        isUserSignedIn = true;
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('auth-address-field').style.display = 'block';
        const { data } = await supabaseClient.from('citizens').select('full_name').eq('auth_id', session.user.id).single();
        if (data) document.getElementById('f-name').value = data.full_name;
        document.getElementById('f-email').value = session.user.email;
        document.getElementById('f-email').disabled = true;
    }
}

function openModal(tier, price, hasPromo) {
    currentSelection = { tier, price };
    document.getElementById('modal-tier-title').innerText = tier;
    document.getElementById('student-check-container').style.display = hasPromo ? 'block' : 'none';
    document.getElementById('request-modal').style.display = 'flex';
}

function closeModal() { document.getElementById('request-modal').style.display = 'none'; }

function submitRequest() {
    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const issue = document.getElementById('f-issue').value.trim();
    const isStudent = document.getElementById('f-student').checked;

    if (!name || !phone || !issue) { alert("Standard fields required."); return; }

    let body = `--- VANGUARD DISPATCH LOG ---\nTier: ${currentSelection.tier}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nStudent Discount: ${isStudent ? 'YES ($50 RATE)' : 'NO'}\n\n[MESSAGE]\n${issue}`;
    
    if (isUserSignedIn) {
        const address = document.getElementById('f-address').value;
        const adult = document.getElementById('f-adult').value.toUpperCase();
        if (!address || adult !== "YES") { alert("Address and Adult Verification required."); return; }
        body += `\n\n[LOGISTICS]\nAddress: ${address}\nAdult Present: YES\n14-Day Warranty Active: YES`;
    }

    window.location.href = `mailto:commandrq@gmail.com?subject=Vanguard Support: ${currentSelection.tier}&body=${encodeURIComponent(body)}`;
    closeModal();
}
