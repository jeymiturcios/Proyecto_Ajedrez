import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getSavedGames, loadSavedGame, deleteSavedGame } from '../../utils/StorageManager';
import '../../styles/GameScreen.css';

export default function SavedGamesPanel({ onLoadGame, currentGameId, refreshTrigger, compact = false }) {
    const [savedGames, setSavedGames] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Cargar partidas guardadas
    useEffect(() => {
        loadSavedGames();
    }, [refreshTrigger]);

    const loadSavedGames = () => {
        const games = getSavedGames();
        // Ordenar por última vez jugada (más reciente primero)
        games.sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed));
        setSavedGames(games);
    };

    const handleLoadGame = (gameId) => {
        const gameState = loadSavedGame(gameId);
        if (gameState && onLoadGame) {
            onLoadGame(gameState);
            setIsOpen(false);
        }
    };

    const handleDeleteGame = (gameId, e) => {
        e.stopPropagation(); // Prevenir que se active el clic de cargar
        if (window.confirm('¿Estás seguro de que quieres eliminar esta partida?')) {
            if (deleteSavedGame(gameId)) {
                loadSavedGames();
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Si está en modo compacto y no está abierto, mostrar solo el botón
    if (compact && !isOpen) {
        return (
            <button 
                className="saved-games-toggle-button"
                onClick={() => setIsOpen(true)}
                title="Ver partidas guardadas"
            >
                📁 Partidas Guardadas ({savedGames.length})
            </button>
        );
    }

    // Si está en modo compacto y está abierto, mostrar el panel como modal/overlay usando Portal
    if (compact && isOpen) {
        const modalContent = (
            <>
                <div className="saved-games-overlay" onClick={() => setIsOpen(false)}></div>
                <div className="saved-games-panel-compact" onClick={(e) => e.stopPropagation()}>
                    <div className="saved-games-header">
                        <div className="saved-games-title-container">
                            <span className="folder-icon">📁</span>
                            <h3 className="saved-games-title">Partidas Guardadas</h3>
                        </div>
                        <button 
                            className="close-panel-button"
                            onClick={() => setIsOpen(false)}
                            title="Cerrar panel"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="saved-games-list">
                        {savedGames.length === 0 ? (
                            <div className="empty-saved-games">
                                <p>No hay partidas guardadas</p>
                                <p className="empty-hint">Guarda una partida usando el botón "💾 Guardar Partida"</p>
                            </div>
                        ) : (
                            savedGames.map((game) => (
                                <div 
                                    key={game.id} 
                                    className={`saved-game-item ${currentGameId === game.id ? 'current-game' : ''}`}
                                    onClick={() => handleLoadGame(game.id)}
                                >
                                    <div className="saved-game-info">
                                        <div className="saved-game-name">{game.name}</div>
                                        <div className="saved-game-meta">
                                            <span className="saved-game-date">
                                                {formatDate(game.lastPlayed)}
                                            </span>
                                            <span className="saved-game-moves">
                                                {game.state?.gameHistory?.length || 0} movimientos
                                            </span>
                                        </div>
                                        <div className="saved-game-players">
                                            <span className="player-badge white">
                                                {game.state?.player1Color === 'white' ? game.state?.player1Name : game.state?.player2Name}
                                            </span>
                                            <span className="vs-badge">VS</span>
                                            <span className="player-badge black">
                                                {game.state?.player1Color === 'black' ? game.state?.player1Name : game.state?.player2Name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="saved-game-actions">
                                        <button
                                            className="load-game-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLoadGame(game.id);
                                            }}
                                            title="Cargar partida"
                                        >
                                            ▶️
                                        </button>
                                        <button
                                            className="delete-game-button"
                                            onClick={(e) => handleDeleteGame(game.id, e)}
                                            title="Eliminar partida"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </>
        );

        // Renderizar el modal usando Portal directamente en el body
        return createPortal(modalContent, document.body);
    }

    // Modo normal (no compacto) - para cuando estaba en el panel derecho
    if (!isOpen) {
        return (
            <div className="saved-games-toggle">
                <button 
                    className="saved-games-toggle-button"
                    onClick={() => setIsOpen(true)}
                    title="Ver partidas guardadas"
                >
                    📁 Partidas Guardadas ({savedGames.length})
                </button>
            </div>
        );
    }

    return (
        <div className="saved-games-panel">
            <div className="saved-games-header">
                <div className="saved-games-title-container">
                    <span className="folder-icon">📁</span>
                    <h3 className="saved-games-title">Partidas Guardadas</h3>
                </div>
                <button 
                    className="close-panel-button"
                    onClick={() => setIsOpen(false)}
                    title="Cerrar panel"
                >
                    ✕
                </button>
            </div>

            <div className="saved-games-list">
                {savedGames.length === 0 ? (
                    <div className="empty-saved-games">
                        <p>No hay partidas guardadas</p>
                        <p className="empty-hint">Guarda una partida usando el botón "💾 Guardar Partida"</p>
                    </div>
                ) : (
                    savedGames.map((game) => (
                        <div 
                            key={game.id} 
                            className={`saved-game-item ${currentGameId === game.id ? 'current-game' : ''}`}
                            onClick={() => handleLoadGame(game.id)}
                        >
                            <div className="saved-game-info">
                                <div className="saved-game-name">{game.name}</div>
                                <div className="saved-game-meta">
                                    <span className="saved-game-date">
                                        {formatDate(game.lastPlayed)}
                                    </span>
                                    <span className="saved-game-moves">
                                        {game.state?.gameHistory?.length || 0} movimientos
                                    </span>
                                </div>
                                <div className="saved-game-players">
                                    <span className="player-badge white">
                                        {game.state?.player1Color === 'white' ? game.state?.player1Name : game.state?.player2Name}
                                    </span>
                                    <span className="vs-badge">VS</span>
                                    <span className="player-badge black">
                                        {game.state?.player1Color === 'black' ? game.state?.player1Name : game.state?.player2Name}
                                    </span>
                                </div>
                            </div>
                            <div className="saved-game-actions">
                                <button
                                    className="load-game-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLoadGame(game.id);
                                    }}
                                    title="Cargar partida"
                                >
                                    ▶️
                                </button>
                                <button
                                    className="delete-game-button"
                                    onClick={(e) => handleDeleteGame(game.id, e)}
                                    title="Eliminar partida"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
