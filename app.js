const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let vData = {};

window.onload = async () => {
    // 1. Fetch Data
    const res = await fetch('categories.json');
    vData = await res.json();
    
    // 2. Check Auth
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        renderHUD(session.user);
    }
};

function showAuth() { document.getElementById('auth-modal').classList.remove('hidden'); }
function closeModals() { document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden')); }

async function handleAuth() {
    const email = document.getElementById('uemail').value;
    const name = document.getElementById('fname').value;
    const { error } = await supabase.auth.signInWithOtp({
        email, options: { data: { first_name: name }, emailRedirectTo: window.location.origin }
    });
    if (!error) alert("Clearance Link Sent to Email.");
}

function renderHUD(user) {
    document.getElementById('lobby-view').classList.add('hidden');
    document.getElementById('hud-view').classList.remove('hidden');
    document.getElementById('user-display').innerText = `ID: ${user.user_metadata.first_name || 'CITIZEN'}`;
    
    const catBar = document.getElementById('cat-bar');
    vData.categories.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        btn.innerText = c;
        btn.onclick = () => filterContent(c, btn);
        catBar.appendChild(btn);
    });
    filterContent("All", catBar.firstChild);
}

function filterContent(cat, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const render = (listId, dataKey) => {
        const list = document.getElementById(listId);
        list.innerHTML = "";
        vData[dataKey].filter(item => cat === "All" || item.cat === cat).forEach(item => {
            list.innerHTML += `<div class="item-card"><h3>${item.name}</h3><p>${item.desc}</p></div>`;
        });
    };
    render('res-list', 'resources');
    render('all-list', 'alliances');
}

function showRequestModal() { document.getElementById('request-modal').classList.remove('hidden'); }

async function submitMission() {
    const details = document.getElementById('mission-details').value;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('vault_help_requests').insert([
        { first_name: user.user_metadata.first_name, email: user.email, request_details: details }
    ]);
    if (!error) { alert("SIGNAL RECEIVED."); closeModals(); }
}
