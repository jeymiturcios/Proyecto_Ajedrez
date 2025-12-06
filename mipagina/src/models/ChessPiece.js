/**
 * Clase que representa una pieza de ajedrez
 * @class ChessPiece
 * @description Modela las características y comportamientos de una pieza de ajedrez,
 *              incluyendo su tipo, color, posición y movimientos válidos según las reglas del ajedrez.
 */
export class ChessPiece {
    /**
     * Constructor de la clase ChessPiece
     * @constructor
     * @param {string} type - Tipo de pieza: 'pawn', 'rook', 'knight', 'bishop', 'queen', 'king'
     * @param {string} color - Color de la pieza: 'white' o 'black'
     * @param {Object} position - Posición en el tablero: {row: number, col: number}
     */
    constructor(type, color, position){
        /** @type {string} Tipo de pieza: 'pawn', 'rook', 'knight', 'bishop', 'queen', 'king' */
        this.type=type;
        
        /** @type {string} Color de la pieza: 'white' o 'black' */
        this.color=color;
        
        /** @type {Object} Posición en el tablero: {row: number, col: number} */
        this.position=position;
        
        /** @type {boolean} Indica si la pieza ya se ha movido (importante para peones y enroque) */
        this.hasMoved=false;
    }
    /**
     * Obtiene el símbolo Unicode de la pieza según su tipo y color
     * @returns {string} Símbolo Unicode de la pieza
     * @example
     * const piece = new ChessPiece('king', 'white', {row: 0, col: 4});
     * piece.getSymbol(); // Retorna '♔'
     */
    getSymbol(){
        const symbols={
            white:{
                king: '♔',
                queen: '♕',
                rook: '♖',
                bishop: '♗',
                knight: '♘',
                pawn: '♙'
            },
            black:{
                king: '♚',
                queen: '♛',
                rook: '♜',
                bishop: '♝',
                knight: '♞',
                pawn: '♟︎'
            }
        };
        return symbols[this.color][this.type];
        }
        
    /**
     * Obtiene el nombre de la pieza en español
     * @returns {string} Nombre de la pieza en español
     * @example
     * const piece = new ChessPiece('queen', 'white', {row: 0, col: 3});
     * piece.getName(); // Retorna 'Reina'
     */
    getName(){
            const names={
                king: 'Rey',
                queen: 'Reina',
                rook: 'Torre',  
                bishop: 'Alfil',
                knight: 'Caballo',
                pawn: 'Peón'
            };
            return names[this.type];
            }

    /**
     * Crea una copia clonada de la pieza
     * @returns {ChessPiece} Nueva instancia de ChessPiece con las mismas propiedades
     */
    clone(){
        const cloned = new ChessPiece(this.type, this.color, {...this.position});
        cloned.hasMoved = this.hasMoved;
        return cloned;
    }
    
    /**
     * Mueve la pieza a una nueva posición y marca que ya se ha movido
     * @param {number} row - Fila destino
     * @param {number} col - Columna destino
     */
    moveTo(row, col){
        this.position={row, col};
        this.hasMoved=true;
    }

    /**
     * Obtiene los movimientos posibles básicos de la pieza
     * @param {Array<Array<Object>>} board - Tablero 8x8 con las piezas
     * @returns {Array<Object>} Array de movimientos posibles: [{row: number, col: number}, ...]
     * @description Calcula los movimientos sin considerar si dejarían al rey en jaque
     */
    getPossibleMoves(board) {
        const { row, col } = this.position;
        const moves = [];

        switch(this.type) {
            case 'pawn':
                return this.getPawnMoves(board);
            case 'rook':
                return this.getRookMoves(board);
            case 'knight':
                return this.getKnightMoves(board);
            case 'bishop':
                return this.getBishopMoves(board);
            case 'queen':
                return this.getQueenMoves(board);
            case 'king':
                return this.getKingMoves(board);
            default:
                return [];
        }
    }

    /**
     * Calcula los movimientos posibles del peón
     * @param {Array<Array<Object>>} board - Tablero 8x8
     * @returns {Array<Object>} Array de movimientos válidos para el peón
     * @description Implementa las reglas del peón: avance, doble avance inicial, y captura diagonal
     */
    getPawnMoves(board) {
        const { row, col } = this.position;
        const moves = [];
        const direction = this.color === 'white' ? -1 : 1; // Blancas suben (row disminuye), negras bajan (row aumenta)
        const startRow = this.color === 'white' ? 6 : 1;

        // Movimiento hacia adelante 1 casilla
        if (this.isValidSquare(row + direction, col, board, false)) {
            moves.push({ row: row + direction, col });
            
            // Movimiento hacia adelante 2 casillas (solo en el primer movimiento)
            // Verificar que ambas casillas estén vacías
            if (!this.hasMoved && row === startRow) {
                const intermediateRow = row + direction;
                const finalRow = row + 2 * direction;
                if (this.isInBounds(intermediateRow, col) && 
                    this.isInBounds(finalRow, col) &&
                    !board[intermediateRow][col].piece &&
                    !board[finalRow][col].piece) {
                    moves.push({ row: finalRow, col });
                }
            }
        }

        // Captura en diagonal izquierda
        if (this.isInBounds(row + direction, col - 1)) {
            const targetSquare = board[row + direction][col - 1];
            if (targetSquare.piece && targetSquare.piece.color !== this.color) {
                moves.push({ row: row + direction, col: col - 1 });
            }
        }

        // Captura en diagonal derecha
        if (this.isInBounds(row + direction, col + 1)) {
            const targetSquare = board[row + direction][col + 1];
            if (targetSquare.piece && targetSquare.piece.color !== this.color) {
                moves.push({ row: row + direction, col: col + 1 });
            }
        }

        return moves;
    }

