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
        for (let x = 0; x < sizeX; x++) {
            for (let y = 0; y < sizeY; y++) {
                let countNeighbourMines = 0;
                if (!newMinesBoard[x][y].isMine) {
                    for (let checkY = y - 1; checkY < y + 2; checkY++) {
                        for (let checkX = x - 1; checkX < x + 2; checkX++) {
                            if (
                                checkX >= 0 &&
                                checkX < sizeX &&
                                checkY >= 0 &&
                                checkY < sizeY &&
                                (checkX !== x || checkY !== y) &&
                                newMinesBoard[checkX][checkY].isMine
                            ) {
                                countNeighbourMines++;
                            }
                        }
                    }
                }
                newMinesBoard[x][y].neighbourMines = countNeighbourMines;
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

    const handleMouseUp = (e, cell) => {
        if (e.button === 0) {
            const board = [...minesBoard];
            const {x,y} = cell;
            console.log(x,y);
            const clickedCell = board[x][y];
            clickedCell.isClicked = true;
            setMinesBoard(board);
        }
        // right click
        if (e.button === 2) {
            console.log('R')
        }
    }

    const handleContextMenu = e => {
        e.preventDefault();
    }

    const boardBody = minesBoard.map((column) =>
        <div className='column'>{column.map((cell) =>
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
