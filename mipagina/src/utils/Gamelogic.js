import { ChessPiece } from "../models/ChessPiece";

/**
 * Clase principal para manejar la lógica del juego de ajedrez
 * @class ChessGame
 * @description Implementa el motor de ajedrez completo con:
 *              - Tablero 8x8 (Matriz)
 *              - Validación de movimientos según reglas del ajedrez
 *              - Sistema de deshacer usando Pila (Stack)
 *              - Historial de movimientos usando Lista/Cola
 *              - Detección de jaque, jaque mate y empate
 */
export class ChessGame {
    /**
     * Constructor de la clase ChessGame
     * @constructor
     * @param {string} player1Color - Color del jugador 1: 'white' o 'black'
     * @param {string} player1Name - Nombre del jugador 1
     * @param {string} player2Name - Nombre del jugador 2
     * @param {Object} savedState - Estado guardado del juego para restaurar (opcional)
     */
    constructor(player1Color, player1Name, player2Name, savedState = null) {
        /** @type {string} Color del jugador 1 */
        this.player1Color = player1Color;
        
        /** @type {string} Nombre del jugador 1 */
        this.player1Name = player1Name;
        
        /** @type {string} Nombre del jugador 2 */
        this.player2Name = player2Name;
        
        /** @type {string} Color del jugador 2 (opuesto al jugador 1) */
        this.player2Color = player1Color === "white" ? "black" : "white";
        
        if (savedState) {
            // Restaurar desde un estado guardado
            this.restoreFromState(savedState);
        } else {
            /** @type {Array<Array<Object>>} Matriz 8x8: Tablero de ajedrez */
            this.board = this.createBoard();
            
            /** @type {Array<Object>} Pila (Stack): Sistema de deshacer movimientos */
            this.undoStack = [];
            
            /** @type {Array<Object>} Lista/Cola: Historial de partidas en orden cronológico */
            this.gameHistory = [];
            
            /** @type {Object} Piezas capturadas por cada jugador: {white: Array, black: Array} */
            this.capturedPieces = {
                white: [],
                black: []
            };
            
            /** @type {string} Turno actual (siempre empiezan las blancas) */
            this.currentTurn = "white";
        }
        
        /** @type {Object|null} Pieza seleccionada actualmente: {row: number, col: number, piece: ChessPiece} */
        this.selectedPiece = null;
        
        /** @type {Array<Object>} Movimientos válidos para la pieza seleccionada */
        this.validMoves = [];
    }

    /**
     * Restaura el estado del juego desde un objeto serializado
     * @param {Object} savedState - Estado del juego serializado
     */
    restoreFromState(savedState) {
        // Restaurar tablero
        this.board = [];
        for (let row = 0; row < 8; row++) {
            const rowArray = [];
            for (let col = 0; col < 8; col++) {
                const squareData = savedState.board[row][col];
                let piece = null;
                
                if (squareData.piece) {
                    piece = new ChessPiece(
                        squareData.piece.type,
                        squareData.piece.color,
                        { row, col }
                    );
                    piece.hasMoved = squareData.piece.hasMoved || false;
                }
                
                rowArray.push({ piece });
            }
            this.board.push(rowArray);
        }
        
        // Restaurar turno
        this.currentTurn = savedState.currentTurn || "white";
        
        // Restaurar historial (asegurarse de que esté vacío si no hay historial guardado)
        this.gameHistory = savedState.gameHistory ? [...savedState.gameHistory] : [];
        
        // Restaurar piezas capturadas (necesitamos recrear las piezas)
        this.capturedPieces = {
            white: [],
            black: []
        };
        
        if (savedState.capturedPieces) {
            ['white', 'black'].forEach(color => {
                if (savedState.capturedPieces[color]) {
                    this.capturedPieces[color] = savedState.capturedPieces[color].map(pieceData => {
                        const piece = new ChessPiece(
                            pieceData.type,
                            pieceData.color,
                            pieceData.position || { row: -1, col: -1 }
                        );
                        piece.hasMoved = pieceData.hasMoved || false;
                        return piece;
                    });
                }
            });
        }
        
        // Restaurar pila de deshacer (simplificado - solo estructura básica)
        this.undoStack = savedState.undoStack || [];
    }

    /**
     * Crea el tablero inicial 8x8 con todas las piezas en su posición inicial
     * @returns {Array<Array<Object>>} Matriz 8x8 representando el tablero
     * @description Estructura de datos: Matriz bidimensional donde cada celda contiene {piece: ChessPiece|null}
     */
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

