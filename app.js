document.addEventListener('DOMContentLoaded', () => {
    
    // --- GATE LOGIC (index.html) ---
    const enterBtn = document.getElementById('enter-btn');
    const fadeOverlay = document.getElementById('fade-overlay');

    if (enterBtn && fadeOverlay) {
        enterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = enterBtn.getAttribute('href');
            fadeOverlay.classList.add('active');
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 1000); 
        });
    }

    // --- SHARED LOGIC ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.innerText = new Date().getFullYear();

    // --- HUB LOGIC (hub.html) ---
    if (document.getElementById('directory-core')) {
        initHub();
    }
});

function initHub() {
    // Supabase Configuration
    const SB_URL = 'https://dvyjupytbwbrcoyouxpf.supabase.co';
    const SB_KEY = 'sb_publishable_wjgbPekKmodd5mSDXIeUeg_Wq73GzOk';
    const supabaseClient = window.supabase ? window.supabase.createClient(SB_URL, SB_KEY) : null;

    // Directory Data
    const directoryDataRaw = {
        "The Oracle (FAQ)": [
            { title: "PVA vs. Tax Rates", desc: "The PVA only sets your property value; the School Board and Fiscal Court set the rates. Learn who to talk to.", url: "#" },
            { title: "Mineral vs. Surface Rights", desc: "In Kentucky, you can own the dirt but not the coal or gas underneath. Learn about Split Estates.", url: "#" },
            { title: "The Sheriff’s Tax", desc: "Why you need $15 and a VIN inspection before visiting the County Clerk's office.", url: "#" }
        ],
        "Starter Quests": [
            { title: "Mission: The Legal 30", desc: "Your 30-day window to secure a Kentucky Driver’s License in E-town or Radcliff.", url: "#" },
            { title: "Mission: The Vehicle 15", desc: "You have 15 days to register your car. Specific paperwork needed for Hardin County.", url: "#" },
            { title: "Mission: Domain Enrollment", desc: "How to register your children for Hardin County Schools (HCS).", url: "#" }
        ],
        "Project V": [
            { title: "The Burnout Audit", desc: "A self-assessment tool based on WHO criteria to identify if you are being squeezed.", url: "#" },
            { title: "Mission: Reclaiming Efficacy", desc: "Practical steps to reduce stress and increase professional output by 20%.", url: "#" },
            { title: "The Cost of a Quit", desc: "A deep dive into the $60,000 Replacement Tax and how our guild structure prevents it.", url: "#" }
        ],
        "Vanguard Tech Lab": [
            { title: "Tech Consulting", desc: "Digital or in-person help understanding and connecting with technology.", url: "vsr/techhelp.html" }
        ]
    };

    let directoryData = sortVanguardData(directoryDataRaw);

    const ui = {
        greeting: document.getElementById('user-greeting'),
        pop: document.getElementById('population-count'),
        catBar: document.getElementById('category-bar'),
        dirList: document.getElementById('directory-list'),
        searchInput: document.getElementById('hub-search')
    };

    // Initialize UI
    const cached = JSON.parse(localStorage.getItem('vanguard_profile'));
    if (cached && cached.name && ui.greeting) {
        ui.greeting.innerText = `Welcome, ${cached.name}`;
    }

    if (supabaseClient) {
        checkUser(supabaseClient, ui);
        fetchPop(supabaseClient, ui);
    }
    
    renderHub(directoryData, ui);
    startFooterCycle();

    // Search Listener
    ui.searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (!term) {
            renderHub(directoryData, ui);
            return;
        }

        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        const matches = [];
        
        Object.values(directoryData).forEach(categoryArray => {
            categoryArray.forEach(card => {
                if (card.title.toLowerCase().includes(term) || card.desc.toLowerCase().includes(term)) {
                    matches.push(card);
                }
            });
        });

        matches.sort((a, b) => a.title.localeCompare(b.title));

        if (matches.length > 0) {
            renderCards(matches, ui);
        } else {
            ui.dirList.innerHTML = '<div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">No matching resources found in the archives.</div>';
        }
    });
}

function sortVanguardData(data) {
    const sortedData = {};
    const categories = Object.keys(data).sort();
    categories.forEach(category => {
        sortedData[category] = data[category].sort((a, b) => a.title.localeCompare(b.title));
    });
    return sortedData;
}

