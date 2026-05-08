/* =========================================
   MODAL LOGIC (REQUEST A COACH)
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("request-modal");
    const closeBtn = document.getElementById("close-btn");
    const reviewDraftBtn = document.getElementById("review-draft-btn");
    
    // REPLACE THIS with your actual Vanguard business email address
    const vanguardEmail = "support@yourdomain.com"; 

    // Function to open the modal (can be called globally)
    window.openModal = function() {
        modal.classList.add("active");
    };

    // Listen for clicks on dynamically generated "Request Help" buttons inside your tiers container
    document.getElementById("tiers-container").addEventListener("click", function(e) {
        // If the clicked element or its parent has a class or ID indicating it's the request button
        // (Adjust the class name 'btn-request-help' below to match the actual class on your tier buttons)
        if (e.target.closest(".btn-request-help")) {
            e.preventDefault();
            window.openModal();
        }
    });

    // Close the modal when clicking the X
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    // Close modal if user clicks outside the card
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    // Handle the Draft generation when they click "Review Draft"
    reviewDraftBtn.addEventListener("click", () => {
        const name = document.getElementById("req-name").value.trim();
        const email = document.getElementById("req-email").value.trim();
        const phone = document.getElementById("req-phone").value.trim();
        const goal = document.getElementById("req-goal").value.trim();
        const adultPresent = document.getElementById("req-adult").checked;

        // Validation check
        if (!name || !email || !goal || !adultPresent) {
            alert("Please fill out your Name, Email, your Goal, and agree to the Adult Presence requirement before continuing.");
            return;
        }

        // Format the email subject and body
        const subject = encodeURIComponent(`Tech Coaching Request: ${name}`);
        const bodyText = 
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone || "Not provided"}\n\n` +
            `--- WHAT I WOULD LIKE TO ACHIEVE ---\n` +
            `${goal}\n\n` +
            `------------------------------------\n` +
            `* I confirm that an adult (18+) will be present for the duration of the in-person appointment.`;

        const body = encodeURIComponent(bodyText);

        // Open the user's email client
        window.location.href = `mailto:${vanguardEmail}?subject=${subject}&body=${body}`;
        
        // Close the modal after generating the draft
        modal.classList.remove("active");
        
        // Optional: clear the form so it's empty if they open it again
        document.getElementById("tech-request-form").reset();
    });
});
