import React, { useReducer, useEffect } from 'react';
import Board from "./Board.jsx";
import Start from "./Start.jsx";
import Restart from "./Restart.jsx";
import reducer from "./reducer.js";
import "./appstyles.css";

const emptyArray = new Array(100);
const initialState = {
	status: "start",
	knightPosition: [0, 0],
	movesField: emptyArray,
	moveCount: 1
}

export default function Knight100Game() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const {gameStatus, knightPosition, movesField, moveCount} = state;

	useEffect(() => {
		if (moveCount === 100) {
			dispatch({ type: "WIN" })
		} else if (cantMove()) {
			dispatch({ type: "LOST" })
		};
	}, [knightPosition]);

	const restartGame = () => {
		dispatch({ type: "START_GAME" });
	}

	const canKnightMove = (ToX, ToY) => {
		if (movesField[getSquareIndex([ToX, ToY])] > 0) return false; // if field already used
		const difX = Math.abs(ToX - knightPosition[0]);
		const difY = Math.abs(ToY - knightPosition[1]);
		return (difX === 2 && difY === 1) || (difX === 1 && difY === 2);
	}
  
	const getSquareIndex = ([x, y]) => (x + y * 10);

	const cantMove = () => {
		let possiblemoves = 0;
		for (let i=0; i<100; i++) {
			const x = i % 10;
			const y = Math.floor(i / 10);
			if (canKnightMove(x, y)) {possiblemoves++};
		}
		return possiblemoves === 0; //can't move if 0 squares to move
	}

	const moveKnight = (ToX, ToY) => {
		if (canKnightMove(ToX, ToY)) {
			dispatch({ 
				type: "MOVE_KNIGHT",
				payload: [ToX, ToY]})
		}
		return true;
	}

	return (
		<div id="knight100-container">
			{state.status === "start" && <Start startGame={restartGame}/>}
			{state.status !== "start" && <Board knightPosition={knightPosition} moveKnight={moveKnight} movesField={movesField} /> }
			{state.status === "win" && <h1 className="win">Вы победили!!!</h1>}
			{state.status === "lost" && <h1 className="lost">Вы проиграли!!!</h1>}
			{state.status !== "start" && <Restart restart={restartGame} />}
		</div>
	)
}