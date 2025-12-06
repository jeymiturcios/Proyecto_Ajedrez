/**
 * Componente principal de la aplicación de Ajedrez
 * @module App
 * @description Componente raíz que maneja el enrutamiento de la aplicación usando React Router.
 *              Define las rutas principales: pantalla de selección de color y pantalla de juego.
 */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ColorSelectScreen from "./components/ColorSelectScreen";
import GameScreen from "./components/game/GameScreen";
import "./styles/App.css";

/**
 * Componente principal de la aplicación
 * @function App
 * @returns {JSX.Element} Componente de la aplicación con enrutamiento
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ColorSelectScreen />} />
          <Route path="/game" element={<GameScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

