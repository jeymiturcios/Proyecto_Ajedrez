import React, { useState, useEffect, useRef } from 'react';
import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import './GameScreen.css';

export default function GameScreen() {
    const location = useLocation();
    const player1Color = location.state?.player1Color || "white";
    const player1Name = location.state?.player1Name || "Jugador 1";
    const player2Name = location.state?.player2Name || "Jugador 2";
    const player2Color = player1Color === "white" ? "black" : "white";
    const [turn, setTurn] = useState("white");

    return (
        <div className="game-container">
            <div className="game-header">
                <div className="game-icon">♟️</div>
                <h1 className="game-title">Juego de Ajedrez</h1>
            </div>
            
            <div className="game-info">
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
    );
}