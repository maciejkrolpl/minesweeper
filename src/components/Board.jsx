import React, {useState, useEffect, useRef} from "react";
import Cell from "./Cell";

const Board = (props) => {
    const {sizeX, sizeY, minesCount} = props;
    const [minesBoard, setMinesBoard] = useState([]);
    const [isGameOver, setIsGameOver] = useState(false);
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

            if (!newMinesBoard[randX][randY].isMine) {
                newMinesBoard[randX][randY].isMine = true;
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
        for (let i = 0; i < sizeY; i++) {
            for (let j = 0; j < sizeX; j++) {
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
        Array.from({length: +sizeX}, (_, x) =>
            Array.from({length: +sizeY}, (_, y) => ({x, y}))
        );

    const createMinesBoard = () => {
        let newMinesBoard = genericBoardCreation();
        newMinesBoard = generateMines(newMinesBoard);
        newMinesBoard = calculateNeighbourMines(newMinesBoard);
        setMinesBoard(newMinesBoard);
    };

    useEffect(() => {
        createMinesBoard();
    }, []);

    const handleCellClick = (event, cell) => {
        event.preventDefault();
        if (isGameOver) {
            return;
        }
        console.log(event.buttons);
    }

    const handleMouseUp = (e, cell) => {
        if (e.button === 0) {
            console.log(cell);
        }
        // right click
        if (e.button === 2) {
            console.log('R')
        }
    }

    const handleContextMenu = e => {
        e.preventDefault();
    }

    const boardBody = minesBoard.map((row) =>
        <div className='row'>{row.map((cell) =>
            <Cell cellstate={cell}
                  onMouseUp={(e) => handleMouseUp(e, cell)}
                  onContextMenu={handleContextMenu}
            />
        )}
        </div>
    );

    return (
        <div className='board'>
            {boardBody}
        </div>
    );
};

export default Board;
