/**
 * Componente principal de la pantalla de juego
 * @module GameScreen
 * @description Componente que gestiona la interfaz del juego de ajedrez, incluyendo:
 *              - Renderizado del tablero de ajedrez 8x8
 *              - Manejo de interacciones del usuario (clic, selección, movimientos)
 *              - Gestión del estado del juego (turnos, historial, piezas capturadas)
 *              - Integración con paneles laterales (historial, movimientos posibles, partidas guardadas)
 */
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HistoryPanel from './HistoryPanel';
import PossibleMovesPanel from './PossibleMovesPanel';
import SavedGamesPanel from './SavedGamesPanel';
import { ChessGame } from '../../utils/Gamelogic';
import { 
    saveCurrentGame, 
    loadCurrentGame, 
    clearCurrentGame,
    saveGame, 
    getSavedGames,
    loadSavedGame,
    isStorageAvailable 
} from '../../utils/StorageManager';
import '../../styles/GameScreen.css';

/**
 * Componente principal de la pantalla de juego
 * @function GameScreen
 * @returns {JSX.Element} Componente completo del juego de ajedrez
 */
export default function GameScreen() {
    const location = useLocation();
    const initialPlayer1Color = location.state?.player1Color || "white";
    const initialPlayer1Name = location.state?.player1Name || "Jugador 1";
    const initialPlayer2Name = location.state?.player2Name || "Jugador 2";
    
    // Estado para los nombres de los jugadores (pueden cambiar al cargar una partida guardada)
    const [player1Color, setPlayer1Color] = useState(initialPlayer1Color);
    const [player1Name, setPlayer1Name] = useState(initialPlayer1Name);
    const [player2Name, setPlayer2Name] = useState(initialPlayer2Name);
    const player2Color = player1Color === "white" ? "black" : "white";
    
    // Verificar si hay una partida guardada y cargarla
    const [game, setGame] = useState(() => {
        if (isStorageAvailable()) {
            const savedState = loadCurrentGame();
            if (savedState && 
                savedState.player1Color === player1Color &&
                savedState.player1Name === player1Name &&
                savedState.player2Name === player2Name) {
                // Hay una partida guardada con los mismos jugadores, cargarla
                return new ChessGame(player1Color, player1Name, player2Name, savedState);
            } else if (savedState) {
                // Hay una partida guardada pero con diferentes jugadores, limpiarla
                clearCurrentGame();
            }
        }
        // Crear nueva partida
        return new ChessGame(player1Color, player1Name, player2Name);
    });
    
    // Estado para mostrar mensaje de guardado
    const [saveMessage, setSaveMessage] = useState(null);
    const [currentGameId, setCurrentGameId] = useState(null);
    const [refreshSavedGames, setRefreshSavedGames] = useState(0);
    
    // Estado del componente
    const [board, setBoard] = useState(game.getBoard());
    const [gameHistory, setGameHistory] = useState(game.getHistory());
    const [currentTurn, setCurrentTurn] = useState(game.getCurrentTurn());
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [capturedPieces, setCapturedPieces] = useState(game.getCapturedPieces());
    const [gameStatus, setGameStatus] = useState(game.getGameStatus());
    
    // Ref para el tablero (se pasa al HistoryPanel para igualar alturas)
    const boardSectionRef = useRef(null);

    // Efecto para limpiar la partida guardada si los jugadores cambian (solo al inicio)
    useEffect(() => {
        if (isStorageAvailable()) {
            const savedState = loadCurrentGame();
            if (savedState && 
                (savedState.player1Name !== initialPlayer1Name || 
                 savedState.player2Name !== initialPlayer2Name ||
                 savedState.player1Color !== initialPlayer1Color)) {
                // Los jugadores iniciales son diferentes, limpiar la partida guardada
                clearCurrentGame();
            }
        }
    }, []); // Solo ejecutar al montar el componente

    // Función para actualizar el estado del juego
    const updateGameState = () => {
        setBoard([...game.getBoard()]);
        setGameHistory([...game.getHistory()]);
        setCurrentTurn(game.getCurrentTurn());
        setCapturedPieces({...game.getCapturedPieces()});
        setGameStatus(game.getGameStatus());
        
        // Guardar automáticamente después de actualizar el estado
        if (isStorageAvailable()) {
            saveCurrentGame(game);
        }
    };
    
    // Función para mostrar mensaje de guardado temporal
    const showSaveMessage = (message) => {
        setSaveMessage(message);
        setTimeout(() => setSaveMessage(null), 2000);
    };
    
    // Función para guardar partida con nombre
    const handleSaveGame = () => {
        const gameName = prompt('Ingresa un nombre para esta partida:', 
            `Partida ${new Date().toLocaleString()}`);
        
        if (gameName && gameName.trim()) {
            if (isStorageAvailable()) {
                const gameId = saveGame(game, gameName.trim());
                if (gameId) {
                    setCurrentGameId(gameId);
                    setRefreshSavedGames(prev => prev + 1); // Actualizar panel de partidas guardadas
                    showSaveMessage('✅ Partida guardada exitosamente');
                } else {
                    showSaveMessage('❌ Error al guardar la partida');
                }
            } else {
                showSaveMessage('❌ Almacenamiento no disponible');
            }
        }
    };

    // Función para cargar una partida guardada
    const handleLoadSavedGame = (savedState) => {
        // Actualizar los nombres de los jugadores con los de la partida guardada
        setPlayer1Color(savedState.player1Color);
        setPlayer1Name(savedState.player1Name);
        setPlayer2Name(savedState.player2Name);
        
        // Crear nueva instancia del juego con el estado guardado
        const loadedGame = new ChessGame(
            savedState.player1Color,
            savedState.player1Name,
            savedState.player2Name,
            savedState
        );
        
        setGame(loadedGame);
        setBoard([...loadedGame.getBoard()]);
        setGameHistory([...loadedGame.getHistory()]);
        setCurrentTurn(loadedGame.getCurrentTurn());
        setCapturedPieces({...loadedGame.getCapturedPieces()});
        setGameStatus(loadedGame.getGameStatus());
        setSelectedPiece(null);
        setValidMoves([]);
        
        // Guardar como partida actual
        if (isStorageAvailable()) {
            saveCurrentGame(loadedGame);
        }
        
        showSaveMessage('✅ Partida cargada exitosamente');
    };

    // Manejar clic en una casilla del tablero
    const handleSquareClick = (row, col) => {
        // No permitir movimientos si el juego terminó
        if (gameStatus.status === 'checkmate' || gameStatus.status === 'stalemate') {
            return;
        }

        // Si hay una pieza seleccionada, intentar mover
        if (selectedPiece) {
            const moved = game.movePiece(selectedPiece.row, selectedPiece.col, row, col);
            if (moved) {
                // Actualizar estado
                updateGameState();
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
        // No permitir movimientos si el juego terminó
        if (gameStatus.status === 'checkmate' || gameStatus.status === 'stalemate') {
            return;
        }

        const moved = game.movePiece(fromRow, fromCol, toRow, toCol);
        if (moved) {
            updateGameState();
            setSelectedPiece(null);
            setValidMoves([]);
        }
    };

    // Función para deshacer la última jugada
    const undoMove = () => {
        const undone = game.undoMove();
        if (undone) {
            updateGameState();
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

    // Verificar si el rey está en jaque en esta casilla
    const isKingInCheck = (row, col) => {
        const square = board[row][col];
        if (!square.piece || square.piece.type !== 'king') return false;
        
        if (gameStatus.status === 'check' && gameStatus.inCheck === square.piece.color) {
            return true;
        }
        return false;
    };

    return (
        <div className="game-container">
            <div className="game-header">
                <div className="game-icon"></div>
                <h1 className="game-title">Juego de Ajedrez ♟️</h1>
                {/* Mostrar estado del juego (jaque, jaque mate, etc.) */}
                {gameStatus.message && (
                    <div className={`game-status-message ${gameStatus.status}`}>
                        {gameStatus.message}
                    </div>
                )}
                {/* Mensaje de guardado */}
                {saveMessage && (
                    <div className="save-message">
                        {saveMessage}
                    </div>
                )}
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

                                {/* Botones de control debajo de las tarjetas de jugadores */}
                                <div className="undo-control-container">
                                    <button 
                                        className="undo-button" 
                                        onClick={undoMove}
                                        disabled={gameHistory.length === 0}
                                    >
                                        ↶ Deshacer Jugada
                                    </button>
                                    <button 
                                        className="save-game-button"
                                        onClick={handleSaveGame}
                                        title="Guardar partida con nombre"
                                    >
                                        💾 Guardar Partida
                                    </button>
                                    <SavedGamesPanel 
                                        onLoadGame={handleLoadSavedGame}
                                        currentGameId={currentGameId}
                                        refreshTrigger={refreshSavedGames}
                                        compact={true}
                                    />
                                </div>
                            </div>

                            <div className="chess-board">
                                        {board.map((row, rowIndex) => 
                                        row.map((square, colIndex) => {
                                            const isLightSquare = (rowIndex + colIndex) % 2 === 0;
                                            const selected = isSelected(rowIndex, colIndex);
                                            const validMove = isValidMove(rowIndex, colIndex);
                                            const kingInCheck = isKingInCheck(rowIndex, colIndex);
                                            
                                            return (
                                                <div
                                                    key={`${rowIndex}-${colIndex}`}
                                                    className={`chess-square ${isLightSquare ? "light" : "dark"} ${selected ? "selected" : ""} ${validMove ? "valid-move" : ""} ${kingInCheck ? "king-in-check" : ""}`}
                                                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                                                >   
                                                    {validMove && !square.piece && (
                                                        <div className="move-indicator"></div>
                                                    )}
                                                    {square.piece && (
                                                        <span className={`piece ${square.piece.color === currentTurn && selected ? "selected-piece" : ""} ${kingInCheck ? "check-king" : ""}`}>
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
