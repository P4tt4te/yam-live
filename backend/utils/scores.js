function calculateScoreAndWinner(grid) {
    // Fonction pour vérifier si les pions sont alignés
    function checkPointsAlignment(points) {
        if (points.length < 3) return 0; // Pas assez de pions pour former une combinaison
        const owner = points[0].owner;
        if (owner === null) return 0; // La combinaison n'appartient à aucun joueur
        if (points.length === 5) return owner; // Une combinaison de 5 pions signifie la victoire
        return points.length === 4 ? 2 : 1; // 2 points pour une combinaison de 4 pions, 1 point pour une combinaison de 3 pions
    }

    let playerScores = {}; // Un objet pour stocker les scores de chaque joueur
    let winner = null; // Variable pour stocker l'ID du vainqueur

    // Vérification des lignes
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            for (let k = j; k < Math.min(j + 5, grid[i].length); k++) {
                const points = [];
                for (let l = j; l <= k; l++) {
                    points.push(grid[i][l]);
                }
                const alignmentResult = checkPointsAlignment(points);
                if (alignmentResult > 0) {
                    // Ajouter des points au score du joueur et vérifier s'il y a un vainqueur
                    playerScores[alignmentResult] = (playerScores[alignmentResult] || 0) + alignmentResult;
                    if (alignmentResult === 5) {
                        winner = alignmentResult; // Affecter le vainqueur si une combinaison de 5 pions est trouvée
                    }
                }
            }
        }
    }

    // Vérification des colonnes
    for (let j = 0; j < grid[0].length; j++) {
        for (let i = 0; i < grid.length; i++) {
            for (let k = i; k < Math.min(i + 5, grid.length); k++) {
                const points = [];
                for (let l = i; l <= k; l++) {
                    points.push(grid[l][j]);
                }
                const alignmentResult = checkPointsAlignment(points);
                if (alignmentResult > 0) {
                    playerScores[alignmentResult] = (playerScores[alignmentResult] || 0) + alignmentResult;
                    if (alignmentResult === 5) {
                        winner = alignmentResult;
                    }
                }
            }
        }
    }

    // Vérification des diagonales (de haut en bas)
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            for (let k = 0; k < Math.min(grid.length - i, grid[i].length - j, 5); k++) {
                const points = [];
                for (let l = 0; l <= k; l++) {
                    points.push(grid[i + l][j + l]);
                }
                const alignmentResult = checkPointsAlignment(points);
                if (alignmentResult > 0) {
                    playerScores[alignmentResult] = (playerScores[alignmentResult] || 0) + alignmentResult;
                    if (alignmentResult === 5) {
                        winner = alignmentResult;
                    }
                }
            }
        }
    }

    // Vérification des diagonales (de bas en haut)
    for (let i = grid.length - 1; i >= 0; i--) {
        for (let j = 0; j < grid[i].length; j++) {
            for (let k = 0; k < Math.min(i + 1, grid[i].length - j, 5); k++) {
                const points = [];
                for (let l = 0; l <= k; l++) {
                    points.push(grid[i - l][j + l]);
                }
                const alignmentResult = checkPointsAlignment(points);
                if (alignmentResult > 0) {
                    playerScores[alignmentResult] = (playerScores[alignmentResult] || 0) + alignmentResult;
                    if (alignmentResult === 5) {
                        winner = alignmentResult;
                    }
                }
            }
        }
    }

    return { playerScores, winner };
}

// Test de la fonction avec la grille initiale
const { playerScores, winner } = calculateScoreAndWinner(GRID_INIT);
console.log("Scores des joueurs :", playerScores);
if (winner) {
    console.log("Le joueur", winner, "a gagné !");
} else {
    console.log("Il n'y a pas de gagnant pour l'instant.");
}
