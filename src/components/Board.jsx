import React, { useState, useEffect } from "react";
import Cell from "./Cell";
const Board = (props) => {
  const { sizeX, sizeY, minesCount } = props;
  const [minesBoard, setMinesBoard] = useState([]);
  const CELL_INIT_STATE = {
    isMine: false,
    isClicked: false,
    neighbourMines: 0
  };

  const generateMines = (newMinesBoard) => {
    let i = minesCount;
    let security = 100;
    do {
      const randX = Math.floor(Math.random() * sizeX);
      const randY = Math.floor(Math.random() * sizeY);

      if (!newMinesBoard[randY][randX].isMine) {
        newMinesBoard[randY][randX].isMine = true;
        i--;
      }
      security -= 1;
      if (security === 0) {
        throw Error("SECURYTY!!!");
      }
    } while (i > 0);
    return newMinesBoard;
  };

  const calculateNeighbourMines = (newMinesBoard) => {
    for (let i = 0; i < sizeX; i++) {
      for (let j = 0; j < sizeY; j++) {
        let countNeighbourMines = 0;
        if (!newMinesBoard[j][i].isMine) {
          for (let checkX = i - 1; checkX < i + 2; checkX++) {
            for (let checkY = j - 1; checkY < j + 2; checkY++) {
              if (
                checkX >= 0 &&
                checkX < sizeX &&
                checkY >= 0 &&
                checkY < sizeY &&
                (checkX !== i || checkY !== j) &&
                newMinesBoard[checkY][checkX].isMine
              ) {
                countNeighbourMines++;
              }
            }
          }
        }
        newMinesBoard[j][i].neighbourMines = countNeighbourMines;
      }
    }
    return newMinesBoard;
  };

  const genericBoardCreation = () =>
    Array.from({ length: +sizeY }, () =>
      Array.from({ length: +sizeX }, () => Object.create(CELL_INIT_STATE))
    );

  const createMinesBoard = () => {
    let newMinesBoard = genericBoardCreation();
    newMinesBoard = generateMines(newMinesBoard);
    newMinesBoard = calculateNeighbourMines(newMinesBoard);
    console.log(newMinesBoard);
    setMinesBoard(newMinesBoard);
  };

  useEffect(() => {
    createMinesBoard();
  }, []);

  let t = [];

  return (
    <>{minesBoard.map((row) => row.map((cell) => <Cell cellstate={cell} />))}</>
  );
};

export default Board;
