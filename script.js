let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameStarted = false;
let startTime;


function handleCellClick(index) {
    if (!gameStarted) {
        gameStarted = true;
        startTime = new Date();
    }

    document.getElementById('reset-button').addEventListener('click', resetGame);

    if (board[index] === null) {
        board[index] = currentPlayer;
        document.getElementById(`cell-${index}`).innerText = currentPlayer;
        if (checkWin(currentPlayer)) {
            endGame(currentPlayer);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            computerMove();
        }
    }
}

function computerMove() {
    let availableMoves = board.reduce((acc, cell, index) => {
        if (cell === null) acc.push(index);
        return acc;
    }, []);

    let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    board[move] = 'O';
    document.getElementById(`cell-${move}`).innerText = 'O';
    if (checkWin('O')) {
        endGame('O');
    } else {
        currentPlayer = 'X';
    }
}

function checkWin(player) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombinations.some(combination =>
        combination.every(index => board[index] === player)
    );
}

function resetGame() {
    board = Array(9).fill(null); // Limpia el tablero
    currentPlayer = 'X'; // El jugador X siempre comienza
    gameStarted = false; // El juego no ha comenzado
    startTime = null; // Reinicia el tiempo de inicio

    // Limpia todas las celdas en la interfaz de usuario
    for (let i = 0; i < 9; i++) {
        document.getElementById(`cell-${i}`).innerText = '';
    }
}


function endGame(winner) {
    if (winner === 'X') {
        let endTime = new Date();
        let elapsedTime = (endTime - startTime) / 1000;
        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push({ name: prompt("Ingresa tu nombre"), time: elapsedTime });
        highScores.sort((a, b) => a.time - b.time);
        if (highScores.length > 10) highScores.pop();
        localStorage.setItem('highScores', JSON.stringify(highScores));
        displayHighScores();
    }else{
        alert("Computadora gano")
    }
    resetGame();
}

function displayHighScores() {
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    let highScoresList = document.getElementById('high-scores');
    highScoresList.innerHTML = '';
    highScores.forEach(score => {
        let li = document.createElement('li');
        li.textContent = `${score.name}: ${score.time.toFixed(2)} segundos`;
        highScoresList.appendChild(li);
    });
}

// Añadir event listeners a las celdas
for (let i = 0; i < 9; i++) {
    document.getElementById(`cell-${i}`).addEventListener('click', () => handleCellClick(i));
}

// Mostrar los mejores tiempos al cargar la página
displayHighScores();
