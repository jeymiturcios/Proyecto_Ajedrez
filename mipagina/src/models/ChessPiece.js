export class ChessPiece {
    constructor(type, color, position){
        this.type=type; // 'pawn', 'rook', 'knight', 'bishop', 'queen', 'king'
        this.color=color; // 'white' or 'black'
        this.position=position;// {row, col}
        this.hasMoved=false; //Para el primer movimiento (importante para peones y enroque)
    }
    //Obtener el simbolo Unicode del pieza
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
        //Nombre de la pieza en español
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

            //Clonar la pieza
    clone(){
        const cloned = new ChessPiece(this.type, this.color, {...this.position});
        cloned.hasMoved = this.hasMoved;
        return cloned;
    }
    moveTo(row, col){
        this.position={row, col};
        this.hasMoved=true;
    }

    // Obtener movimientos posibles básicos (sin considerar obstáculos ni jaque)
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

    // Movimientos del peón
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

    // Movimientos de la torre (horizontal/vertical)
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

    // Movimientos del caballo (en L)
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

    // Movimientos del alfil (diagonal)
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

    // Movimientos de la reina (combinación de torre y alfil)
    getQueenMoves(board) {
        return [...this.getRookMoves(board), ...this.getBishopMoves(board)];
    }

    // Movimientos del rey (1 casilla en cualquier dirección)
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

    // Verificar si una casilla es válida para moverse
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

    // Verificar si las coordenadas están dentro del tablero
    isInBounds(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
}