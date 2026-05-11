// Supabase Configuration
const SB_URL = 'https://dvyjupytbwbrcoyouxpf.supabase.co';
const SB_KEY = 'sb_publishable_wjgbPekKmodd5mSDXIeUeg_Wq73GzOk';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// Data Structure (Add as many as needed here)
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

let directoryData = {};

const ui = {
    greeting: document.getElementById('user-greeting'),
    pop: document.getElementById('population-count'),
    catBar: document.getElementById('category-bar'),
    dirList: document.getElementById('directory-list'),
    searchInput: document.getElementById('hub-search')
};

async function init() {
    // Dynamic Copyright Year
    document.getElementById('current-year').innerText = new Date().getFullYear();

    // Alphabetize the data payload
    directoryData = sortVanguardData(directoryDataRaw);

    // Initial Local Storage Check
    const cached = JSON.parse(localStorage.getItem('vanguard_profile'));
    if (cached && cached.name) {
        ui.greeting.innerText = `Welcome, ${cached.name}`;
    }

    checkUser();
    fetchPop();
    renderHub();
    startFooterCycle();
}

function sortVanguardData(data) {
    const sortedData = {};
    const categories = Object.keys(data).sort();
    categories.forEach(category => {
        sortedData[category] = data[category].sort((a, b) => a.title.localeCompare(b.title));
    });
    return sortedData;
}

async function checkUser() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (user) {
        const name = user.user_metadata?.full_name || user.email.split('@')[0];
        ui.greeting.innerText = `Welcome, ${name}`;
        localStorage.setItem('vanguard_profile', JSON.stringify({ name: name, email: user.email }));
    }
}

async function fetchPop() {
    const { count, error } = await supabaseClient.from('citizens').select('*', { count: 'exact', head: true });
    ui.pop.innerText = error ? "Online" : count.toLocaleString();
}

function renderHub() {
    const categories = Object.keys(directoryData);
    ui.catBar.innerHTML = categories.map((cat, i) => `
        <button class="cat-btn ${i === 0 ? 'active' : ''}" onclick="showCat('${cat}', this)">${cat}</button>
    `).join('');
    
    // Render first category by default
    if(categories.length > 0) {
        showCat(categories[0], ui.catBar.querySelector('.cat-btn'));
    }
}

window.showCat = (name, btn) => {
    // Clear Search text when navigating manually
    ui.searchInput.value = '';
    
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Scroll button smoothly into view
    btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    
    renderCards(directoryData[name]);
}

function renderCards(cardsArray) {
    ui.dirList.innerHTML = cardsArray.map((card, index) => `
        <div class="link-card" style="animation-delay: ${index * 0.05}s">
            <h3 class="card-title">${card.title}</h3>
            <p class="card-desc">${card.desc}</p>
            <a href="${card.url}" class="card-btn">Open</a>
        </div>
    `).join('');
}

// Real-Time Search Logic
ui.searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    
    if (!term) {
        renderHub();
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
        renderCards(matches);
    } else {
        ui.dirList.innerHTML = '<div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">No matching resources found in the archives.</div>';
    }
});

function startFooterCycle() {
    const msg1 = document.getElementById('footer-msg-1');
    const msg2 = document.getElementById('footer-msg-2');
    
    setInterval(() => {
        if (msg1.classList.contains('active')) {
            msg1.classList.remove('active');
            setTimeout(() => msg2.classList.add('active'), 800); 
        } else {
            msg2.classList.remove('active');
            setTimeout(() => msg1.classList.add('active'), 800);
        }
    }, 4000);
}

// Bootstrap Application
window.onload = init;