    /**
     * Selecciona una pieza en el tablero y calcula sus movimientos válidos
     * @param {number} row - Fila de la pieza a seleccionar
     * @param {number} col - Columna de la pieza a seleccionar
     * @returns {boolean} true si la pieza fue seleccionada, false en caso contrario
     */
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

    /**
     * Calcula los movimientos válidos para una pieza en una posición específica
     * @param {number} row - Fila de la pieza
     * @param {number} col - Columna de la pieza
     * @returns {Array<Object>} Array de movimientos válidos: [{row: number, col: number}, ...]
     * @description Filtra movimientos que dejarían al rey en jaque, implementando un análisis tipo árbol/grafo
     */
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

    /**
     * Verifica si un movimiento dejaría al rey del color actual en jaque
     * @param {number} fromRow - Fila de origen
     * @param {number} fromCol - Columna de origen
     * @param {number} toRow - Fila de destino
     * @param {number} toCol - Columna de destino
     * @returns {boolean} true si el movimiento dejaría al rey en jaque
     * @description Simula el movimiento en un tablero temporal para verificar el estado del rey
     */
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

    /**
     * Verifica si una casilla está bajo ataque por piezas del color oponente
     * @param {number} row - Fila de la casilla
     * @param {number} col - Columna de la casilla
     * @param {string} attackingColor - Color de las piezas atacantes: 'white' o 'black'
     * @param {Array<Array<Object>>} board - Tablero a analizar (por defecto el tablero actual)
     * @returns {boolean} true si la casilla está bajo ataque
     */
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

    /**
     * Mueve una pieza desde una posición a otra y actualiza el estado del juego
     * @param {number} fromRow - Fila de origen
     * @param {number} fromCol - Columna de origen
     * @param {number} toRow - Fila de destino
     * @param {number} toCol - Columna de destino
     * @returns {boolean} true si el movimiento fue exitoso, false en caso contrario
     * @description Guarda el estado en la pila de deshacer y agrega el movimiento al historial
     */
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

    /**
     * Formatea un movimiento en notación de ajedrez para el historial
     * @param {ChessPiece} piece - Pieza que se movió
     * @param {number} fromRow - Fila de origen
     * @param {number} fromCol - Columna de origen
     * @param {number} toRow - Fila de destino
     * @param {number} toCol - Columna de destino
     * @param {boolean} isCapture - Indica si fue una captura
     * @returns {string} Movimiento formateado (ej: "Rey e1e2")
     */
    formatMove(piece, fromRow, fromCol, toRow, toCol, isCapture) {
        const fromSquare = String.fromCharCode(97 + fromCol) + (8 - fromRow);
        const toSquare = String.fromCharCode(97 + toCol) + (8 - toRow);
        const captureSymbol = isCapture ? 'x' : '';
        return `${piece.getName()} ${fromSquare}${captureSymbol}${toSquare}`;
    }

    /**
     * Deshace el último movimiento usando la pila (Stack)
     * @returns {boolean} true si se deshizo exitosamente, false si no hay movimientos para deshacer
     * @description Implementa el patrón LIFO (Last In, First Out) usando una pila
     */
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

    /**
     * Crea una copia profunda del tablero para simulaciones sin afectar el estado original
     * @returns {Array<Array<Object>>} Copia clonada del tablero
     * @description Útil para validar movimientos sin modificar el estado actual
     */
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

    /**
     * Obtiene el tablero actual del juego
     * @returns {Array<Array<Object>>} Matriz 8x8 del tablero
     */
    getBoard() {
        return this.board;
    }

    /**
     * Obtiene el historial completo de movimientos
     * @returns {Array<Object>} Lista de movimientos en orden cronológico
     */
    getHistory() {
        return this.gameHistory;
    }

    /**
     * Obtiene el color del jugador cuyo turno es actual
     * @returns {string} 'white' o 'black'
     */
    getCurrentTurn() {
        return this.currentTurn;
    }

    /**
     * Obtiene la pieza seleccionada actualmente
     * @returns {Object|null} Pieza seleccionada o null si no hay ninguna
     */
    getSelectedPiece() {
        return this.selectedPiece;
    }

    /**
     * Obtiene los movimientos válidos de la pieza seleccionada
     * @returns {Array<Object>} Array de movimientos válidos
     */
    getValidMoves() {
        return this.validMoves;
    }

