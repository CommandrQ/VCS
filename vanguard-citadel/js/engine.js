/* ==========================================================================
   THE VANGUARD ENGINE (Logic & Choreography)
   ========================================================================== */

// --- DOM ELEMENTS (The mechanical parts of the page) ---
const btnKnock = document.getElementById('btn-knock');
const dialogueBox = document.getElementById('dialogue-box');
const questionText = document.getElementById('question-text');

const flashOverlay = document.getElementById('flash-overlay');
const theGates = document.getElementById('the-gates');
const theCitadel = document.getElementById('the-citadel');

// --- THE SCRIPT (The Vanguard Initiation Sequence) ---
const questions = [
    "When was the last time you were Educated?",
    "When was the last time you were Empowered?",
    "When was the last time you were Elevated?"
];

// Configuration for pacing
const typingSpeed = 50; // Milliseconds per letter
const pauseBetweenQuestions = 3000; // Milliseconds to wait after a question finishes typing

/* ==========================================================================
   ACT I: THE INITIATION
   ========================================================================== */

// 1. The user knocks on the gates
btnKnock.addEventListener('click', () => {
    // Hide the initial button and reveal the empty dialogue box
    btnKnock.classList.add('hidden');
    dialogueBox.classList.remove('hidden');
    
    // Start the sequence at the first question (Index 0)
    runDialogueSequence(0);
});

// 2. The Sequence Manager
function runDialogueSequence(index) {
    // Check if we have run out of questions
    if (index >= questions.length) {
        triggerCitadelTransition();
        return;
    }

    // Clear the box and start typing the next question
    questionText.innerHTML = "";
    typeWriterEffect(questions[index], questionText, () => {
        // Once typing is complete, wait 3 seconds, then move to the next question
        setTimeout(() => {
            runDialogueSequence(index + 1);
        }, pauseBetweenQuestions);
    });
}

// 3. The Typewriter Effect (Forces the user to read at our pace)
function typeWriterEffect(text, element, callback) {
    let charIndex = 0;

    function type() {
        if (charIndex < text.length) {
            element.innerHTML += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            // Typing finished, trigger the callback (the 3-second pause)
            if (callback) callback();
        }
    }

    type();
}

/* ==========================================================================
   ACT II: THE TRANSITION & THE HUB
   ========================================================================== */

// 4. The FF7 Screen Wipe
function triggerCitadelTransition() {
    // Ignite the pure white CSS flash overlay
    flashOverlay.classList.add('flash-active');

    // Wait for the flash to fully blind the screen (1.5 seconds to match CSS)
    setTimeout(() => {
        // While the screen is white, swap the rooms
        theGates.classList.add('hidden');
        theCitadel.classList.remove('hidden');
        
        // Fade the flash away to reveal the Citadel
        flashOverlay.classList.remove('flash-active');
        
        // Check if this citizen needs guidance
        checkFirstTimeUser();
    }, 1500); 
}

// 5. The Memory Check (Local Storage)
function checkFirstTimeUser() {
    // Check the browser's local memory to see if they hold the 'initiated' token
    const hasVisited = localStorage.getItem('vanguardInitiated');
    
    if (!hasVisited) {
        console.log("System: First-time citizen detected. Initiating tutorial sequence...");
        
        // Give the user a moment to take in the Citadel before the tutorial starts
        setTimeout(() => {
            alert("Welcome to The Grand Citadel. Navigate the Mirrorgates to explore our directory. Return periodically for new updates.");
            
            // Mark the user as initiated so they aren't bothered again
            localStorage.setItem('vanguardInitiated', 'true');
        }, 1000);
        
    } else {
        console.log("System: Initiated citizen returned. Welcome back to the Citadel.");
        // The user is free to interact with the Mirrorgates immediately
    }
}
