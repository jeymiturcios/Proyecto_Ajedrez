/**
 * Gestor de almacenamiento local usando LocalStorage
 * @module StorageManager
 * @description Módulo que gestiona el almacenamiento persistente del juego usando LocalStorage.
 * 
 * LocalStorage es ideal para este proyecto porque:
 * - Los datos del juego no son extremadamente grandes
 * - Es más simple de implementar y mantener
 * - Es suficiente para guardar partidas en progreso
 * - No necesitamos búsquedas complejas
 * 
 * Si en el futuro necesitas:
 * - Guardar cientos de partidas
 * - Búsquedas complejas por fecha, jugador, etc.
 * - Datos binarios grandes
 * Entonces IndexedDB sería mejor opción
 */

const STORAGE_KEYS = {
    CURRENT_GAME: 'chess_current_game',
    SAVED_GAMES: 'chess_saved_games',
    GAME_SETTINGS: 'chess_game_settings',
    GAME_STATISTICS: 'chess_statistics'
};

/**
 * Serializar el estado del juego para guardarlo
 */
function serializeGameState(game) {
    const board = game.getBoard();
    const serializedBoard = board.map(row => 
        row.map(square => ({
            piece: square.piece ? {
                type: square.piece.type,
                color: square.piece.color,
                position: square.piece.position,
                hasMoved: square.piece.hasMoved
            } : null
        }))
    );

    return {
        player1Color: game.player1Color,
        player1Name: game.player1Name,
        player2Name: game.player2Name,
        currentTurn: game.getCurrentTurn(),
        board: serializedBoard,
        gameHistory: game.getHistory(),
        capturedPieces: game.getCapturedPieces(),
        undoStack: game.undoStack.map(move => ({
            from: {
                row: move.from.row,
                col: move.from.col,
                piece: move.from.piece ? {
                    type: move.from.piece.type,
                    color: move.from.piece.color,
                    position: move.from.piece.position,
                    hasMoved: move.from.piece.hasMoved
                } : null
            },
            to: {
                row: move.to.row,
                col: move.to.col,
                piece: move.to.piece ? {
                    type: move.to.piece.type,
                    color: move.to.piece.color,
                    position: move.to.piece.position,
                    hasMoved: move.to.piece.hasMoved
                } : null
            },
            turn: move.turn,
            capturedPiece: move.capturedPiece ? {
                type: move.capturedPiece.type,
                color: move.capturedPiece.color,
                position: move.capturedPiece.position,
                hasMoved: move.capturedPiece.hasMoved
            } : null,
            capturedPieces: move.capturedPieces
        })),
        timestamp: new Date().toISOString()
    };
}

/**
 * Deserializar el estado del juego desde LocalStorage
 * Retorna el estado listo para ser usado por ChessGame.restoreFromState()
 */
function deserializeGameState(serializedState) {
    // El estado ya está en formato JSON, solo necesita ser pasado a ChessGame
    return serializedState;
}

/**
 * Guardar la partida actual en LocalStorage
 */
export function saveCurrentGame(game) {
    try {
        const gameState = serializeGameState(game);
        localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(gameState));
        return true;
    } catch (error) {
        console.error('Error al guardar la partida actual:', error);
        return false;
    }
}

/**
 * Cargar la partida actual desde LocalStorage
 */
export function loadCurrentGame() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
        if (!saved) return null;
        
        const gameState = JSON.parse(saved);
        return deserializeGameState(gameState);
    } catch (error) {
        console.error('Error al cargar la partida actual:', error);
        return null;
    }
}

/**
 * Eliminar la partida actual guardada
 */
export function clearCurrentGame() {
    try {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
        return true;
    } catch (error) {
        console.error('Error al eliminar la partida actual:', error);
        return false;
    }
}

/**
 * Guardar una partida con un nombre personalizado
 */
export function saveGame(game, gameName) {
    try {
        const gameState = serializeGameState(game);
        const savedGames = getSavedGames();
        
        const gameData = {
            id: Date.now().toString(),
            name: gameName || `Partida ${new Date().toLocaleString()}`,
            state: gameState,
            createdAt: new Date().toISOString(),
            lastPlayed: new Date().toISOString()
        };
        
        savedGames.push(gameData);
        localStorage.setItem(STORAGE_KEYS.SAVED_GAMES, JSON.stringify(savedGames));
        return gameData.id;
    } catch (error) {
        console.error('Error al guardar la partida:', error);
        return null;
    }
}

/**
 * Obtener todas las partidas guardadas
 */
export function getSavedGames() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.SAVED_GAMES);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error al obtener partidas guardadas:', error);
        return [];
    }
}

/**
 * Cargar una partida guardada por ID
 */
export function loadSavedGame(gameId) {
    try {
        const savedGames = getSavedGames();
        const game = savedGames.find(g => g.id === gameId);
        
        if (game) {
            // Actualizar última vez jugada
            game.lastPlayed = new Date().toISOString();
            localStorage.setItem(STORAGE_KEYS.SAVED_GAMES, JSON.stringify(savedGames));
            return deserializeGameState(game.state);
        }
        
        return null;
    } catch (error) {
        console.error('Error al cargar la partida guardada:', error);
        return null;
    }
}

/**
 * Eliminar una partida guardada
 */
export function deleteSavedGame(gameId) {
    try {
        const savedGames = getSavedGames();
        const filtered = savedGames.filter(g => g.id !== gameId);
        localStorage.setItem(STORAGE_KEYS.SAVED_GAMES, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error al eliminar la partida:', error);
        return false;
    }
}

/**
 * Guardar configuración del juego
 */
export function saveGameSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error al guardar configuración:', error);
        return false;
    }
}

/**
 * Cargar configuración del juego
 */
export function loadGameSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error al cargar configuración:', error);
        return null;
    }
}

/**
 * Guardar estadísticas del juego
 */
export function saveStatistics(stats) {
    try {
        localStorage.setItem(STORAGE_KEYS.GAME_STATISTICS, JSON.stringify(stats));
        return true;
    } catch (error) {
        console.error('Error al guardar estadísticas:', error);
        return false;
    }
}

/**
 * Cargar estadísticas del juego
 */
export function loadStatistics() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.GAME_STATISTICS);
        return saved ? JSON.parse(saved) : {
            totalGames: 0,
            wins: { white: 0, black: 0 },
            draws: 0,
            averageMoves: 0
        };
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        return {
            totalGames: 0,
            wins: { white: 0, black: 0 },
            draws: 0,
            averageMoves: 0
        };
    }
}

/**
 * Verificar si LocalStorage está disponible
 */
export function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}
