// Définition des mots et indices dans un tableau words d'un objet crosswordData
const crosswordData = {
    words: [
        {
        //chaque case du tableau est un objet lui meme
        id: 1,
        word: "LABYRINTHE",
        clue: "Jeu de chemin ou l'on perd souvent",
        direction: "horizontal",
        row: 0,
        col: 0,
        },
        {
        id: 2,
        word: "ALPINISME",
        clue: "Activité faite en montagne",
        direction: "vertical",
        row: 0,
        col: 1,
        },
        {
        id: 3,
        word: "PARADIS",
        clue: "Lieu ou tout est beau et parfait",
        direction: "horizontal",
        row: 2,
        col: 1,
        },
        {
        id: 4,
        word: "ESPOIR",
        clue: "Lumière au bout de tunnel",
        direction: "vertical",
        row: 0,
        col: 9,
        },
    ],
};

// Variables globales du jeux
let score = 0; 
const totalWords = crosswordData.words.length; //nombre de case du tableau "words" contenant les mots a chercher 
let userInputs = {};//les entrées de l'utilisateur 
let currentDirection = "horizontal";
let activeWordId = null;//l'id du mot qu'on est entrain de remplir
let highlightedCells = [];//les cases choisis (colores)

// Initialisation de la grille dans la partie du table dans la DOM
function initializeGrid() {
    const table = document.getElementById("crossword-table");
    table.innerHTML = "";

    // Création de la grille 
    const gridStructure = [
        ["L", "A", "B", "Y", "R", "I", "N", "T", "H", "E"],
        [null, "L", null, null, null, null, null, null, null, "S"],
        [null, "P", "A", "R", "A", "D", "I", "S", null, "P"],
        [null, "I", null, null, null, null, null, null, null, "O"],
        [null, "N", null, null, null, null, null, null, null, "I"],
        [null, "I", null, null, null, null, null, null, null, "R"],
        [null, "S", null, null, null, null, null, null, null, null],
        [null, "M", null, null, null, null, null, null, null, null],
        [null, "E", null, null, null, null, null, null, null, null],
    ];
    // Créer les lignes et cellules
    for (let i = 0; i < gridStructure.length; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < gridStructure[i].length; j++) {// dans chaque ligne i 
            const cell = document.createElement("td");

            if (gridStructure[i][j] !== null) {// si la case est non vide alors elle sera ajoiter a la classe c1
                cell.className = "c1";

                // Trouver si cette cellule est le début d'un mot
                const wordStart = crosswordData.words.find(
                    (word) => word.row === i && word.col === j
                );

                if (wordStart) {// si la case est le debut d'un mot 
                    const number = document.createElement("span");
                    number.className = "cell-number";
                    number.textContent = wordStart.id; //on ecrit l'id du mot dans la variable number
                    cell.appendChild(number); // on ecrit le content de number dans la cellule correspondante
                }//on ajoute des modifications a la classe par le css pour avoir une meilleur presentation
                //creation de la partie de saisie de chaque case
                const input = document.createElement("input");
                input.type = "text";
                input.maxLength = 1; //un seul caractere
                input.dataset.row = i;
                input.dataset.col = j;

                // Stocker la référence à l'input
                userInputs[`${i}-${j}`] = input;

                // Ajouter un écouteur d'événement pour la navigation
                input.addEventListener("input", handleInput);
                input.addEventListener("keydown", handleKeyDown);
                input.addEventListener("focus", handleFocus);

                cell.appendChild(input);//ecriture 
            } 
            else { // si la case est vide (ne fait pas partie de aucun mot)
              cell.className = "c2";
            }

            row.appendChild(cell);
        }

        table.appendChild(row);
    }
}
// Gérer la saisie des lettres
function handleInput(e) {
    const input = e.target;
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);

    // Mettre en majuscule
    input.value = input.value.toUpperCase();

    // Si une lettre est saisie, passer à la case suivante selon la direction
    if (input.value && input.value.match(/[A-Z]/)) {
        let nextRow = row;
        let nextCol = col;

        if (currentDirection === "horizontal") {
        nextCol = col + 1; //on avance horizontalement
        } else {// on avance le curseur verticalement
        nextRow = row + 1;
        }

        // Vérifier les limites de la grille
        if (nextRow < 9 && nextCol < 10) {
        const nextInput = userInputs[`${nextRow}-${nextCol}`];
            if (nextInput) {
                nextInput.focus();
            }
        }
    }
}
// Gérer les touches du clavier
function handleKeyDown(e) {
    const input = e.target;
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);

    if (e.key === "Backspace" && !input.value) {
        // Si backspace est pressé sur une case vide, revenir à la case précédente
        let prevRow = row;
        let prevCol = col;

        if (currentDirection === "horizontal") {
            prevCol = col - 1;
        } else {
            prevRow = row - 1;
            
        }
    
        // Vérifier les limites de la grille
        if (prevRow >= 0 && prevCol >= 0) {
            const prevInput = userInputs[`${prevRow}-${prevCol}`];
            if (prevInput) {
                prevInput.focus(); //place le curseur dans un champ ou active l'element pour recevoir des interactions clavier.
            }
        }
    } else if (e.key === "Tab") {
        e.preventDefault();
        // Changer de direction avec Tab
        currentDirection =
            currentDirection === "horizontal" ? "vertical" : "horizontal";
        updateDirectionIndicator();// sera definie apres
        updateActiveClue();// sera definie apres
    }
}
// Gérer le focus sur une cellule
function handleFocus(e) {
    const input = e.target;
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);

    // Trouver le mot actif basé sur la position
    const activeWord = crosswordData.words.find((word) => {
        if (word.direction === "horizontal") {
            return (
              word.row === row &&
              col >= word.col &&
              col < word.col + word.word.length
            );
        } else {
            return (
              word.col === col &&
              row >= word.row &&
              row < word.row + word.word.length
            );
          }
    });

    if (activeWord) {
        activeWordId = activeWord.id;
        currentDirection = activeWord.direction;
        updateDirectionIndicator();
        updateActiveClue();
        highlightWord(activeWord.id);
    }
}
// Mettre à jour l'indicateur de direction
function updateDirectionIndicator() {
    const indicator = document.getElementById("current-direction");
    indicator.textContent =
        currentDirection === "horizontal" ? "HORIZONTAL" : "VERTICAL";
}
// Afficher les indices sous forme de boutons
function displayClues() {
    const horizontalClues = document.getElementById("horizontal-clues");
    const verticalClues = document.getElementById("vertical-clues");

    horizontalClues.innerHTML = "";
    verticalClues.innerHTML = "";

    crosswordData.words.forEach((word) => {
        const clueButton = document.createElement("button");
        clueButton.className = "clue-btn";
        clueButton.textContent = `${word.id}. ${word.clue}`;
        clueButton.dataset.wordId = word.id;

        clueButton.addEventListener("click", () => {
            // Focus sur la première lettre du mot sélectionné
            activeWordId = word.id;
            currentDirection = word.direction;
            updateDirectionIndicator();
            updateActiveClue();
            highlightWord(word.id);

            const firstInput = userInputs[`${word.row}-${word.col}`];
            if (firstInput) {
              firstInput.focus();
            }
        });

        if (word.direction === "horizontal") {
            horizontalClues.appendChild(clueButton);
        } else {
            verticalClues.appendChild(clueButton);
        }
    });
}
// Mettre à jour l'indice actif
function updateActiveClue() {
    const clues = document.querySelectorAll(".clue-btn");
    clues.forEach((clue) => clue.classList.remove("active"));

    if (activeWordId) {
        const activeClue = document.querySelector(
            `.clue-btn[data-word-id="${activeWordId}"]`
        );
        if (activeClue) {
            activeClue.classList.add("active");
        }
    }
}
// Mettre en évidence les cases d'un mot
function highlightWord(wordId) {
    // Retirer la surbrillance précédente
    highlightedCells.forEach((cell) => {
        if (cell && cell.parentElement) {
            cell.parentElement.classList.remove("highlight");
        }
    });
    highlightedCells = [];

    const word = crosswordData.words.find((w) => w.id === wordId);
    if (!word) return;

    const { direction, row, col, word: text } = word;

    for (let i = 0; i < text.length; i++) {
        const currentRow = direction === "horizontal" ? row : row + i;
        const currentCol = direction === "horizontal" ? col + i : col;

        if (currentRow < 9 && currentCol < 10) {
            const input = userInputs[`${currentRow}-${currentCol}`];
            if (input && input.parentElement) {
                input.parentElement.classList.add("highlight");
                highlightedCells.push(input);
            }
        }
    }
}
// Vérifier les réponses
function checkAnswers() {
    let correctWords = 0;
    const messageElement = document.getElementById("message");

    crosswordData.words.forEach((word) => {
        const { word: correctWord, direction, row, col } = word;
        let userWord = "";
        let allCellsValid = true;

        for (let i = 0; i < correctWord.length; i++) {
            const currentRow = direction === "horizontal" ? row : row + i;
            const currentCol = direction === "horizontal" ? col + i : col;

            if (currentRow < 9 && currentCol < 10) {
                const input = userInputs[`${currentRow}-${currentCol}`];
                if (input) {
                    userWord += input.value || "";
                    if (input.value.toUpperCase() !== correctWord[i]) {
                        allCellsValid = false;
                    }
                }
            }
        }

        if (userWord.toUpperCase() === correctWord) {
            correctWords++;
            // Marquer le mot comme correct (changer la couleur de fond des cases)
            for (let i = 0; i < correctWord.length; i++) {
                const currentRow = direction === "horizontal" ? row : row + i;
                const currentCol = direction === "horizontal" ? col + i : col;

                if (currentRow < 9 && currentCol < 10) {
                    const input = userInputs[`${currentRow}-${currentCol}`];
                    if (input) {
                        input.parentElement.classList.add("correct");
                    }
                }
            }
        }
    });

    // Mettre à jour le score
    score = correctWords;
    document.getElementById("score").textContent = score;

    // Afficher un message
    if (score === totalWords) {
        messageElement.textContent =
            "Félicitations ! Vous avez résolu tous les mots !";
        messageElement.className = "message success";
    } else {
        messageElement.textContent = `Vous avez trouvé ${score} mot(s) sur ${totalWords}. Continuez !`;
        messageElement.className = "message success";
    }

    messageElement.style.display = "block";
}
// Réinitialiser la grille
function resetGrid() {
    Object.values(userInputs).forEach((input) => {
        input.value = "";
        input.parentElement.classList.remove("correct", "highlight");
    });

    score = 0;
    document.getElementById("score").textContent = score;

    const messageElement = document.getElementById("message");
    messageElement.style.display = "none";

    // Réinitialiser la direction et le mot actif
    currentDirection = "horizontal";
    activeWordId = null;
    updateDirectionIndicator();
    updateActiveClue();
    highlightedCells = [];
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    initializeGrid();
    displayClues();
    document.getElementById("total-words").textContent = totalWords;
    updateDirectionIndicator();

    // Événements des boutons
    document
        .getElementById("submit-btn")
        .addEventListener("click", checkAnswers);
    document
        .getElementById("reset-btn")
        .addEventListener("click", resetGrid);

    // Changer de direction avec la touche Tab
    document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            currentDirection =
              currentDirection === "horizontal" ? "vertical" : "horizontal";
            updateDirectionIndicator();
            updateActiveClue();
        }
    });
});