document.addEventListener('DOMContentLoaded', () => {
    const dieCube = document.getElementById('die-cube');
    const rollButton = document.getElementById('roll-button');
    const resultText = document.getElementById('result-text');
    const faces = dieCube.querySelectorAll('.face');

    rollButton.addEventListener('click', rollDice);

    // Mappage des résultats (1 à 6) aux transformations CSS nécessaires 
    // pour que cette face soit orientée vers l'utilisateur (devant).
    const rotationMap = {
        1: 'rotateX(0deg) rotateY(0deg)',
        6: 'rotateX(0deg) rotateY(180deg)',
        2: 'rotateX(90deg) rotateY(0deg)',
        5: 'rotateX(-90deg) rotateY(0deg)',
        3: 'rotateX(0deg) rotateY(-90deg)',
        4: 'rotateX(0deg) rotateY(90deg)'
    };
    
    /**
     * Génère les points (dots) pour chaque face du dé.
     * C'est fait une seule fois au chargement pour éviter le "bug" visuel.
     */
    function setupDieFaces() {
        const dotCounts = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };

        faces.forEach(face => {
            const faceNumber = parseInt(face.classList[1].split('-')[1]);
            const count = dotCounts[faceNumber];

            for (let i = 0; i < count; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                // Pour les faces impaires, le point central est le 5ème dot (index 4)
                if (faceNumber % 2 !== 0 && count >= 5 && i === 4) {
                    dot.style.gridArea = '2 / 2'; // Position centrale forcée
                }
                face.appendChild(dot);
            }
        });
    }

    function rollDice() {
        rollButton.disabled = true;
        resultText.textContent = 'Lancement en cours...';

        // 1. Générer un résultat aléatoire
        const result = Math.floor(Math.random() * 6) + 1;

        // 2. Définir une rotation aléatoire importante pour l'animation
        // Des multiples de 360 pour simuler plusieurs tours + la rotation finale
        const randX = Math.floor(Math.random() * 5 + 3) * 360; 
        const randY = Math.floor(Math.random() * 5 + 3) * 360;
        const randZ = Math.floor(Math.random() * 5 + 3) * 360;

        // 3. Appliquer la rotation d'animation
        // La rotation finale correcte (rotationMap[result]) sera calculée
        // dans le setTimeout pour que l'œil ne la voie qu'à la fin de la transition.
        dieCube.style.transform = `rotateX(${randX}deg) rotateY(${randY}deg) rotateZ(${randZ}deg)`;

        // 4. Attendre la fin de l'animation CSS (1.5s dans le style.css)
        setTimeout(() => {
            // 5. Appliquer la transformation correcte pour afficher le résultat
            // Nous combinons la rotation finale requise avec une légère rotation initiale
            // pour que le dé repose de manière plus "naturelle"
            const finalRotation = rotationMap[result];
            dieCube.style.transform = `${finalRotation} translateZ(calc(var(--die-size) / -2)) rotateX(5deg) rotateY(5deg)`;

            // 6. Afficher le résultat
            resultText.textContent = `Le résultat est : ${result} !`;
            rollButton.disabled = false;
        }, 1500); // Doit correspondre à la transition dans le CSS (1.5s)
    }

    // Initialisation
    setupDieFaces();
});
