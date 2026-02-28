import React, { useState } from "react";
import Home from "./Home";
import Game from "./Game";

function App() {
  const [screen, setScreen] = useState("home");

  return (
    <>
      {screen === "home" && (
        <Home onPlay={() => setScreen("game")} />
      )}

      {screen === "game" && (
        <Game onBack={() => setScreen("home")} />
      )}
    </>
  );
}

export default App;
