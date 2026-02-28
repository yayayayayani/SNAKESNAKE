import React, { useEffect, useState, useRef, useCallback } from "react";
import fondo from './assets/FONDO.png';

const GRID_SIZE = 20;
const SPEED = 150;

export default function Game({ onBack }) {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(generateFood());
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);

  const directionRef = useRef(direction);
  const moveQueueRef = useRef([]);

  function generateFood() {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      if (moveQueueRef.current.length > 0) {
        const nextDir = moveQueueRef.current.shift();
        setDirection(nextDir);
        directionRef.current = nextDir;
      }

      head.x += directionRef.current.x;
      head.y += directionRef.current.y;

      // Colisiones
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= GRID_SIZE ||
        head.y >= GRID_SIZE ||
        newSnake.some((seg) => seg.x === head.x && seg.y === head.y)
      ) {
        setGameOver(true);
        fetch("http://localhost:5000/save-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: prevSnake.length - 1 }),
        }).catch((err) =>
          console.log("Error guardando score:", err)
        );
        return prevSnake;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, SPEED);

    return () => clearInterval(interval);
  }, [moveSnake, gameOver]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    moveQueueRef.current = [];
    setGameOver(false);
  };

  useEffect(() => {
    const handleKey = (e) => {
      const lastDir =
        moveQueueRef.current.length > 0
          ? moveQueueRef.current[moveQueueRef.current.length - 1]
          : directionRef.current;

      let nextMove = null;

      switch (e.key) {
        case "ArrowUp":
          if (lastDir.y === 0) nextMove = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (lastDir.y === 0) nextMove = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (lastDir.x === 0) nextMove = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (lastDir.x === 0) nextMove = { x: 1, y: 0 };
          break;
        default:
          break;
      }

      if (nextMove && moveQueueRef.current.length < 2) {
        moveQueueRef.current.push(nextMove);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      style={{
        height: "95vh",
        textAlign: "center",
        fontFamily: "'Press Start 2P'",
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
      }}
    >
      <h2>Score: {snake.length - 1}</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
          justifyContent: "center",
          backgroundColor: "#42941c",
          
        }}
      >
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnake = snake.some(
            (seg) => seg.x === x && seg.y === y
          );
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              style={{
                width: 20,
                height: 20,
                backgroundColor: isSnake
                  ? "green"
                  : isFood
                  ? "red"
                  : "#eee",
                border: "0.1px solid #ddd",
              }}
            />
          );
        })}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={onBack}
          style={{ 
            marginRight: "20px", 
            fontSize: "14px",
            padding: "10px",
            borderRadius: "15px",
            border: "none",
            cursor: "pointer",
            color: "black",
            fontFamily: "'Press Start 2P'"  
           }}
        >
          ⬅ Volver al inicio
        </button>
        <button
          onClick={resetGame}
          style={{
            fontSize: "15px",
            padding: "10px",
            borderRadius: "15px",
            border: "none",
            cursor: "pointer",
            color: "black",
            fontFamily: "'Press Start 2P'"
           }}
        >
          Reintentar
        </button>
      </div>

      {gameOver && (
        <h1 style={{ color: "red", fontSize: "40px" }}>
          GAME OVER
        </h1>
      )}
    </div>
  );
}