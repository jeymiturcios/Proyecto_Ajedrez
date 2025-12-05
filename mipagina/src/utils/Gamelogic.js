import { ChessPiece } from "../models/ChessPiece";

/**
 * Clase para manejar la lógica del juego de ajedrez
 * Incluye: Matriz 8x8, validación de movimientos, pila de deshacer, historial
 */
export class ChessGame {
    constructor(player1Color, player1Name, player2Name) {
        this.player1Color = player1Color;
        this.player1Name = player1Name;
        this.player2Name = player2Name;
        this.player2Color = player1Color === "white" ? "black" : "white";
        
        // Matriz 8x8: Tablero de ajedrez
        this.board = this.createBoard();
        
        // Pila (Stack): Sistema de deshacer movimientos
        this.undoStack = [];
        
        // Lista/Cola: Historial de partidas en orden
        this.gameHistory = [];
        
        // Piezas capturadas por cada jugador
        this.capturedPieces = {
            white: [],
            black: []
        };
        
        // Turno actual (siempre empiezan las blancas)
        this.currentTurn = "white";
        
        // Pieza seleccionada
        this.selectedPiece = null;
        this.validMoves = [];
    }

    // Crear el tablero inicial 8x8
    createBoard() {
        const board = [];
        for (let row = 0; row < 8; row++) {
            const rowArray = [];
            for (let col = 0; col < 8; col++) {
                let piece = null;
             
                // Fila 0: Piezas negras principales
                if(row === 0){
                    const pieces =['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
                    piece = new ChessPiece(pieces[col], 'black', {row, col});
                }
                // Fila 1: Peones negros
                else if(row === 1){
                    piece = new ChessPiece('pawn', 'black', {row, col});
                }
                // Fila 6: Peones blancos
                else if(row === 6){
                    piece = new ChessPiece('pawn', 'white', {row, col});
                }
                // Fila 7: Piezas blancas principales
                else if(row === 7){
                    const pieces =['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
                    piece = new ChessPiece(pieces[col], 'white', {row, col});
                }
                rowArray.push({piece});
            }
            board.push(rowArray);
        }
        return board;
    }

    // Seleccionar una pieza
    selectPiece(row, col) {
        const square = this.board[row][col];
        
        // Si no hay pieza, deseleccionar
        if (!square.piece) {
            this.selectedPiece = null;
            this.validMoves = [];
            return false;
        }

        // Si la pieza no es del color del turno actual, no seleccionar
        if (square.piece.color !== this.currentTurn) {
            this.selectedPiece = null;
            this.validMoves = [];
            return false;
        }

        // Seleccionar la pieza y calcular movimientos válidos
        this.selectedPiece = { row, col, piece: square.piece };
        this.validMoves = this.calculateValidMoves(row, col);
        return true;
    }

    // Calcular movimientos válidos para una pieza (Árbol/Grafo de análisis)
    calculateValidMoves(row, col) {
        const square = this.board[row][col];
        if (!square.piece) return [];

        const piece = square.piece;
        const possibleMoves = piece.getPossibleMoves(this.board);
        
        // Filtrar movimientos que dejarían al rey en jaque
        const validMoves = possibleMoves.filter(move => {
            return !this.wouldMovePutKingInCheck(row, col, move.row, move.col);
        });

        return validMoves;
    }

    // Verificar si un movimiento dejaría al rey en jaque
    wouldMovePutKingInCheck(fromRow, fromCol, toRow, toCol) {
        // Crear un tablero temporal para simular el movimiento
        const tempBoard = this.cloneBoard();
        const tempPiece = tempBoard[fromRow][fromCol].piece;
        
        if (!tempPiece) return false;
        
        // Realizar el movimiento temporal
        tempBoard[toRow][toCol].piece = tempPiece;
        tempBoard[fromRow][fromCol].piece = null;
        tempPiece.position = { row: toRow, col: toCol };

        // Encontrar la posición del rey del color actual
        let kingRow = -1, kingCol = -1;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const sq = tempBoard[r][c];
                if (sq.piece && sq.piece.type === 'king' && sq.piece.color === this.currentTurn) {
                    kingRow = r;
                    kingCol = c;
                    break;
                }
            }
            if (kingRow !== -1) break;
        }

        // Verificar si el rey está en jaque
        const opponentColor = this.currentTurn === 'white' ? 'black' : 'white';
        return this.isSquareUnderAttack(kingRow, kingCol, opponentColor, tempBoard);
    }

