<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Grand Citadel</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="css/style.css">

    <style>
        /* The mysterious breathing background for Act I */
        #ethereal-mist {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle at center, rgba(191, 148, 255, 0.15) 0%, rgba(5, 5, 5, 1) 70%);
            z-index: -1; /* Keeps it behind the button */
            animation: breathe 6s infinite alternate ease-in-out;
        }

        /* The idle pulsing animation for the Knock button to draw the user in */
        .idle-pulse {
            animation: buttonPulse 3s infinite alternate ease-in-out;
        }

        @keyframes breathe {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(1.1); opacity: 1; }
        }

        @keyframes buttonPulse {
            0% { box-shadow: inset 0 0 10px rgba(0,0,0,0.9), 0 0 5px rgba(212, 175, 55, 0.3); }
            100% { box-shadow: inset 0 0 15px rgba(191, 148, 255, 0.2), 0 0 20px rgba(212, 175, 55, 0.6); }
        }
    </style>
</head>
<body>

    <div id="flash-overlay"></div>

    <main id="the-gates" class="fullscreen-flex">
        <div id="ethereal-mist"></div>

        <button id="btn-knock" class="rpg-box hover-glow idle-pulse">Knock on the Gates</button>

        <div id="dialogue-box" class="rpg-box hidden">
            <h2 id="question-text" class="cinzel-heading starlight-text"></h2>
        </div>
    </main>

    <main id="the-citadel" class="hidden fullscreen-flex">
        
        <header class="hud-header rpg-box">
            <h1 class="cinzel-heading relic-gold-text">The Grand Citadel</h1>
            <p class="iron-mist-text">Status: Sovereign | User: Initiated</p>
        </header>

        <section class="mirrorgates-container">
            <div class="rpg-box hover-glow mirrorgate-node">
                <h2 class="cinzel-heading starlight-text">The Mission</h2>
            </div>
            <div class="rpg-box hover-glow mirrorgate-node">
                <h2 class="cinzel-heading starlight-text">The Roster</h2>
            </div>
            <div class="rpg-box hover-glow mirrorgate-node">
                <h2 class="cinzel-heading starlight-text">The Sky Fox</h2>
            </div>
        </section>
        
        <footer class="hud-footer">
            <button id="btn-support" class="rpg-box hover-glow">Stand With Us</button>
        </footer>
    </main>

    <script src="js/engine.js"></script>
</body>
</html>
