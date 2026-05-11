// --- THE DIRECTORY ENGINE ---
const directoryDataRaw = {
    "Vanguard Tech Lab": [
        { 
            title: "Tech Consulting", 
            desc: "Personalized strategy for seniors, parents, and high-performance individuals.", 
            url: "vsr/techhelp.html" 
        }
    ],
    "System Settings": [
        { 
            title: "Support Terminal", 
            desc: "Establish a direct uplink for technical help or general inquiries.", 
            url: "support.html" 
        },
        { 
            title: "Legal Documents", 
            desc: "Review the Citizen Agreement, Privacy Protocols, and Terms of Service.", 
            url: "legal.html" 
        }
    ]
};

// --- PROFILE RESET FIX ---
async function updateHubGreeting() {
    const greetingElement = document.getElementById('user-greeting');
    
    // 1. Check Supabase Session
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    // 2. Check Local Cache
    const cachedProfile = JSON.parse(localStorage.getItem('vanguard_profile'));

    if (user && cachedProfile && cachedProfile.name) {
        // User is logged in and has a name set
        greetingElement.innerText = `Welcome, ${cachedProfile.name}`;
    } else if (user) {
        // User is logged in but no name set yet
        greetingElement.innerText = "Welcome, Citizen";
    } else {
        // NO USER DETECTED - Reset to default
        greetingElement.innerText = "Welcome";
        
        // Safety: Ensure local storage is actually empty if no session exists
        localStorage.removeItem('vanguard_profile');
    }
}

// Call this on page load
document.addEventListener('DOMContentLoaded', () => {
    updateHubGreeting();
    // ... existing render logic ...
});
