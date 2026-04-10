/* VANGUARD INTERACTION ENGINE */

// 1. SPATIAL TILT
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 15; // Subtle tilt
    const y = (e.clientY / window.innerHeight - 0.5) * -15;

    const interactives = document.querySelectorAll('.node, .page-title');
    interactives.forEach(el => {
        el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
    });
});

// 2. CONSOLE LOG (Professional touch for the "Upgraded Relic")
console.log("%c VANGUARD CITIZEN SERVICES %c Operational ", 
            "color: #D4AF37; font-weight: bold; background: #0D0D0D; padding: 5px;", 
            "color: #BF94FF; background: #1a1a1a; padding: 5px;");