    // Verificar si una casilla está bajo ataque
    isSquareUnderAttack(row, col, attackingColor, board = this.board) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const square = board[r][c];
                if (square.piece && square.piece.color === attackingColor) {
                    const moves = square.piece.getPossibleMoves(board);
                    if (moves.some(move => move.row === row && move.col === col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Mover una pieza
    movePiece(fromRow, fromCol, toRow, toCol) {
        const fromSquare = this.board[fromRow][fromCol];
        const toSquare = this.board[toRow][toCol];

        if (!fromSquare.piece) return false;

        // Verificar que el movimiento es válido
        const validMoves = this.calculateValidMoves(fromRow, fromCol);
        const isValidMove = validMoves.some(move => move.row === toRow && move.col === toCol);
        
        if (!isValidMove) return false;

        // Guardar el estado antes del movimiento para deshacer
        const capturedPiece = toSquare.piece ? toSquare.piece.clone() : null;
        const isCapture = capturedPiece !== null;
        
        const moveState = {
            from: { row: fromRow, col: fromCol, piece: fromSquare.piece ? fromSquare.piece.clone() : null },
            to: { row: toRow, col: toCol, piece: capturedPiece },
            turn: this.currentTurn,
            capturedPiece: capturedPiece,
            capturedPieces: {
                white: [...this.capturedPieces.white],
                black: [...this.capturedPieces.black]
            }
        };

        // Si hay una pieza capturada, agregarla a la lista de capturadas
        if (capturedPiece) {
            this.capturedPieces[capturedPiece.color].push(capturedPiece);
        }

        // Realizar el movimiento
        const piece = fromSquare.piece;
        toSquare.piece = piece;
        fromSquare.piece = null;
        piece.moveTo(toRow, toCol);

        // Agregar a la pila de deshacer
        this.undoStack.push(moveState);

        // Agregar al historial (Lista/Cola)
        const moveData = {
            id: Date.now(),
            player: this.currentTurn,
            playerName: this.currentTurn === this.player1Color ? this.player1Name : this.player2Name,
            move: this.formatMove(piece, fromRow, fromCol, toRow, toCol, isCapture),
            timestamp: new Date().toLocaleTimeString(),
            moveState: moveState
        };
        this.gameHistory.push(moveData);

        // Cambiar turno
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';

        // Limpiar selección
        this.selectedPiece = null;
        this.validMoves = [];

        return true;
    }

    // Formatear el movimiento para el historial
    formatMove(piece, fromRow, fromCol, toRow, toCol, isCapture) {
        const fromSquare = String.fromCharCode(97 + fromCol) + (8 - fromRow);
        const toSquare = String.fromCharCode(97 + toCol) + (8 - toRow);
        const captureSymbol = isCapture ? 'x' : '';
        return `${piece.getName()} ${fromSquare}${captureSymbol}${toSquare}`;
    }

    // Deshacer el último movimiento (usando la pila)
    undoMove() {
        if (this.undoStack.length === 0) return false;

        // Obtener el último movimiento de la pila
        const lastMove = this.undoStack.pop();
        
        // Restaurar el estado
        this.board[lastMove.from.row][lastMove.from.col].piece = lastMove.from.piece;
        if (lastMove.from.piece) {
            lastMove.from.piece.position = { row: lastMove.from.row, col: lastMove.from.col };
            // Restaurar hasMoved si es necesario (simplificado)
        }

        this.board[lastMove.to.row][lastMove.to.col].piece = lastMove.to.piece;
        if (lastMove.to.piece) {
            lastMove.to.piece.position = { row: lastMove.to.row, col: lastMove.to.col };
        }

        // Restaurar piezas capturadas
        if (lastMove.capturedPieces) {
            this.capturedPieces = {
                white: [...lastMove.capturedPieces.white],
                black: [...lastMove.capturedPieces.black]
            };
        }

        // Restaurar el turno
        this.currentTurn = lastMove.turn;

        // Remover del historial
        this.gameHistory.pop();

        // Limpiar selección
        this.selectedPiece = null;
        this.validMoves = [];

        return true;
    }

    // Clonar el tablero para simulaciones
    cloneBoard() {
        const cloned = [];
        for (let row = 0; row < 8; row++) {
            const rowArray = [];
            for (let col = 0; col < 8; col++) {
                const square = this.board[row][col];
                const clonedPiece = square.piece ? square.piece.clone() : null;
                if (clonedPiece) {
                    clonedPiece.position = { row, col };
                }
                rowArray.push({
                    piece: clonedPiece
                });
            }
            cloned.push(rowArray);
        }
        return cloned;
    }

    // Obtener el tablero actual
    getBoard() {
        return this.board;
    }

    // Obtener el historial
    getHistory() {
        return this.gameHistory;
    }

    // Obtener el turno actual
    getCurrentTurn() {
        return this.currentTurn;
    }

    // Obtener la pieza seleccionada
    getSelectedPiece() {
        return this.selectedPiece;
    }

    // Obtener movimientos válidos
    getValidMoves() {
        return this.validMoves;
    }

    // Obtener piezas capturadas
    getCapturedPieces() {
        return this.capturedPieces;
    }
}
