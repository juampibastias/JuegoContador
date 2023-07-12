import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { TypeAnimation } from "react-type-animation";
import soundGameOver from "./sounds/JeepChrkeHornHonkS_PE894406.wav";
import soundHighScore from "./sounds/we_ak47s_lb_04_hpx.wav";

const App = () => {
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameStatus, setGameStatus] = useState("");

  const scoreRef = useRef(0);
  const maxScoreRef = useRef(0);

  const handleClick = () => {
    if (isRunning) {
      setScore(score + 1);
      scoreRef.current = scoreRef.current + 1;
    }
  };

  const startGame = () => {
    setIsRunning(true);
    setScore(0);
    setGameStatus("preparados");

    setTimeout(() => {
      setGameStatus("listos");

      setTimeout(() => {
        setGameStatus("ya");
        setCountdown(5);

        setTimeout(() => {
          setIsRunning(false);
          if (scoreRef.current > maxScoreRef.current) {
            setMaxScore(scoreRef.current);
            maxScoreRef.current = scoreRef.current;
            audioHighScoreRef.current.play(); // Reproduce el sonido de puntaje máximo
          } else {
            audioGameOverRef.current.play(); // Reproduce el sonido de juego terminado sin puntaje máximo
          }
          setGameStatus("terminado");
        }, 5000);
      }, 1000);
    }, 1000);
  };

  const resetGame = () => {
    setScore(0);
    setGameStatus("");
    scoreRef.current = 0;
  };

  useEffect(() => {
    let timer = null;

    if (isRunning && gameStatus === "ya") {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
      } else {
        setIsRunning(false);
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, [countdown, isRunning, gameStatus]);

  // Crea referencias para los elementos de audio
  const audioGameOverRef = useRef(null);
  const audioHighScoreRef = useRef(null);

  return (
    <div className="App">
      <TypeAnimation
      className="title"
        sequence={[
          // Same substring at the start will only be typed out once, initially
          "Counter",
          1000, // wait 1s before replacing "Mice" with "Hamsters"
          "CounterArg",
          1000,
          "CounterArg Juego",
          1000,
        ]}
        wrapper="span"
        speed={50}
        style={{ fontSize: "4em", display: "inline-block" }}
        repeat={Infinity}
      />
      <h2>Puntaje máximo: {maxScore}</h2>
      {!isRunning ? (
        <>
          {gameStatus === "" && <button onClick={startGame}>Iniciar</button>}
          {gameStatus === "terminado" && (
            <>
              <p>Clicks: {score}</p>
              <h2>Puntaje máximo: {maxScoreRef.current}</h2>
              <button id="reset-button" onClick={resetGame}>
                Volver a jugar
              </button>
            </>
          )}
        </>
      ) : (
        <>
          {gameStatus === "preparados" && (
            <p className="game-status">Preparados</p>
          )}
          {gameStatus === "listos" && <p className="game-status">Listos</p>}
          {gameStatus === "ya" && (
            <>
              <h3>Tiempo restante: {countdown}</h3>
              <button onClick={handleClick}>Clickear</button>
              <p>Puntaje actual: {score}</p>
            </>
          )}
        </>
      )}

      {/* Agrega elementos de audio ocultos */}
      <audio ref={audioGameOverRef} src={soundGameOver} />
      <audio ref={audioHighScoreRef} src={soundHighScore} />
    </div>
  );
};

export default App;
