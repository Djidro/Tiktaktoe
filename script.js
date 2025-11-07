document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = false;
    let scores = { X: 0, O: 0 };
    let playerNames = { X: 'Player X', O: 'Player O' };
    
    // DOM elements
    const playerSetup = document.getElementById('playerSetup');
    const gameSection = document.getElementById('gameSection');
    const statusDisplay = document.getElementById('status');
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restartBtn');
    const newPlayersButton = document.getElementById('newPlayersBtn');
    const startButton = document.getElementById('startBtn');
    
    // Player name inputs
    const playerXInput = document.getElementById('playerX');
    const playerOInput = document.getElementById('playerO');
    
    // Score displays
    const playerXNameDisplay = document.getElementById('playerXName');
    const playerONameDisplay = document.getElementById('playerOName');
    const playerXScoreDisplay = document.getElementById('playerXScore');
    const playerOScoreDisplay = document.getElementById('playerOScore');
    
    // Winning conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    // Initialize game
    function initializeGame() {
        // Set player names
        playerNames.X = playerXInput.value.trim() || 'Player X';
        playerNames.O = playerOInput.value.trim() || 'Player O';
        
        // Update display names
        playerXNameDisplay.textContent = playerNames.X;
        playerONameDisplay.textContent = playerNames.O;
        
        // Switch to game section
        playerSetup.style.display = 'none';
        gameSection.style.display = 'block';
        
        // Reset game state
        resetGame();
        gameActive = true;
        
        // Update status
        statusDisplay.innerHTML = `${playerNames.X}'s Turn (X)`;
    }
    
    // Handle cell click
    function handleCellClick(clickedCellEvent) {
        if (!gameActive) return;
        
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
        
        // Check if cell is already played
        if (gameBoard[clickedCellIndex] !== '') {
            return;
        }
        
        // Process the move
        gameBoard[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        checkResult();
    }
    
    // Check for win or draw
    function checkResult() {
        let roundWon = false;
        let winningCombo = [];
        
        // Check all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameBoard[a] === '' || gameBoard[b] === '' || gameBoard[c] === '') {
                continue;
            }
            
            if (gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
                roundWon = true;
                winningCombo = winningConditions[i];
                break;
            }
        }
        
        // Handle win
        if (roundWon) {
            gameActive = false;
            
            // Highlight winning cells
            winningCombo.forEach(index => {
                cells[index].classList.add('win');
            });
            
            // Update score
            scores[currentPlayer]++;
            updateScoreDisplay();
            
            // Show win message
            const winnerName = currentPlayer === 'X' ? playerNames.X : playerNames.O;
            statusDisplay.innerHTML = `${winnerName} Wins!`;
            return;
        }
        
        // Check for draw
        const roundDraw = !gameBoard.includes('');
        if (roundDraw) {
            gameActive = false;
            statusDisplay.innerHTML = `Game ended in a draw!`;
            return;
        }
        
        // Continue game with next player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        const nextPlayerName = currentPlayer === 'X' ? playerNames.X : playerNames.O;
        statusDisplay.innerHTML = `${nextPlayerName}'s Turn (${currentPlayer})`;
    }
    
    // Update score display
    function updateScoreDisplay() {
        playerXScoreDisplay.textContent = scores.X;
        playerOScoreDisplay.textContent = scores.O;
    }
    
    // Reset game board
    function resetGame() {
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('x', 'o', 'win');
        });
        
        statusDisplay.innerHTML = `${playerNames.X}'s Turn (X)`;
    }
    
    // Reset everything including scores
    function resetEverything() {
        scores = { X: 0, O: 0 };
        updateScoreDisplay();
        resetGame();
        
        // Show player setup again
        gameSection.style.display = 'none';
        playerSetup.style.display = 'block';
    }
    
    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', resetGame);
    newPlayersButton.addEventListener('click', resetEverything);
    startButton.addEventListener('click', initializeGame);
    
    // Allow Enter key to start game
    playerXInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') initializeGame();
    });
    
    playerOInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') initializeGame();
    });
});
