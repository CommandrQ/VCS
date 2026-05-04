/* VSR TERMINAL SCRIPT - LINK ROUTING & MODALS */

document.addEventListener("DOMContentLoaded", () => {
    // Automatically secures any external links (if you add them later)
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const url = link.getAttribute('href');
        if (url && !url.startsWith("mailto:") && url !== "#" && !url.startsWith("javascript:")) {
            if (url.startsWith('http') || url.startsWith('//')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        }
    });
});

// --- MODAL CONTROLS ---

function openModal(modalId) { 
    document.getElementById(modalId).style.display = 'flex'; 
}

function closeModal(modalId) { 
    document.getElementById(modalId).style.display = 'none'; 
}

// Closes modal if user clicks the dark background outside the terminal box
function closeModalOnOutsideClick(event, modalId) {
    if (event.target === document.getElementById(modalId)) {
        closeModal(modalId);
    }
}
