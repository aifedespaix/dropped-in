import { Game } from './lib'

/**
 * Exemple d'utilisation de la nouvelle architecture
 */
async function main() {
    // Créer un conteneur pour le jeu
    const container = document.createElement('div')
    container.style.width = '100%'
    container.style.height = '100%'
    document.body.appendChild(container)

    // Créer une instance du jeu
    const game = new Game(container)

    try {
        // Initialiser le jeu
        await game.init()
        console.log('Game initialized successfully')

        // Démarrer le jeu
        game.start()
        console.log('Game started')

        // Exemple de mise à jour manuelle (normalement géré par la boucle d'animation)
        const updateGame = () => {
            const deltaTime = 1 / 60 // 60 FPS
            game.update(deltaTime)
            requestAnimationFrame(updateGame)
        }
        updateGame()
    } catch (error) {
        console.error('Failed to start game:', error)
    }

    // Exemple de nettoyage (à appeler lors de la destruction du jeu)
    // game.cleanup()
}

// Démarrer l'application
main().catch(console.error) 