import React, { useEffect, useRef } from 'react';
import '../../styles/GameScreen.css';

export default function HistoryPanel({ gameHistory, boardSectionRef }) {
    const historySectionRef = useRef(null);
    
    // Efecto para igualar la altura del historial con el tablero
    useEffect(() => {
        // Ocultar el historial inicialmente
        if (historySectionRef.current) {
            historySectionRef.current.style.opacity = '0';
            historySectionRef.current.style.visibility = 'hidden';
        }
        
        // Función que establece la altura y posición de forma permanente
        const setFixedDimensions = () => {
            if (!boardSectionRef.current || !historySectionRef.current) return false;
            
            // Verificar que ambos elementos tengan dimensiones válidas
            const boardHeight = boardSectionRef.current.offsetHeight;
            if (boardHeight === 0) return false; // Aún no está renderizado
            
            const boardSectionTop = boardSectionRef.current.getBoundingClientRect().top;
            const historyTop = historySectionRef.current.getBoundingClientRect().top;
            const offset = boardSectionTop - historyTop;
            
            // Establecer altura fija usando CSS variables para que sea más robusto
            historySectionRef.current.style.setProperty('--history-height', `${boardHeight}px`);
            historySectionRef.current.style.setProperty('height', `${boardHeight}px`, 'important');
            historySectionRef.current.style.setProperty('min-height', `${boardHeight}px`, 'important');
            historySectionRef.current.style.setProperty('max-height', `${boardHeight}px`, 'important');
            
            // Ajustar el margin-top para alinear verticalmente con el tablero
            if (Math.abs(offset) > 2) {
                historySectionRef.current.style.setProperty('margin-top', `${offset}px`, 'important');
            } else {
                historySectionRef.current.style.setProperty('margin-top', '0px', 'important');
            }
            
            // Marcar como fijo para prevenir futuros cambios
            historySectionRef.current.setAttribute('data-fixed', 'true');
            
            return true;
        };
        
        // Intentar establecer las dimensiones múltiples veces hasta que funcione
        let attempts = 0;
        const maxAttempts = 30;
        let isPositioned = false;
        
        const trySetDimensions = () => {
            if (isPositioned) return; // Ya está posicionado, no hacer nada más
            
            attempts++;
            const success = setFixedDimensions();
            
            if (success) {
                isPositioned = true;
                // Esperar un frame adicional antes de mostrar para asegurar que todo está estable
                requestAnimationFrame(() => {
                    if (historySectionRef.current) {
                        historySectionRef.current.style.opacity = '1';
                        historySectionRef.current.style.visibility = 'visible';
                        historySectionRef.current.style.transition = 'none';
                    }
                });
            } else if (attempts < maxAttempts) {
                // Si no funcionó, intentar de nuevo en el siguiente frame
                requestAnimationFrame(trySetDimensions);
            } else {
                // Si después de muchos intentos no funciona, mostrar de todas formas
                if (historySectionRef.current) {
                    historySectionRef.current.style.opacity = '1';
                    historySectionRef.current.style.visibility = 'visible';
                    historySectionRef.current.style.transition = 'none';
                    isPositioned = true;
                }
            }
        };
        
        // Esperar a que el DOM esté completamente listo
        const initialTimeout = setTimeout(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        trySetDimensions();
                    });
                });
            });
        }, 100);
        
        // Manejar cambios de tamaño de ventana
        const handleResize = () => {
            if (boardSectionRef.current && historySectionRef.current && historySectionRef.current.getAttribute('data-fixed') === 'true') {
                const boardHeight = boardSectionRef.current.offsetHeight;
                if (boardHeight > 0) {
                    historySectionRef.current.style.setProperty('--history-height', `${boardHeight}px`);
                    historySectionRef.current.style.setProperty('height', `${boardHeight}px`, 'important');
                    historySectionRef.current.style.setProperty('min-height', `${boardHeight}px`, 'important');
                    historySectionRef.current.style.setProperty('max-height', `${boardHeight}px`, 'important');
                }
            }
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            clearTimeout(initialTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [boardSectionRef]);

    return (
        <div className="history-section" ref={historySectionRef}>
            <h2 className="history-title">Historial</h2>
            <div className="history-list">
                {gameHistory.length === 0 ? (
                    <p className="empty-history">Sin movimientos</p>
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
    );
}
