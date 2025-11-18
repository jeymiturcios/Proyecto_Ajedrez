import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ColorSelectScreen.css';

export default function ColorSelectScreen() {
    const [player1Name, setPlayer1Name] = useState('');
    const [player2Name, setPlayer2Name] = useState('');
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

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
                <p className="subtitle">Ingresa los nombres y elige el color</p>
            </div>

            <div className="names-container">
                <div className="name-input-group">
                    <label className="name-label">Jugador 1</label>
                    <input
                        type="text"
                        className="name-input"
                        placeholder="Ingresa tu nombre"
                        value={player1Name}
                        onChange={(e) => setPlayer1Name(e.target.value)}
                        maxLength={20}
                    />
                </div>

                <div className="name-input-group">
                    <label className="name-label">Jugador 2</label>
                    <input
                        type="text"
                        className="name-input"
                        placeholder="Ingresa tu nombre"
                        value={player2Name}
                        onChange={(e) => setPlayer2Name(e.target.value)}
                        maxLength={20}
                    />
                </div>
            </div>

            <div className="color-selection-section">
                <p className="color-label">{player1Name || "Jugador 1"}, elige tu color</p>
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
        