import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ColorSelectScreen from "./ColorSelectScreen";
import GameScreen from "./GameScreen";
import "./App.css";

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

