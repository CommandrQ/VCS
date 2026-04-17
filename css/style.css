:root {
    --void-obsidian: #0D0D0D;
    --deep-shadow: #050505;
    --relic-gold: #D4AF37;
    --aura-purple: #BF94FF;
    --starlight-white: #F5F5F7;
    --iron-mist: #86868B;
    --success-green: #00FF41;
}

body {
    margin: 0; padding: 0;
    background-color: var(--deep-shadow);
    color: var(--starlight-white);
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro", sans-serif;
    overflow: hidden; 
    user-select: none; 
}

.cinzel-heading { font-family: 'Cinzel', serif; font-weight: 700; text-shadow: 2px 2px 4px #000; }
.centered-text { text-align: center; }
.centered-flex-col { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.hidden { display: none !important; }

/* LAYOUT */
.fullscreen-flex { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vw; position: relative;}
.vertical-spacer { height: 30px; }

/* OS STATUS */
.os-status-container { display: flex; align-items: center; gap: 10px; margin-top: 5px; }
.status-dot { width: 8px; height: 8px; background-color: var(--success-green); border-radius: 50%; box-shadow: 0 0 8px var(--success-green); animation: statusPulse 2s infinite; }
@keyframes statusPulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }

/* RPG BOXES */
.rpg-box {
    background: linear-gradient(135deg, var(--void-obsidian) 0%, var(--deep-shadow) 100%);
    border: 2px solid var(--relic-gold);
    border-radius: 4px;
    box-shadow: inset 0 0 15px #000, 4px 4px 10px #000;
    padding: 1rem;
    color: var(--starlight-white);
    text-align: center;
}
button.rpg-box { cursor: pointer; font-family: 'Cinzel', serif; transition: 0.3s; outline: none; }
.hover-glow:hover { box-shadow: inset 0 0 15px rgba(191,148,255,0.5), 0 0 15px rgba(212,175,55,0.6); border-color: var(--starlight-white); }
.pulse-border { animation: goldPulse 3s infinite alternate; }
@keyframes goldPulse { from { border-color: var(--relic-gold); } to { border-color: var(--starlight-white); box-shadow: 0 0 15px var(--relic-gold); } }

/* BACKGROUNDS */
#tech-background { position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -5; background-image: linear-gradient(rgba(245,245,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,247,0.05) 1px, transparent 1px); background-size: 50px 50px; }
#center-aura { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 10px; height: 10px; z-index: -4; animation: auraPulse 9s infinite; }
@keyframes auraPulse { 0%, 100% { box-shadow: 0 0 200px 120px rgba(0,85,255,0.4); } 33% { box-shadow: 0 0 200px 120px rgba(255,0,85,0.4); } 66% { box-shadow: 0 0 200px 120px rgba(212,175,55,0.4); } }
#hub-background { position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -5; background: radial-gradient(circle at center, #0D0D0D 0%, #050505 100%); }

/* CAROUSEL */
.mirrorgates-viewport { perspective: 1500px; width: 100%; max-width: 900px; height: 450px; position: relative; display: flex; align-items: center; justify-content: center; }
.carousel-track { width: 240px; height: 320px; position: absolute; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
.mirrorgate-node { position: absolute; width: 240px; height: 320px; backface-visibility: hidden; opacity: 0.15; transition: 0.5s; pointer-events: none; }
.mirrorgate-node.active-gate { opacity: 1; pointer-events: auto; }
.gate-image-container { width: 100%; height: 150px; border: 1px solid var(--relic-gold); margin-bottom: 1.5rem; overflow: hidden; background: #000; }
.gate-image-container img { width: 100%; height: 100%; object-fit: cover; }

.mirrorgate-node:nth-child(1) { transform: rotateY(0deg) translateZ(450px); }
.mirrorgate-node:nth-child(2) { transform: rotateY(90deg) translateZ(450px); }
.mirrorgate-node:nth-child(3) { transform: rotateY(180deg) translateZ(450px); }
.mirrorgate-node:nth-child(4) { transform: rotateY(270deg) translateZ(450px); }

/* FLOATING CONTROLS */
.floating-controls { position: absolute; width: 100%; display: flex; justify-content: space-between; z-index: 100; pointer-events: none; padding: 0 20px; box-sizing: border-box; }
.floating-controls button { pointer-events: auto; font-size: 0.8rem; padding: 0.5rem 1rem; }

/* TRANSITIONS */
#flash-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: var(--starlight-white); z-index: 9999; opacity: 0; pointer-events: none; transition: 1.5s; }
.flash-active { opacity: 1 !important; }
#wipe-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: var(--void-obsidian); z-index: 9998; transform: translateX(100%); transition: 0.6s cubic-bezier(0.7,0,0.3,1); }
.wipe-left-active { transform: translateX(0) !important; }

/* TEXT ANIMATIONS */
.fade-in { opacity: 0; animation: fadeInAnim 1.5s forwards; }
.pop-in { opacity: 0; transform: scale(0.9); animation: popInAnim 0.3s forwards; }
@keyframes fadeInAnim { to { opacity: 1; } }
@keyframes popInAnim { to { opacity: 1; transform: scale(1); } }
