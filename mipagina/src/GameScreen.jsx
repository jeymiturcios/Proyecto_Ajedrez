import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './GameScreen.css';

export default function GameScreen() {
    const location = useLocation();
    const player1Color = location.state?.player1Color || "white";
    const player1Name = location.state?.player1Name || "Jugador 1";
    const player2Name = location.state?.player2Name || "Jugador 2";
    const player2Color = player1Color === "white" ? "black" : "white";
    const [turn, setTurn] = useState(player1Color);
    
    // Historial de partidas (Lista/Cola) - registra movimientos en orden
    const [gameHistory, setGameHistory] = useState([]);
    
    // Pila para deshacer jugadas
    const [undoStack, setUndoStack] = useState([]);
    
    // Refs para igualar alturas
    const boardSectionRef = useRef(null);
    const historySectionRef = useRef(null);
    
    // Efecto para igualar la altura y posición del historial con la del tablero
    useEffect(() => {
        const updateHeight = () => {
            if (boardSectionRef.current && historySectionRef.current) {
                const boardRect = boardSectionRef.current.getBoundingClientRect();
                const boardHeight = boardRect.height;
                const boardTop = boardRect.top;
                
                // Aplicar la altura del tablero al historial
                historySectionRef.current.style.height = `${boardHeight}px`;
                historySectionRef.current.style.minHeight = `${boardHeight}px`;
                
                // Sincronizar la posición vertical
                const historyRect = historySectionRef.current.getBoundingClientRect();
                const historyTop = historyRect.top;
                const offset = boardTop - historyTop;
                
                if (Math.abs(offset) > 1) {
                    historySectionRef.current.style.marginTop = `${offset}px`;
                }
            }
        };
        
        // Usar requestAnimationFrame para asegurar que el DOM esté renderizado
        const rafId = requestAnimationFrame(() => {
            updateHeight();
            // Doble verificación después de un pequeño delay
            setTimeout(updateHeight, 50);
            setTimeout(updateHeight, 200);
        });
        
        window.addEventListener('resize', updateHeight);
        
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', updateHeight);
        };
    }, [gameHistory]);
    
    // Efecto adicional para actualizar la altura cuando el componente se monta
    useEffect(() => {
        const updateHeight = () => {
            if (boardSectionRef.current && historySectionRef.current) {
                const boardRect = boardSectionRef.current.getBoundingClientRect();
                const boardHeight = boardRect.height;
                const boardTop = boardRect.top;
                
                historySectionRef.current.style.height = `${boardHeight}px`;
                historySectionRef.current.style.minHeight = `${boardHeight}px`;
                
                // Sincronizar la posición vertical
                const historyRect = historySectionRef.current.getBoundingClientRect();
                const historyTop = historyRect.top;
                const offset = boardTop - historyTop;
                
                if (Math.abs(offset) > 1) {
                    historySectionRef.current.style.marginTop = `${offset}px`;
                }
            }
        };
        
        // Esperar a que el DOM esté completamente listo
        const timeoutId1 = setTimeout(updateHeight, 100);
        const timeoutId2 = setTimeout(updateHeight, 300);
        const timeoutId3 = setTimeout(updateHeight, 500);
        
        return () => {
            clearTimeout(timeoutId1);
            clearTimeout(timeoutId2);
            clearTimeout(timeoutId3);
        };
    }, []);

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
                        <div className="board-placeholder">
                            <div className="placeholder-content">
                                <div className="placeholder-icon">♟️</div>
                                <p className="placeholder-text">Tablero de ajedrez</p>
                                <p className="placeholder-subtext">Próximamente...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-section">
                    <div className="history-section" ref={historySectionRef}>
                        <h2 className="history-title">Historial de Partidas</h2>
                        <div className="history-list">
                            {gameHistory.length === 0 ? (
                                <p className="empty-history">No hay movimientos registrados aún</p>
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