    /**
     * Obtiene las piezas capturadas por cada jugador
     * @returns {Object} Objeto con arrays de piezas capturadas: {white: Array, black: Array}
     */
    getCapturedPieces() {
        return this.capturedPieces;
    }

    /**
     * Encuentra la posición del rey de un color específico en el tablero
     * @param {string} color - Color del rey a buscar: 'white' o 'black'
     * @param {Array<Array<Object>>} board - Tablero donde buscar (por defecto el tablero actual)
     * @returns {Object|null} Posición del rey: {row: number, col: number} o null si no se encuentra
     */
    findKingPosition(color, board = this.board) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const square = board[r][c];
                if (square.piece && square.piece.type === 'king' && square.piece.color === color) {
                    return { row: r, col: c };
                }
            }
        }
        return null;
    }

    /**
     * Verifica si el rey de un color está en jaque
     * @param {string} color - Color del rey: 'white' o 'black'
     * @returns {boolean} true si el rey está en jaque
     */
    isKingInCheck(color) {
        const kingPos = this.findKingPosition(color);
        if (!kingPos) return false;
        
        const opponentColor = color === 'white' ? 'black' : 'white';
        return this.isSquareUnderAttack(kingPos.row, kingPos.col, opponentColor);
    }

    /**
     * Verifica si el rey de un color está en jaque mate
     * @param {string} color - Color del rey: 'white' o 'black'
     * @returns {boolean} true si el rey está en jaque mate
     * @description Verifica que el rey esté en jaque y que no haya movimientos legales disponibles
     */
    isKingInCheckmate(color) {
        // Primero verificar si está en jaque
        if (!this.isKingInCheck(color)) return false;

        // Verificar si hay algún movimiento legal disponible para cualquier pieza del color
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const square = this.board[r][c];
                if (square.piece && square.piece.color === color) {
                    const validMoves = this.calculateValidMoves(r, c);
                    if (validMoves.length > 0) {
                        // Si hay al menos un movimiento válido, no es jaque mate
                        return false;
                    }
                }
            }
        }
        
        // Si está en jaque y no hay movimientos válidos, es jaque mate
        return true;
    }

    /**
     * Verifica si hay empate por ahogado (rey no está en jaque pero no puede moverse)
     * @param {string} color - Color del rey: 'white' o 'black'
     * @returns {boolean} true si hay empate por ahogado
     */
    isStalemate(color) {
        // Si está en jaque, no es ahogado
        if (this.isKingInCheck(color)) return false;

        // Verificar si hay algún movimiento legal disponible
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const square = this.board[r][c];
                if (square.piece && square.piece.color === color) {
                    const validMoves = this.calculateValidMoves(r, c);
                    if (validMoves.length > 0) {
                        return false;
                    }
                }
            }
        }
        
        // Si no está en jaque pero no puede moverse, es ahogado
        return true;
    }

    /**
     * Obtiene el estado actual del juego (jugando, jaque, jaque mate, empate)
     * @returns {Object} Estado del juego con propiedades: status, winner (si aplica), message
     */
    getGameStatus() {
        const whiteInCheck = this.isKingInCheck('white');
        const blackInCheck = this.isKingInCheck('black');
        const whiteInCheckmate = this.isKingInCheckmate('white');
        const blackInCheckmate = this.isKingInCheckmate('black');
        const whiteStalemate = this.isStalemate('white');
        const blackStalemate = this.isStalemate('black');

        if (whiteInCheckmate) {
            return {
                status: 'checkmate',
                winner: 'black',
                message: '¡Jaque Mate! Las Negras ganan'
            };
        }
        
        if (blackInCheckmate) {
            return {
                status: 'checkmate',
                winner: 'white',
                message: '¡Jaque Mate! Las Blancas ganan'
            };
        }

        if (whiteStalemate || blackStalemate) {
            return {
                status: 'stalemate',
                message: '¡Empate por Ahogado!'
            };
        }

        if (whiteInCheck) {
            return {
                status: 'check',
                inCheck: 'white',
                message: '¡Jaque! Las Blancas están en jaque'
            };
        }

        if (blackInCheck) {
            return {
                status: 'check',
                inCheck: 'black',
                message: '¡Jaque! Las Negras están en jaque'
            };
        }

        return {
            status: 'playing',
            message: null
        };
    }
}
