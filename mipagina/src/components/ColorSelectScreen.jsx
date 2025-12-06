/**
 * Componente de pantalla de selección de color y configuración de jugadores
 * @module ColorSelectScreen
 * @description Permite a los jugadores ingresar sus nombres y elegir el color de las piezas.
 *              El jugador 1 elige su color y el jugador 2 recibe el color opuesto automáticamente.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ColorSelectScreen.css';

/**
 * Componente de selección de color para los jugadores
 * @function ColorSelectScreen
 * @returns {JSX.Element} Componente de configuración inicial del juego
 */
export default function ColorSelectScreen() {
    const [player1Name, setPlayer1Name] = useState('');
    const [player2Name, setPlayer2Name] = useState('');
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

    const player2Color = selected === "white" ? "black" : selected === "black" ? "white" : null;
    
    // Determinar si el color ya fue elegido (simula que alguien ya eligió)
    // En una implementación real, esto vendría de un servidor/backend
    const colorAlreadySelected = selected !== null;

    const handleContinue = () => {
        if (!selected || !player1Name.trim() || !player2Name.trim()) return;
        navigate("/game", { 
            state: { 
                player1Color: selected,
                player1Name: player1Name.trim(),
                player2Name: player2Name.trim()
            } 
        });
    };

    const canContinue = selected && player1Name.trim() && player2Name.trim();

    return (
        <div className="container">
            <div className="header">
                <div className="chess-icon">♔</div>
                <h1 className="title">Configuración del Juego</h1>
                <p className="subtitle">
                    Ingresa tu nombre {!colorAlreadySelected && "y elige tu color"}
                </p>
            </div>

            <div className="setup-content">
                <div className="player-section">
                    <div className="player-card-setup">
                        <div className="player-header">
                            <span className="player-number">Jugador 1</span>
                            {player1Name.trim() && (
                                <span className="player-name-display">{player1Name.trim()}</span>
                            )}
                            <span className="player-role">
                                {colorAlreadySelected ? "Color elegido" : "Elige tu color"}
                            </span>
                        </div>
                        <div className="name-input-group">
                            <label className="name-label">Nombre</label>
                            <input
                                type="text"
                                className="name-input"
                                placeholder="Ingresa tu nombre"
                                value={player1Name}
                                onChange={(e) => setPlayer1Name(e.target.value)}
                                maxLength={20}
                            />
                        </div>
                        <div className="color-selection-section">
                            {!colorAlreadySelected ? (
                                <div className="options-container">
                                    <button
                                        className={`option option-white ${selected === "white" ? "selected" : ""}`}
                                        onClick={() => setSelected("white")}
                                    >
                                        <div className="option-content">
                                            <div className="chess-piece">♔</div>
                                            <span className="optionText">Blancas</span>
                                            <div className="check-icon">{selected === "white" ? "✓" : ""}</div>
                                        </div>
                                    </button>

                                    <button
                                        className={`option option-black ${selected === "black" ? "selected" : ""}`}
                                        onClick={() => setSelected("black")}
                                    >
                                        <div className="option-content">
                                            <div className="chess-piece">♚</div>
                                            <span className="optionText">Negras</span>
                                            <div className="check-icon">{selected === "black" ? "✓" : ""}</div>
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <div className={`assigned-color ${selected === "white" ? "assigned-white" : "assigned-black"}`}>
                                    <div className="assigned-color-content">
                                        <div className="chess-piece">{selected === "white" ? "♔" : "♚"}</div>
                                        <span className="assigned-color-text">
                                            {selected === "white" ? "Blancas" : "Negras"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="vs-divider-setup">
                        <span>VS</span>
                    </div>

                    <div className="player-card-setup player-2-card">
                        <div className="player-header">
                            <span className="player-number">Jugador 2</span>
                            {player2Name.trim() && (
                                <span className="player-name-display">{player2Name.trim()}</span>
                            )}
                            <span className="player-role">
                                {colorAlreadySelected ? "Color asignado" : "Color asignado automáticamente"}
                            </span>
                        </div>
                        <div className="name-input-group">
                            <label className="name-label">Nombre</label>
                            <input
                                type="text"
                                className="name-input"
                                placeholder="Ingresa tu nombre"
                                value={player2Name}
                                onChange={(e) => setPlayer2Name(e.target.value)}
                                maxLength={20}
                            />
                        </div>
                        <div className="assigned-color-section">
                            {selected ? (
                                <div className={`assigned-color ${player2Color === "white" ? "assigned-white" : "assigned-black"}`}>
                                    <div className="assigned-color-content">
                                        <div className="chess-piece">{player2Color === "white" ? "♔" : "♚"}</div>
                                        <span className="assigned-color-text">
                                            {player2Color === "white" ? "Blancas" : "Negras"}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="assigned-color-placeholder">
                                    <span>Elige un color primero</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <button
                className={`continue-button ${!canContinue ? "disabled" : ""}`}
                disabled={!canContinue}
                onClick={handleContinue}
            >
                <span className="buttonText">Comenzar Juego</span>
                <span className="arrow">→</span>
            </button>
        </div>
    );
}
        