    /**
     * Calcula los movimientos posibles de la torre
     * @param {Array<Array<Object>>} board - Tablero 8x8
     * @returns {Array<Object>} Array de movimientos válidos para la torre
     * @description La torre se mueve horizontal o verticalmente hasta encontrar una pieza o el borde
     */
    getRookMoves(board) {
        const { row, col } = this.position;
        const moves = [];
        const directions = [
            { dr: -1, dc: 0 }, // Arriba
            { dr: 1, dc: 0 },  // Abajo
            { dr: 0, dc: -1 }, // Izquierda
            { dr: 0, dc: 1 }   // Derecha
        ];

        for (const { dr, dc } of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dr * i;
                const newCol = col + dc * i;
                
                if (!this.isInBounds(newRow, newCol)) break;
                
                const square = board[newRow][newCol];
                if (!square.piece) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (square.piece.color !== this.color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        }

        return moves;
    }

    /**
     * Calcula los movimientos posibles del caballo
     * @param {Array<Array<Object>>} board - Tablero 8x8
     * @returns {Array<Object>} Array de movimientos válidos para el caballo
     * @description El caballo se mueve en forma de L y puede saltar sobre otras piezas
     */
    getKnightMoves(board) {
        const { row, col } = this.position;
        const moves = [];
        const knightMoves = [
            { dr: -2, dc: -1 }, { dr: -2, dc: 1 },
            { dr: -1, dc: -2 }, { dr: -1, dc: 2 },
            { dr: 1, dc: -2 }, { dr: 1, dc: 2 },
            { dr: 2, dc: -1 }, { dr: 2, dc: 1 }
        ];

        for (const { dr, dc } of knightMoves) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isInBounds(newRow, newCol)) {
                const square = board[newRow][newCol];
                if (!square.piece || square.piece.color !== this.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    /**
     * Calcula los movimientos posibles del alfil
     * @param {Array<Array<Object>>} board - Tablero 8x8
     * @returns {Array<Object>} Array de movimientos válidos para el alfil
     * @description El alfil se mueve en diagonal hasta encontrar una pieza o el borde
     */
    getBishopMoves(board) {
        const { row, col } = this.position;
        const moves = [];
        const directions = [
            { dr: -1, dc: -1 }, // Diagonal superior izquierda
            { dr: -1, dc: 1 },  // Diagonal superior derecha
            { dr: 1, dc: -1 },  // Diagonal inferior izquierda
            { dr: 1, dc: 1 }    // Diagonal inferior derecha
        ];

        for (const { dr, dc } of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dr * i;
                const newCol = col + dc * i;
                
                if (!this.isInBounds(newRow, newCol)) break;
                
                const square = board[newRow][newCol];
                if (!square.piece) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (square.piece.color !== this.color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        }

        return moves;
    }

    /**
     * Calcula los movimientos posibles de la reina
     * @param {Array<Array<Object>>} board - Tablero 8x8
     * @returns {Array<Object>} Array de movimientos válidos para la reina
     * @description La reina combina los movimientos de la torre y el alfil
     */
    getQueenMoves(board) {
        return [...this.getRookMoves(board), ...this.getBishopMoves(board)];
    }

    /**
     * Calcula los movimientos posibles del rey
     * @param {Array<Array<Object>>} board - Tablero 8x8
     * @returns {Array<Object>} Array de movimientos válidos para el rey
     * @description El rey se mueve una casilla en cualquier dirección
     */
    getKingMoves(board) {
        const { row, col } = this.position;
        const moves = [];
        const directions = [
            { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
            { dr: 0, dc: -1 },                     { dr: 0, dc: 1 },
            { dr: 1, dc: -1 },  { dr: 1, dc: 0 },  { dr: 1, dc: 1 }
        ];

        for (const { dr, dc } of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isInBounds(newRow, newCol)) {
                const square = board[newRow][newCol];
                if (!square.piece || square.piece.color !== this.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    /**
     * Verifica si una casilla es válida para moverse
     * @param {number} row - Fila de la casilla
     * @param {number} col - Columna de la casilla
     * @param {Array<Array<Object>>} board - Tablero 8x8
     * @param {boolean} isCapture - Indica si es un movimiento de captura
     * @returns {boolean} true si la casilla es válida, false en caso contrario
     */
    isValidSquare(row, col, board, isCapture) {
        if (!this.isInBounds(row, col)) return false;
        
        const square = board[row][col];
        
        if (isCapture) {
            // Para captura, debe haber una pieza del color opuesto
            return square.piece && square.piece.color !== this.color;
        } else {
            // Para movimiento normal, la casilla debe estar vacía
            return !square.piece;
        }
    }

    /**
     * Verifica si las coordenadas están dentro de los límites del tablero (8x8)
     * @param {number} row - Fila a verificar
     * @param {number} col - Columna a verificar
     * @returns {boolean} true si está dentro de los límites, false en caso contrario
     */
    isInBounds(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
}