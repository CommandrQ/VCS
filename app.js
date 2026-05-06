const supabaseUrl = 'https://dvyjupytbwbrcoyouxpf.supabase.co/rest/v1/';
const supabaseKey = 'sb_publishable_wjgbPekKmodd5mSDXIeUeg_Wq73GzOk';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Global data stores
let categories = [];
let resources = [];
let alliances = [];

window.onload = async () => {
    try {
        // 1. Fetch all data simultaneously
        const [catRes, resRes, allRes] = await Promise.all([
            fetch('categories.json'),
            fetch('resources.json'),
            fetch('alliances.json')
        ]);

        categories = await catRes.json();
        resources = await resRes.json();
        alliances = await allRes.json();

        // 2. Initialize UI
        renderCategoryTuner();
        renderHUD("All", document.querySelector('.cat-btn')); // Default view

        // 3. Auth Check
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            document.getElementById('lobby-view').classList.add('hidden');
            document.getElementById('hud-view').classList.remove('hidden');
            document.getElementById('user-display').innerText = `ID: ${session.user.user_metadata.first_name || 'CITIZEN'}`;
        }
    } catch (err) {
        console.error("Vanguard Data Sync Error:", err);
    }
};

function renderCategoryTuner() {
    const bar = document.getElementById('cat-bar');
    bar.innerHTML = ""; // Clear existing
    categories.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.className = index === 0 ? 'cat-btn active' : 'cat-btn';
        btn.innerText = cat.toUpperCase();
        btn.onclick = (e) => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderHUD(cat);
        };
        bar.appendChild(btn);
    });
}

function renderHUD(filter) {
    const resList = document.getElementById('res-list');
    const allList = document.getElementById('all-list');
    
    resList.innerHTML = "";
    allList.innerHTML = "";

    // Filter Logic
    const showAll = filter === "All";
    
    // Fill Resources (Left Pane)
    resources.filter(r => showAll || r.cat === filter).forEach(item => {
        resList.innerHTML += `
            <div class="item-card">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <a href="${item.url}" class="gold-link">VIEW RESOURCE ></a>
            </div>`;
    });

    // Fill Alliances (Right Pane)
    alliances.filter(a => showAll || a.cat === filter).forEach(item => {
        allList.innerHTML += `
            <div class="item-card">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <a href="${item.url}" target="_blank" class="gold-link">VISIT ALLIANCE ></a>
            </div>`;
    });
}
