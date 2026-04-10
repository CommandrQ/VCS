/* VANGUARD FORGE ENGINE (Frosted Glass WebGL) */

let scene, camera, renderer, shield, sword;
let mouse = { x: 0, y: 0 };

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.05);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // --- FORGE 3D GEOMETRIES ---

    // THE CRYSTALLINE SHIELD (A multifaceted 'Frosted Glass' body)
    const shieldGeometry = new THREE.OctahedronGeometry(1.2, 1);
    
    // **NEW PHYSICAL FROST MATERIAL**
    const shieldMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x86868B, // VCS Gray base
        metalness: 0.05, // Lower metalness so it looks like glass, not chrome
        roughness: 0.25, // THE "FROST": Sets how much light scatters through the glass. 0.0=clear, 1.0=diffuse
        transmission: 1.0, // HIGH TRANSMISSION: Light passes through physically. Requires alpha:true renderer.
        ior: 1.6, // INDEX OF REFRACTION: Distorts background. 1.0=air, 1.33=water, 1.6=high-end glass.
        opacity: 0.8,
        transparent: true,
        reflectivity: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });
    
    shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shield.position.x = -2.5; 
    scene.add(shield);

    // THE PLASMA SWORD (Keep it sharp, but give it a glass-like core)
    const swordGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 32);
    const swordMaterial = new THREE.MeshPhongMaterial({
        color: 0xBF94FF, // Knight Purple core
        emissive: 0xBF94FF,
        emissiveIntensity: 0.8,
        shininess: 100
    });
    sword = new THREE.Mesh(swordGeometry, swordMaterial);
    sword.position.x = 2.5; 
    sword.rotation.z = -0.5; 
    scene.add(sword);

    // --- SETUP LIGHTING (Essential for showing off Glass Roughness) ---
    const ambientLight = new THREE.AmbientLight(0x050505);
    scene.add(ambientLight);

    // VCS Gold Aura (Primary light to highlight glass facets)
    const auraVCS = new THREE.PointLight(0xD4AF37, 0, 15);
    auraVCS.position.set(-2.5, 0, 1);
    scene.add(auraVCS);

    // Knight Purple Aura (For secondary glow)
    const auraKnights = new THREE.PointLight(0xBF94FF, 0, 15);
    auraKnights.position.set(2.5, 0, 1);
    scene.add(auraKnights);

    // Setup Renderer (Vital configuration for physical transparency)
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true // REQUIRED: Allows background textures to show through transmitted glass
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding; // Required for physically accurate glass rendering
    document.getElementById('forge-container').appendChild(renderer.domElement);

    // Interaction Logic (Connect mouse to 3D and UI)
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('click', onClick);

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        const vcsLabel = document.getElementById('label-vcs');
        const knightLabel = document.getElementById('label-knights');

        // Threshold logic (Power up on interaction)
        if (mouse.x < -0.3) { 
            vcsLabel.style.opacity = '1';
            knightLabel.style.opacity = '0.05';
            vcsLabel.style.color = 'var(--vcs-gold)';
            auraVCS.intensity = 2; // Shield 'Powers Up'
            shieldMaterial.emissive = new THREE.Color(0xD4AF37); // Glass body gains gold hue
            shieldMaterial.emissiveIntensity = 0.3;
        } else if (mouse.x > 0.3) {
            knightLabel.style.opacity = '1';
            vcsLabel.style.opacity = '0.05';
            knightLabel.style.color = 'var(--vcs-purple)';
            auraKnights.intensity = 2; // Sword 'Powers Up'
        } else {
            vcsLabel.style.opacity = '0.3';
            vcsLabel.style.color = 'var(--vcs-white)';
            knightLabel.style.opacity = '0.3';
            knightLabel.style.color = 'var(--vcs-white)';
            auraVCS.intensity = 0.5; // Return to neutral soft glow
            auraKnights.intensity = 0.5;
            shieldMaterial.emissive = new THREE.Color(0x86868B);
            shieldMaterial.emissiveIntensity = 0.1;
        }
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onClick() {
        if (mouse.x < -0.3) { window.location.href = 'table.html'; }
        else if (mouse.x > 0.3) { window.location.href = 'https://your-future-site.com'; }
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    // Spatial Tilt (Follow the mouse)
    shield.rotation.y = (mouse.x * 0.4);
    shield.rotation.x = (mouse.y * -0.4);

    sword.rotation.y = (mouse.x * 0.2);
    sword.rotation.x = (mouse.y * -0.2);

    // Idle Rotation
    shield.rotation.y += 0.003;
    sword.rotation.y -= 0.001;

    renderer.render(scene, camera);
}
