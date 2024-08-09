const board = document.querySelector('.board');
const rows = 8;
const cols = rows;
let selectedPiece = null;
let currentPlayer = 'white';

const initializeBoard = () => {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const tile = document.createElement('div');
            tile.classList.add('board__tile');
            if ((row + col) % 2 === 0) {
                tile.classList.add('board__tile--white');
            } else {
                tile.classList.add('board__tile--black');
                if (row < 3) {
                    createPiece(tile, 'black');
                } else if (row > 4) {
                    createPiece(tile, 'white');
                }
            }
            tile.dataset.row = row;
            tile.dataset.col = col;
            board.appendChild(tile);
        }
    }
};

const createPiece = (tile, color) => {
    const piece = document.createElement('div');
    piece.classList.add('board__piece', `board__piece--${color}`);
    piece.dataset.color = color;
    tile.appendChild(piece);

    piece.addEventListener('click', selectPiece);
};

const selectPiece = (event) => {
    const piece = event.target;

    if (piece.dataset.color !== currentPlayer) {
        return;
    }

    clearHighlights();
    selectedPiece = piece;
    piece.parentElement.classList.add('board__tile--highlight');
    highlightMoves(piece);
};

const highlightMoves = (piece) => {
    const moves = userMoves(piece);

    for (const [row, cols] of Object.entries(moves)) {
        cols.forEach(col => {
            highlightTile(parseInt(row), col);
        });
    }
};

const userMoves = (piece) => {
    const tile = piece.parentElement;
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);
    const direction = piece.dataset.color === 'white' ? -1 : 1;
    const potentialMoves = {};

    for (let i = 1; i < rows; i++) {
        const newRow = row + direction * i;

        if (newRow < 0 || newRow >= rows) {
            break;
        }

        potentialMoves[newRow] = potentialMoves[newRow] || [];

        const newLeftCol = col - i;
        const newRightCol = col + i;

        if (newLeftCol >= 0 && newLeftCol < cols) {
            potentialMoves[newRow].push(newLeftCol);
        }
        if (newRightCol >= 0 && newRightCol < cols) {
            potentialMoves[newRow].push(newRightCol);
        }

        if (potentialMoves[newRow].length === 0) {
            delete potentialMoves[newRow];
        }
    }
    
    return possibleMoves(potentialMoves);
};

const possibleMoves = (potentialMoves) => {
    for (const [row, cols] of Object.entries(potentialMoves)) {
        const filteredCols = cols.filter(col => {
            const tile = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
            if (tile && tile.querySelector('.board__piece')) {
                return false;
            }
            return true;
        });

        if (filteredCols.length > 0) {
            potentialMoves[row] = filteredCols;
        } else {
            delete potentialMoves[row];
        }
    }

    return potentialMoves;
}

const highlightTile = (row, col) => {
    if (row < 0 || row >= rows || col < 0 || col >= cols) {
        return;
    }

    const tile = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    tile.classList.add('board__tile--highlight');
    tile.addEventListener('click', movePiece);
};

const movePiece = (event) => {
    const targetTile = event.target;
    targetTile.appendChild(selectedPiece);
    clearHighlights();
    switchPlayer();
};

const switchPlayer = () => {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
};

const clearHighlights = () => {
    document.querySelectorAll('.board__tile--highlight').forEach(tile => {
        tile.classList.remove('board__tile--highlight');
        tile.removeEventListener('click', movePiece);
    });
};

initializeBoard();