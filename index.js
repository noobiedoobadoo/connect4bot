
let xOffset = (document.querySelector('.container').offsetWidth-420)/2;
let gameTreeDepth = 5;
let defensive = -4;
let offensive = 5;


const canvas = document.getElementById("connect4Canvas");
const ctx = canvas.getContext("2d");

const ROWS = 6;
const COLS = 7;
const SQUARE_SIZE = 60;
const PLAYER1_COLOR = "#ff6666";
const PLAYER2_COLOR = "#6666ff";
const PLAYER_PIECE = 1
const AI_PIECE = 2

let currentPlayer = 1;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));


function is_valid_location(board, col){
    return board[0][col] == 0
}
function get_valid_locations(board){
    valid_locations = []
    for (let c = 0 ; c < COLS ; c++){
        if (is_valid_location(board, c)){
            valid_locations.push(c)
        }
    }
    return valid_locations
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * SQUARE_SIZE;
            const y = row * SQUARE_SIZE;
            ctx.beginPath();
            ctx.rect(x, y, SQUARE_SIZE, SQUARE_SIZE);
            ctx.fillStyle = board[row][col] === 1 ? PLAYER1_COLOR :
                            board[row][col] === 2 ? PLAYER2_COLOR : "#ffffff";
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }
}

function dropDisc(board,column,currentPlayer) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][column] === 0) {
            board[row][column] = currentPlayer;
            return true;
        }
    }
    return false;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function isWinner(board,currentPlayer) {
    const player = currentPlayer;

    // Check horizontally
    for (let row = 0 ; row < ROWS ; row++){
        for (let c = 0; c < COLS - 3; c++) {
            if (board[row][c] === player && board[row][c + 1] === player &&
                board[row][c + 2] === player && board[row][c + 3] === player) {
                return true;
            }
        }
    }

    // Check vertically
    for (let col = 0; col < COLS ; col++){
        for (let r = 0; r < ROWS - 3; r++) {
            if (board[r][col] === player && board[r + 1][col] === player &&
                board[r + 2][col] === player && board[r + 3][col] === player) {
                return true;
            }
        }
    }

    // Check diagonally (down-right)
    for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            if (board[r][c] === player && board[r + 1][c + 1] === player &&
                board[r + 2][c + 2] === player && board[r + 3][c + 3] === player) {
                return true;
            }
        }
    }

    // Check diagonally (up-right)
    for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c < COLS - 3; c++) {
            if (board[r][c] === player && board[r - 1][c + 1] === player &&
                board[r - 2][c + 2] === player && board[r - 3][c + 3] === player) {
                return true;
            }
        }
    }

    return false;
}

function score_position(temp_board){
    let points = [100,offensive,2,-defensive];
    let score = 0;
    // horizontals
    for (let r = 0 ; r < ROWS; r++){
        for (let c = 0; c < COLS - 3; c++) {
            let gap = 0 , pc = 0 , opp_piece = 0;
            for (let k = 0 ; k < 4 ; k++){
                if (temp_board[r][c+k] === currentPlayer)   pc++
                else if (temp_board[r][c+k] === 0)   gap++
                else    opp_piece++
            }
            if (pc == 4)    score +=points[0];
            else if (pc == 3 && gap == 1)    score +=points[1]
            else if (pc == 2 && gap == 2)    score +=points[2]

            if (opp_piece == 3 && gap == 1) score -=points[3]
        }
    }
    // verticals
    for (let c = 0 ; c < COLS; c++){
        for (let r = ROWS-1; r >= 3; r--) {
            let gap = 0 , pc = 0 , opp_piece = 0;
            for (let k = 0 ; k < 4 ; k++){
                if (temp_board[r-k][c] === currentPlayer)   pc++
                else if (temp_board[r-k][c] === 0)   gap++
                else    opp_piece++
            }
            if (pc == 4)    score +=points[0];
            else if (pc == 3 && gap == 1)    score +=points[1]
            else if (pc == 2 && gap == 2)    score +=points[2]

            if (opp_piece == 3 && gap == 1) score -=points[3]
        }
    }
    // +ve slope diag
    for (let r = ROWS-1 ; r >= 3; r--){
        for (let c = 0; c < COLS - 3; c++) {
            let gap = 0 , pc = 0 , opp_piece = 0;
            for (let k = 0 ; k < 4 ; k++){
                if (temp_board[r-k][c+k] === currentPlayer)   pc++
                else if (temp_board[r-k][c+k] === 0)   gap++
                else    opp_piece++
            }
            if (pc == 4)    score +=points[0];
            else if (pc == 3 && gap == 1)    score +=points[1]
            else if (pc == 2 && gap == 2)    score +=points[2]

            if (opp_piece == 3 && gap == 1) score -=points[3]
        }
    }
    // -ve slope diag
    for (let r = 0 ; r <= 2; r++){
        for (let c = 0; c <=3; c++) {
            let gap = 0 , pc = 0 , opp_piece = 0;
            for (let k = 0 ; k < 4 ; k++){
                if (temp_board[r+k][c+k] === currentPlayer)   pc++
                else if (temp_board[r+k][c+k] === 0)   gap++
                else    opp_piece++
            }
            if (pc == 4)    score +=points[0];
            else if (pc == 3 && gap == 1)    score +=points[1]
            else if (pc == 2 && gap == 2)    score +=points[2]

            if (opp_piece == 3 && gap == 1) score -=points[3]
        }
    }

    return score;
}

function isTerminalNode(board) {
    return (isWinner(board,1) || isWinner(board,2) || get_valid_locations(board).length == 0)
}

