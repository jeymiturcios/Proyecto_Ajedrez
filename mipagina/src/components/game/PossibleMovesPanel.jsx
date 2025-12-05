import React from 'react';
import '../../styles/GameScreen.css';

export default function PossibleMovesPanel({ selectedPiece, validMoves, board, onMoveClick }) {
    // Convertir coordenadas de fila/columna a notación de ajedrez
    const toChessNotation = (row, col) => {
        const file = String.fromCharCode(97 + col); // a-h
        const rank = 8 - row; // 1-8
        return `${file}${rank}`;
    };

    // Convertir notación de ajedrez a coordenadas de fila/columna
    const fromChessNotation = (notation) => {
        if (!notation || notation.length !== 2) return null;
        const file = notation[0].toLowerCase();
        const rank = parseInt(notation[1]);
        if (file < 'a' || file > 'h' || rank < 1 || rank > 8) return null;
        const col = file.charCodeAt(0) - 97;
        const row = 8 - rank;
        return { row, col };
    };

    // Obtener información de la pieza seleccionada
    const getPieceInfo = () => {
        if (!selectedPiece || !board[selectedPiece.row] || !board[selectedPiece.row][selectedPiece.col]) {
            return null;
        }
        const square = board[selectedPiece.row][selectedPiece.col];
        return square.piece;
    };

    const piece = getPieceInfo();

    if (!piece || !validMoves || validMoves.length === 0) {
        return null;
    }

    // Manejar clic en un movimiento
    const handleMoveClick = (move) => {
        if (onMoveClick && selectedPiece) {
            onMoveClick(selectedPiece.row, selectedPiece.col, move.row, move.col);
        }
    };

    return (
        <div className="possible-moves-section">
            <div className="possible-moves-header">
                <span className="tree-icon">🌳</span>
                <h3 className="possible-moves-title">Movimientos Posibles</h3>
            </div>
            
            <div className="piece-info">
                <span className="piece-label">Pieza:</span>
                <span className="piece-icon">{piece.getSymbol()}</span>
            </div>

            <div className="moves-list">
                {validMoves.map((move, index) => {
                    const notation = toChessNotation(move.row, move.col);
                    return (
                        <div 
                            key={index} 
                            className="move-option"
                            onClick={() => handleMoveClick(move)}
                        >
                            <span className="move-arrow">→</span>
                            <span className="move-notation">{notation}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