async function checkUser(client, ui) {
    const { data: { user } } = await client.auth.getUser();
    if (user && ui.greeting) {
        const name = user.user_metadata?.full_name || user.email.split('@')[0];
        ui.greeting.innerText = `Welcome, ${name}`;
        localStorage.setItem('vanguard_profile', JSON.stringify({ name: name, email: user.email }));
    }
}

async function fetchPop(client, ui) {
    const { count, error } = await client.from('citizens').select('*', { count: 'exact', head: true });
    if (ui.pop) {
        ui.pop.innerText = error ? "Online" : count.toLocaleString();
    }
}

function renderHub(data, ui) {
    const categories = Object.keys(data);
    ui.catBar.innerHTML = categories.map((cat, i) => `
        <button class="cat-btn ${i === 0 ? 'active' : ''}" onclick="showCat('${cat}', this)">${cat}</button>
    `).join('');
    
    if(categories.length > 0) {
        window.showCat(categories[0], ui.catBar.querySelector('.cat-btn'));
    }
}

window.showCat = (name, btn) => {
    const searchInput = document.getElementById('hub-search');
    if(searchInput) searchInput.value = '';
    
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    if(btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    
    // Rely on globally scoped logic or rebuild map access depending on strict scope. 
    // Here we will use the active category button string to search the DOM or state.
    // For a cleaner global pass, we dispatch a custom event or recreate data link:
    const dataRef = {
        "Project V": [
            { title: "Mission: Reclaiming Efficacy", desc: "Practical steps to reduce stress and increase professional output by 20%.", url: "#" },
            { title: "The Burnout Audit", desc: "A self-assessment tool based on WHO criteria to identify if you are being squeezed.", url: "#" },
            { title: "The Cost of a Quit", desc: "A deep dive into the $60,000 Replacement Tax and how our guild structure prevents it.", url: "#" }
        ],
        "Starter Quests": [
            { title: "Mission: Domain Enrollment", desc: "How to register your children for Hardin County Schools (HCS).", url: "#" },
            { title: "Mission: The Legal 30", desc: "Your 30-day window to secure a Kentucky Driver’s License in E-town or Radcliff.", url: "#" },
            { title: "Mission: The Vehicle 15", desc: "You have 15 days to register your car. Specific paperwork needed for Hardin County.", url: "#" }
        ],
        "The Oracle (FAQ)": [
            { title: "Mineral vs. Surface Rights", desc: "In Kentucky, you can own the dirt but not the coal or gas underneath. Learn about Split Estates.", url: "#" },
            { title: "PVA vs. Tax Rates", desc: "The PVA only sets your property value; the School Board and Fiscal Court set the rates. Learn who to talk to.", url: "#" },
            { title: "The Sheriff’s Tax", desc: "Why you need $15 and a VIN inspection before visiting the County Clerk's office.", url: "#" }
        ],
        "Vanguard Tech Lab": [
            { title: "Tech Consulting", desc: "Digital or in-person help understanding and connecting with technology.", url: "vsr/techhelp.html" }
        ]
    };
    
    const uiList = document.getElementById('directory-list');
    if(uiList && dataRef[name]) {
        uiList.innerHTML = dataRef[name].map((card, index) => `
            <div class="link-card" style="animation-delay: ${index * 0.05}s">
                <h3 class="card-title">${card.title}</h3>
                <p class="card-desc">${card.desc}</p>
                <a href="${card.url}" class="card-btn">Open</a>
            </div>
        `).join('');
    }
}

function renderCards(cardsArray, ui) {
    ui.dirList.innerHTML = cardsArray.map((card, index) => `
        <div class="link-card" style="animation-delay: ${index * 0.05}s">
            <h3 class="card-title">${card.title}</h3>
            <p class="card-desc">${card.desc}</p>
            <a href="${card.url}" class="card-btn">Open</a>
        </div>
    `).join('');
}

function startFooterCycle() {
    const msg1 = document.getElementById('footer-msg-1');
    const msg2 = document.getElementById('footer-msg-2');
    
    setInterval(() => {
        if (msg1 && msg1.classList.contains('active')) {
            msg1.classList.remove('active');
            setTimeout(() => { if(msg2) msg2.classList.add('active'); }, 800); 
        } else {
            if(msg2) msg2.classList.remove('active');
            setTimeout(() => { if(msg1) msg1.classList.add('active'); }, 800);
        }
    }, 4000);
}
