/**
 * Estructuras de Datos para el Juego de Ajedrez
 * 
 * Stack (Pila): Para deshacer jugadas
 * Queue (Cola): Para historial de partidas
 */

/**
 * Clase Stack (Pila) - LIFO (Last In, First Out)
 * Usada para almacenar movimientos y permitir deshacer jugadas
 */
export class Stack {
    constructor() {
        this.items = [];
    }

    // Agregar un elemento a la pila (push)
    push(element) {
        this.items.push(element);
    }

    // Eliminar y retornar el último elemento (pop)
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop();
    }

    // Ver el último elemento sin eliminarlo (peek)
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }

    // Verificar si la pila está vacía
    isEmpty() {
        return this.items.length === 0;
    }

    // Obtener el tamaño de la pila
    size() {
        return this.items.length;
    }

    // Limpiar la pila
    clear() {
        this.items = [];
    }

    // Obtener todos los elementos (útil para debugging)
    getAll() {
        return [...this.items];
    }
}

/**
 * Clase Queue (Cola) - FIFO (First In, First Out)
 * Usada para almacenar el historial de movimientos en orden
 */
export class Queue {
    constructor() {
        this.items = [];
    }

    // Agregar un elemento al final de la cola (enqueue)
    enqueue(element) {
        this.items.push(element);
    }

    // Eliminar y retornar el primer elemento (dequeue)
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    // Ver el primer elemento sin eliminarlo (front)
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }

    // Verificar si la cola está vacía
    isEmpty() {
        return this.items.length === 0;
    }

    // Obtener el tamaño de la cola
    size() {
        return this.items.length;
    }

    // Limpiar la cola
    clear() {
        this.items = [];
    }

    // Obtener todos los elementos en orden
    getAll() {
        return [...this.items];
    }

    // Obtener los últimos N elementos
    getLast(n) {
        return this.items.slice(-n);
    }
}

/**
 * Clase Move - Representa un movimiento en el ajedrez
 */
export class Move {
    constructor(from, to, piece, capturedPiece = null, timestamp = null) {
        this.from = from; // Posición origen (ej: "e2")
        this.to = to; // Posición destino (ej: "e4")
        this.piece = piece; // Pieza movida (ej: "pawn", "rook", etc.)
        this.capturedPiece = capturedPiece; // Pieza capturada (si hay)
        this.timestamp = timestamp || new Date(); // Momento del movimiento
        this.moveNumber = null; // Número de movimiento en la partida
    }

    // Convertir a notación de ajedrez estándar
    toNotation() {
        return `${this.from} → ${this.to}`;
    }

    // Convertir a objeto JSON
    toJSON() {
        return {
            from: this.from,
            to: this.to,
            piece: this.piece,
            capturedPiece: this.capturedPiece,
            timestamp: this.timestamp.toISOString(),
            moveNumber: this.moveNumber
        };
    }
}

/**
 * Clase GameState - Representa el estado completo del juego
 * Se guarda en la pila para poder deshacer movimientos
 */
export class GameState {
    constructor(board, turn, moveHistory, moveNumber) {
        this.board = JSON.parse(JSON.stringify(board)); // Copia profunda del tablero
        this.turn = turn; // Turno actual
        this.moveHistory = [...moveHistory]; // Copia del historial
        this.moveNumber = moveNumber; // Número de movimiento
        this.timestamp = new Date();
    }

    // Convertir a objeto JSON
    toJSON() {
        return {
            board: this.board,
            turn: this.turn,
            moveHistory: this.moveHistory,
            moveNumber: this.moveNumber,
            timestamp: this.timestamp.toISOString()
        };
    }
}

