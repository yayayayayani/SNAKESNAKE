import React from "react";
import useSound from 'use-sound';
import clickSonido from './assets/button.mp3';
import fondo from './assets/FONDO.png';


export default function Home({ onPlay }) {

  const [play] = useSound(clickSonido);

  const handlePlayclick = () => {
    play();
    onPlay();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>SnakeSnake</h1>

      <button style={styles.button} onClick={handlePlayclick}>
        ▶ PLAY
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundImage: `url(${fondo})`,
    backgroundSize: "cover",
    brackgoundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: "60px",
    color: "white",
    WebkitTextStroke: "2px black",
    marginBottom: "40px",
    fontFamily: "'Press Start 2P'"
  },
  button: {
    fontSize: "20px",
    padding: "20px 60px",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer",
    color: "black",
    fontFamily: "'Press Start 2P'"
  },
};
