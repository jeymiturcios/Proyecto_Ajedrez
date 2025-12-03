import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './GameScreen.css';

export default function GameScreen() {
    const location = useLocation();
    const player1Color = location.state?.player1Color || "white";
    const player1Name = location.state?.player1Name || "Jugador 1";
    const player2Name = location.state?.player2Name || "Jugador 2";
    const player2Color = player1Color === "white" ? "black" : "white";
    // En ajedrez, siempre empiezan las blancas, independientemente de quién las tenga
    const [turn, setTurn] = useState("white");
    
    // Historial de partidas (Lista/Cola) - registra movimientos en orden
    const [gameHistory, setGameHistory] = useState([]);
    
    // Pila para deshacer jugadas
    const [undoStack, setUndoStack] = useState([]);
    
    // Refs para igualar alturas y alinear posiciones
    const boardRef = useRef(null);
    const historyRef = useRef(null);
    const boardSectionRef = useRef(null);
    
    // Crear el tablero de 8x8 como matriz 2D (array de arrays)
    const createBoard = () => {
        const board = [];
        for (let row = 0; row < 8; row++) {
            const rowArray = [];
            for (let col = 0; col < 8; col++) {
                const isLight = (row + col) % 2 === 0;
                rowArray.push({
                    row,
                    col,
                    isLight,
                    id: `${row}-${col}`
                });
            }
            board.push(rowArray);
        }
        return board;
    };

    const [board] = useState(createBoard());
    
    // Efecto para igualar la altura del historial con la del tablero y alinear verticalmente
    useEffect(() => {
        const updateHistoryPosition = () => {
            if (boardRef.current && historyRef.current && boardSectionRef.current) {
                // Solo aplicar en pantallas grandes (desktop)
                const isMobile = window.innerWidth <= 1024;
                
                if (isMobile) {
                    // En móviles/tablets, resetear estilos para que el CSS responsive funcione
                    historyRef.current.style.height = 'auto';
                    historyRef.current.style.minHeight = 'auto';
                    historyRef.current.style.maxHeight = 'none';
                    historyRef.current.style.marginTop = '0px';
                } else {
                    // En desktop, igualar altura del historial con la del tablero
                    const boardHeight = boardRef.current.offsetHeight;
                    historyRef.current.style.height = `${boardHeight}px`;
                    historyRef.current.style.minHeight = `${boardHeight}px`;
                    historyRef.current.style.maxHeight = `${boardHeight}px`;
                    
                    // Alinear verticalmente: hacer que el historial comience a la misma altura que el board-section
                    const boardSectionTop = boardSectionRef.current.getBoundingClientRect().top;
                    const historyTop = historyRef.current.getBoundingClientRect().top;
                    const offset = boardSectionTop - historyTop;
                    
                    if (Math.abs(offset) > 1) {
                        historyRef.current.style.marginTop = `${offset}px`;
                    } else {
                        historyRef.current.style.marginTop = '0px';
                    }
                }
            }
        };
        
        // Esperar a que el DOM esté listo y ejecutar varias veces para asegurar
        const timeoutId1 = setTimeout(updateHistoryPosition, 100);
        const timeoutId2 = setTimeout(updateHistoryPosition, 300);
        const timeoutId3 = setTimeout(updateHistoryPosition, 500);
        
        // Actualizar también cuando cambie el tamaño de la ventana
        window.addEventListener('resize', updateHistoryPosition);
        
        return () => {
            clearTimeout(timeoutId1);
            clearTimeout(timeoutId2);
            clearTimeout(timeoutId3);
            window.removeEventListener('resize', updateHistoryPosition);
        };
    }, []); // Array vacío: solo se ejecuta al montar y desmontar

    // Función para hacer un movimiento de prueba
    const makeMove = (move) => {
        const moveData = {
            id: Date.now(),
            player: turn,
            playerName: turn === player1Color ? player1Name : player2Name,
            move: move,
            timestamp: new Date().toLocaleTimeString()
        };
        
        // Agregar al historial (cola)
        setGameHistory(prev => [...prev, moveData]);
        
        // Agregar a la pila de deshacer
        setUndoStack(prev => [...prev, moveData]);
        
        // Cambiar turno
        setTurn(prev => prev === player1Color ? player2Color : player1Color);
    };

    // Función para deshacer la última jugada
    const undoMove = () => {
        if (undoStack.length === 0) return;
        
        // Obtener el último movimiento de la pila
        const lastMove = undoStack[undoStack.length - 1];
        
        // Remover de la pila
        setUndoStack(prev => prev.slice(0, -1));
        
        // Remover del historial
        setGameHistory(prev => prev.filter(move => move.id !== lastMove.id));
        
        // Restaurar el turno
        setTurn(lastMove.player);
    };

    return (
        <div className="game-container">
            <div className="game-header">
                <div className="game-icon">♟️</div>
                <h1 className="game-title">Juego de Ajedrez</h1>
            </div>
            
            <div className="main-content">
                <div className="left-section">
                    <div className="game-controls">
                        <button 
                            className="undo-button" 
                            onClick={undoMove}
                            disabled={undoStack.length === 0}
                        >
                            ↶ Deshacer Jugada
                        </button>
                        <button 
                            className="test-move-button" 
                            onClick={() => makeMove(`Movimiento ${gameHistory.length + 1}`)}
                        >
                            Hacer Movimiento de Prueba
                        </button>
                    </div>

                    <div className="board-section" ref={boardSectionRef}>
                        <div className="players-container">
                            <div className={`player-card ${player1Color === turn ? "active" : ""}`}>
                                <div className="player-icon">{player1Color === "white" ? "♔" : "♚"}</div>
                                <div className="player-details">
                                    <span className="player-label">{player1Name}</span>
                                    <span className="player-color">{player1Color === "white" ? "Blancas" : "Negras"}</span>
                                </div>
                                {player1Color === turn && <div className="turn-indicator">Tu turno</div>}
                            </div>

                            <div className="vs-divider">
                                <span>VS</span>
                            </div>

                            <div className={`player-card ${player2Color === turn ? "active" : ""}`}>
                                <div className="player-icon">{player2Color === "white" ? "♔" : "♚"}</div>
                                <div className="player-details">
                                    <span className="player-label">{player2Name}</span>
                                    <span className="player-color">{player2Color === "white" ? "Blancas" : "Negras"}</span>
                                </div>
                                {player2Color === turn && <div className="turn-indicator">Tu turno</div>}
                            </div>
                        </div>
                        <div className="chess-board" ref={boardRef}>
                            {board.flat().map((square) => (
                                <div
                                    key={square.id}
                                    className={`chess-square ${square.isLight ? 'light' : 'dark'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="right-section">
                    <div className="history-section" ref={historyRef}>
                        <h2 className="history-title">Historial</h2>
                        <div className="history-list">
                            {gameHistory.length === 0 ? (
                                <p className="empty-history">Sin movimientos</p>
                            ) : (
                                gameHistory.map((move, index) => (
                                    <div key={move.id} className="history-item">
                                        <span className="move-number">{index + 1}.</span>
                                        <div className="move-content">
                                            <span className="move-player">{move.playerName}</span>
                                            <span className="move-action">{move.move}</span>
                                            <span className="move-time">{move.timestamp}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}