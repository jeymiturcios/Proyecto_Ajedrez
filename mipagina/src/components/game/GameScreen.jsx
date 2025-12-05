import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HistoryPanel from './HistoryPanel';
import PossibleMovesPanel from './PossibleMovesPanel';
import { ChessGame } from '../../utils/Gamelogic';
import '../../styles/GameScreen.css';

export default function GameScreen() {
    const location = useLocation();
    const player1Color = location.state?.player1Color || "white";
    const player1Name = location.state?.player1Name || "Jugador 1";
    const player2Name = location.state?.player2Name || "Jugador 2";
    const player2Color = player1Color === "white" ? "black" : "white";
    
    // Crear instancia del juego
    const [game] = useState(() => new ChessGame(player1Color, player1Name, player2Name));
    
    // Estado del componente
    const [board, setBoard] = useState(game.getBoard());
    const [gameHistory, setGameHistory] = useState(game.getHistory());
    const [currentTurn, setCurrentTurn] = useState(game.getCurrentTurn());
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [capturedPieces, setCapturedPieces] = useState(game.getCapturedPieces());
    
    // Ref para el tablero (se pasa al HistoryPanel para igualar alturas)
    const boardSectionRef = useRef(null);

    // Manejar clic en una casilla del tablero
    const handleSquareClick = (row, col) => {
        // Si hay una pieza seleccionada, intentar mover
        if (selectedPiece) {
            const moved = game.movePiece(selectedPiece.row, selectedPiece.col, row, col);
            if (moved) {
                // Actualizar estado
                setBoard([...game.getBoard()]);
                setGameHistory([...game.getHistory()]);
                setCurrentTurn(game.getCurrentTurn());
                setCapturedPieces({...game.getCapturedPieces()});
                setSelectedPiece(null);
                setValidMoves([]);
            } else {
                // Si el movimiento no es válido, intentar seleccionar otra pieza
                game.selectPiece(row, col);
                const newSelected = game.getSelectedPiece();
                setSelectedPiece(newSelected);
                setValidMoves(game.getValidMoves());
            }
        } else {
            // Seleccionar una pieza
            const selected = game.selectPiece(row, col);
            if (selected) {
                setSelectedPiece(game.getSelectedPiece());
                setValidMoves(game.getValidMoves());
            }
        }
    };

    // Manejar clic en un movimiento del panel (para mover directamente)
    const handleMoveFromPanel = (fromRow, fromCol, toRow, toCol) => {
        const moved = game.movePiece(fromRow, fromCol, toRow, toCol);
        if (moved) {
            setBoard([...game.getBoard()]);
            setGameHistory([...game.getHistory()]);
            setCurrentTurn(game.getCurrentTurn());
            setCapturedPieces({...game.getCapturedPieces()});
            setSelectedPiece(null);
            setValidMoves([]);
        }
    };

    // Función para deshacer la última jugada
    const undoMove = () => {
        const undone = game.undoMove();
        if (undone) {
            setBoard([...game.getBoard()]);
            setGameHistory([...game.getHistory()]);
            setCurrentTurn(game.getCurrentTurn());
            setCapturedPieces({...game.getCapturedPieces()});
            setSelectedPiece(null);
            setValidMoves([]);
        }
    };

    // Verificar si una casilla es un movimiento válido
    const isValidMove = (row, col) => {
        return validMoves.some(move => move.row === row && move.col === col);
    };

    // Verificar si una casilla está seleccionada
    const isSelected = (row, col) => {
        return selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
    };

    return (
        <div className="game-container">
            <div className="game-header">
                <div className="game-icon"></div>
                <h1 className="game-title">Juego de Ajedrez ♟️</h1>
            </div>
            
            <div className="main-content">
                <div className="left-section">
                    <div className="board-section" ref={boardSectionRef}>
                        <div className="players-and-board">
                            <div className="players-section">
                                <div className="players-container">
                                    {/* Si jugador 1 eligió negras, va arriba; si eligió blancas, va abajo */}
                                    {player1Color === "black" ? (
                                        <>
                                            <div className={`player-card ${player1Color === currentTurn ? "active" : ""}`}>
                                                <div className="player-card-header">
                                                    <div className="player-icon">{player1Color === "white" ? "♔" : "♚"}</div>
                                                    <div className="player-details">
                                                        <span className="player-label">{player1Name}</span>
                                                        <span className="player-color">{player1Color === "white" ? "Blancas" : "Negras"}</span>
                                                    </div>
                                                    {player1Color === currentTurn && <div className="turn-indicator">Tu turno</div>}
                                                </div>
                                                {/* Piezas capturadas del jugador 1 (muestra piezas del oponente que capturó) */}
                                                {capturedPieces[player2Color].length > 0 && (
                                                    <div className="captured-pieces">
                                                        {capturedPieces[player2Color].map((piece, index) => (
                                                            <span key={index} className="captured-piece">{piece.getSymbol()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="vs-divider">
                                                <span>VS</span>
                                            </div>

                                            <div className={`player-card ${player2Color === currentTurn ? "active" : ""}`}>
                                                <div className="player-card-header">
                                                    <div className="player-icon">{player2Color === "white" ? "♔" : "♚"}</div>
                                                    <div className="player-details">
                                                        <span className="player-label">{player2Name}</span>
                                                        <span className="player-color">{player2Color === "white" ? "Blancas" : "Negras"}</span>
                                                    </div>
                                                    {player2Color === currentTurn && <div className="turn-indicator">Tu turno</div>}
                                                </div>
                                                {/* Piezas capturadas del jugador 2 (muestra piezas del oponente que capturó) */}
                                                {capturedPieces[player1Color].length > 0 && (
                                                    <div className="captured-pieces">
                                                        {capturedPieces[player1Color].map((piece, index) => (
                                                            <span key={index} className="captured-piece">{piece.getSymbol()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={`player-card ${player2Color === currentTurn ? "active" : ""}`}>
                                                <div className="player-card-header">
                                                    <div className="player-icon">{player2Color === "white" ? "♔" : "♚"}</div>
                                                    <div className="player-details">
                                                        <span className="player-label">{player2Name}</span>
                                                        <span className="player-color">{player2Color === "white" ? "Blancas" : "Negras"}</span>
                                                    </div>
                                                    {player2Color === currentTurn && <div className="turn-indicator">Tu turno</div>}
                                                </div>
                                                {/* Piezas capturadas del jugador 2 (muestra piezas del oponente que capturó) */}
                                                {capturedPieces[player1Color].length > 0 && (
                                                    <div className="captured-pieces">
                                                        {capturedPieces[player1Color].map((piece, index) => (
                                                            <span key={index} className="captured-piece">{piece.getSymbol()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="vs-divider">
                                                <span>VS</span>
                                            </div>

                                            <div className={`player-card ${player1Color === currentTurn ? "active" : ""}`}>
                                                <div className="player-card-header">
                                                    <div className="player-icon">{player1Color === "white" ? "♔" : "♚"}</div>
                                                    <div className="player-details">
                                                        <span className="player-label">{player1Name}</span>
                                                        <span className="player-color">{player1Color === "white" ? "Blancas" : "Negras"}</span>
                                                    </div>
                                                    {player1Color === currentTurn && <div className="turn-indicator">Tu turno</div>}
                                                </div>
                                                {/* Piezas capturadas del jugador 1 (muestra piezas del oponente que capturó) */}
                                                {capturedPieces[player2Color].length > 0 && (
                                                    <div className="captured-pieces">
                                                        {capturedPieces[player2Color].map((piece, index) => (
                                                            <span key={index} className="captured-piece">{piece.getSymbol()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Botón deshacer debajo de las tarjetas de jugadores */}
                                <div className="undo-control-container">
                                    <button 
                                        className="undo-button" 
                                        onClick={undoMove}
                                        disabled={gameHistory.length === 0}
                                    >
                                        ↶ Deshacer Jugada
                                    </button>
                                </div>
                            </div>

                            <div className="chess-board">
                                {board.map((row, rowIndex) => 
                                row.map((square, colIndex) => {
                                    const isLightSquare = (rowIndex + colIndex) % 2 === 0;
                                    const selected = isSelected(rowIndex, colIndex);
                                    const validMove = isValidMove(rowIndex, colIndex);
                                    
                                    return (
                                        <div
                                            key={`${rowIndex}-${colIndex}`}
                                            className={`chess-square ${isLightSquare ? "light" : "dark"} ${selected ? "selected" : ""} ${validMove ? "valid-move" : ""}`}
                                            onClick={() => handleSquareClick(rowIndex, colIndex)}
                                        >   
                                            {validMove && !square.piece && (
                                                <div className="move-indicator"></div>
                                            )}
                                            {square.piece && (
                                                <span className={`piece ${square.piece.color === currentTurn && selected ? "selected-piece" : ""}`}>
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
                </div>

                <div className="right-section">
                    <div className="right-panels-container">
                        <PossibleMovesPanel 
                            selectedPiece={selectedPiece}
                            validMoves={validMoves}
                            board={board}
                            onMoveClick={handleMoveFromPanel}
                        />
                        <HistoryPanel 
                            gameHistory={gameHistory} 
                            boardSectionRef={boardSectionRef}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
