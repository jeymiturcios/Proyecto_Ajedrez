import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import HistoryPanel from './HistoryPanel';
import { ChessPiece } from '../../models/ChessPiece';
import '../../styles/GameScreen.css';

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
    
    // Ref para el tablero (se pasa al HistoryPanel para igualar alturas)
    const boardSectionRef = useRef(null); 
    
    // Crear el tablero de 8x8 
    const createBoard = () => {
        const board = [];
        for (let row = 0; row < 8; row++) {
            const rowArray = [];

            for (let col = 0; col < 8; col++) {
                let piece = null;
             
                //Fila 0: Piezas negras principales
                if(row === 0){
                    const pieces =['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
                    piece = new ChessPiece(pieces[col], 'black', {row, col});
                }
                //Fila 1: Peones negros
                else if(row === 1){
                    piece = new ChessPiece('pawn', 'black', {row, col});
                }
                //Fila 6: Peones blancos
                else if(row === 6){
                    piece = new ChessPiece('pawn', 'white', {row, col});
                }
                //Fila 7: Piezas blancas principales
                else if(row === 7){
                    const pieces =['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
                    piece = new ChessPiece(pieces[col], 'white', {row, col});
                }
                rowArray.push({piece});
            }
            board.push(rowArray);
        }
        return board;
    };

    const [board] = useState(createBoard());

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
                <div className="game-icon"></div>
                <h1 className="game-title">Juego de Ajedrez ♟️</h1>
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
                        <div className="chess-board">
                            {board.map((row, rowIndex) => 
                            row.map((square, colIndex) => {
                                const isLightSquare = (rowIndex + colIndex) % 2 === 0;
                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`chess-square ${isLightSquare ? "light" : "dark"}`}
                                    >   
                                    {square.piece && (
                                        <span className="piece">
                                            {square.piece.getSymbol()}
                                        </span>
                                    )}
                                    </div>
                                );
                            })
                            )}
                        </div>
                    </div>
                </div>

                <div className="right-section">
                    <HistoryPanel 
                        gameHistory={gameHistory} 
                        boardSectionRef={boardSectionRef}
                    />
                </div>
            </div>
        </div>
    );
}
