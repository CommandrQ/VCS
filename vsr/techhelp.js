document.addEventListener("DOMContentLoaded", () => {
    const tiersContainer = document.getElementById("tiers-container");
    const modal = document.getElementById("request-modal");
    const step1 = document.getElementById("modal-step-1");
    const step2 = document.getElementById("modal-step-2");
    
    let selectedPackageName = "";

    // 1. FETCH AND RENDER CARDS FROM JSON
    fetch('tiers.json')
        .then(response => response.json())
        .then(data => {
            renderTiers(data);
        })
        .catch(err => console.error("Error loading tiers:", err));

    function renderTiers(tiers) {
        tiersContainer.innerHTML = tiers.map(tier => `
            <div class="service-card">
                <h3>${tier.title}</h3>
                <p class="tier-price">${tier.price || ''}</p>
                <button class="btn-request-help" 
                        data-title="${tier.title}" 
                        data-desc="${tier.description}">
                    Request Help
                </button>
            </div>
        `).join('');
    }

    // 2. MODAL NAVIGATION LOGIC
    tiersContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-request-help");
        if (btn) {
            selectedPackageName = btn.getAttribute("data-title");
            const description = btn.getAttribute("data-desc");

            // Populate Modal Step 1
            document.getElementById("modal-package-title").innerText = selectedPackageName;
            document.getElementById("modal-package-description").innerText = description;

            // Show Step 1, Hide Step 2, Open Modal
            step1.style.display = "block";
            step2.style.display = "none";
            modal.classList.add("active");
        }
    });

    document.getElementById("btn-continue-to-form").addEventListener("click", () => {
        step1.style.display = "none";
        step2.style.display = "block";
    });

    document.getElementById("btn-go-back").addEventListener("click", () => {
        modal.classList.remove("active");
    });

    document.getElementById("close-btn").addEventListener("click", () => {
        modal.classList.remove("active");
    });

    // 3. EMAIL GENERATION
    document.getElementById("review-draft-btn").addEventListener("click", () => {
        const name = document.getElementById("req-name").value.trim();
        const email = document.getElementById("req-email").value.trim();
        const goal = document.getElementById("req-goal").value.trim();
        const adult = document.getElementById("req-adult").checked;

        if (!name || !email || !adult) {
            alert("Please complete all required fields and check the adult presence box.");
            return;
        }

        const vanguardEmail = "support@yourvanguard.com"; // UPDATE THIS
        const subject = encodeURIComponent(`Coaching Request: ${selectedPackageName}`);
        const body = encodeURIComponent(
            `I am interested in the ${selectedPackageName} package.\n\n` +
            `Client: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message: ${goal}\n\n` +
            `* Adult presence confirmed.`
        );

        window.location.href = `mailto:${vanguardEmail}?subject=${subject}&body=${body}`;
        modal.classList.remove("active");
    });
});
