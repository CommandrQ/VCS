/* VCS SMART LINK CONTROLLER - v01.A */
/* Automatically routes external links to new tabs and keeps internal links local. */

document.addEventListener("DOMContentLoaded", function() {
    // Select every anchor (link) tag on the page
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        const href = link.getAttribute('href');

        // Check if the link has a destination and isn't just an empty anchor (#)
        if (href && href !== "#" && !href.startsWith("mailto:")) {
            
            // If the link starts with http, https, or //, it is an EXTERNAL GUILD/SITE
            if (href.startsWith('http') || href.startsWith('//')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer'); // Security standard for new tabs
            } 
            // Otherwise, it is an INTERNAL RESOURCE or FOLDER
            else {
                link.setAttribute('target', '_self');
            }
        }
    });
    
    // Optional: Log status to console for operator verification
    console.log("VCS Link Controller: ONLINE. Routing protocols active.");
});