function get_next_open_row(board,col){
    for (let r = ROWS - 1 ; r >= 0 ; r--){
        if (board[r][col] == 0){
            return r;
        }
    }
}

    function minimax(board, depth, alpha, beta, maximizingPlayer) {
    let validLocations = get_valid_locations(board);
    let isTerminal = isTerminalNode(board);
    
    if (depth === 0 || isTerminal) {
        if (isTerminal) {
            if (isWinner(board, AI_PIECE)) {
                return [null, 100000000000000];
            } else if (isWinner(board, PLAYER_PIECE)) {
                return [null, -10000000000000];
            } else { // Game is over, no more valid moves
                return [null, 0];
            }
        } else { // Depth is zero
            return [null, score_position(board, AI_PIECE)];
        }
    }

    if (maximizingPlayer) {
        let value = -Infinity;
        let column = get_valid_locations[Math.floor(Math.random() * validLocations.length)];
        
        for (let col of validLocations) {
            let row = get_next_open_row(board, col);
            let bCopy = board.map(arr => arr.slice());
            dropDisc(bCopy, col, AI_PIECE);
            let newScore = minimax(bCopy, depth - 1, alpha, beta, false)[1];
            
            if (newScore > value) {
                value = newScore;
                column = col;
            }
            
            alpha = Math.max(alpha, value);
            
            if (alpha >= beta) {
                break;
            }
        }
        return [column, value];
        
    } else { // Minimizing player
        let value = Infinity;
        let column = get_valid_locations[Math.floor(Math.random() * validLocations.length)];
        
        for (let col of validLocations) {
            let row = get_next_open_row(board, col);
            let bCopy = board.map(arr => arr.slice());
            dropDisc(bCopy,col, PLAYER_PIECE);
            let newScore = minimax(bCopy, depth - 1, alpha, beta, true)[1];
            
            if (newScore < value) {
                value = newScore;
                column = col;
            }
            
            beta = Math.min(beta, value);
            
            if (alpha >= beta) {
                break;
            }
        }
        return [column, value];
    }
}




function pickBestMove(){
    let best_score = -1000000;
    let best_col = 0;
    for (let c = 0 ; c < COLS; c++){
        let selectedRow = -1;
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][c] === 0) {
                selectedRow = row;
                break;
            }
        }
        if (selectedRow == -1)  continue;
        
        var temp_board = board.map(function(arr) {
            return arr.slice();
        });
        temp_board[selectedRow][c] = currentPlayer;
        let score = score_position(temp_board)
        if (score > best_score){
            best_score = score;
            best_col = c;
        }
    }
    return best_col;
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell !== 0));
}

function gameLoop() {
    drawBoard();
    // console.log(board)
    let winner = checkWinner();
    console.log(`Player ${winner} wins!`)
    if (winner) {
        alert(`Player ${winner} wins!`);
        resetGame();
    } else if (isBoardFull()) {
        alert("It's a tie!");
        resetGame();
    } else if (currentPlayer === 2) {
        // AI Move (Player 2)
        makeAIMove();
    }
}

function checkWinner() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            // if (board[row][col] !== 0 && isWinner(board,currentPlayer)) {
            //     return board[row][col];
            // }
            if (board[row][col] !== 0 && isWinner(board,board[row][col])) {
                return board[row][col];
            }
        }
    }
    return null;
}

function resetGame() {
    currentPlayer = 1;
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function makeAIMove() {
    // Simple AI: Randomly choose a valid move
    let validMove = false;
    let [column, minimaxScore] = minimax(board, gameTreeDepth, -Infinity, Infinity, true);
    // let column;
    while (!validMove) {
        validMove = dropDisc(board,column,AI_PIECE);
        // if (isWinner(board, AI_PIECE)) {
        //     switchPlayer();
        //     // setTimeout(gameLoop,500);
        //     return;
        // }
    }

    // while (!is_valid_location(board,col)){
    //     dropDisc(board,col,AI_PIECE);
    //     if (winningMove(board, AI_PIECE)) {
    //         const label = myfont.render("Player 2 wins!!", 1, YELLOW);
    //         screen.blit(label, [40, 10]);
    //     }
    // }
    switchPlayer();
    setTimeout(gameLoop, 500); // Delay to make the AI move visible
}



canvas.addEventListener("click", function (event) {
    const column = Math.floor((event.clientX - xOffset) / SQUARE_SIZE);
    if (dropDisc(board,column,currentPlayer)) {
        switchPlayer();
        gameLoop();
    }
});




gameLoop();

document.getElementById('open-instruction').addEventListener('click', function() {
    document.getElementById('backdrop').style.display = 'block';
    document.getElementById('instruction').style.display = 'block';
});

document.getElementById('close-instruction').addEventListener('click', function() {
    document.getElementById('backdrop').style.display = 'none';
    document.getElementById('instruction').style.display = 'none';
});

document.querySelector('.refresh').addEventListener('click', function() {
    location.reload();
});

const depthText = document.querySelector('.depth-text')
const depthSlider = document.getElementById('depth-slider');

const defensiveText = document.querySelector('.defensive-text')
const defensiveSlider = document.getElementById('defensive-slider')

const offensiveText = document.querySelector('.offensive-text');
const offensiveSlider = document.getElementById('offensive-slider')

depthSlider.addEventListener('input', (e) => {
  gameTreeDepth = parseInt(e.target.value) + 2;
  depthText.textContent = gameTreeDepth;
  console.log(`Depth value changed to: ${gameTreeDepth}`);
});

defensiveSlider.addEventListener('input',(e) => {
    defensive = -parseInt(e.target.value) - 1;
    defensiveText.textContent = defensive;
    console.log(`Defensive value changed to: ${defensive}`);
});

offensiveSlider.addEventListener('input',(e) => {
    offensive = parseInt(e.target.value) + 2;
    offensiveText.textContent = offensive;
    console.log(`offensive value changed to: ${offensive}`);
});