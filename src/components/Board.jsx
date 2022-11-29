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
                                isFieldInBoard(checkX, checkY) &&
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

    const isFieldInBoard = (x, y) => x >= 0 && x < sizeX && y >= 0 && y < sizeY;
    const isMine = (x, y) => minesBoard[x][y].isMine;
    const isClicked = (x, y) => minesBoard[x][y].isClicked;
    const neighbourMines = (x, y) => minesBoard[x][y].neighbourMines;

    const getFieldsNeighbours = (x, y) => [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y - 1],
        [x, y + 1],
        [x + 1, y - 1],
        [x + 1, y],
        [x + 1, y + 1],
    ].filter(([x, y]) => isFieldInBoard(x, y));

    const floodFill = (x, y) => {
        const board = [...minesBoard];
        board[x][y].isClicked = true;
        setMinesBoard(board);
        if (board[x][y].neighbourMines !== 0) {
            return;
        }
        const toFill = getFieldsNeighbours(x, y)
            .filter(([x, y]) => !isMine(x, y) && !isClicked(x, y))
        toFill.forEach(([x, y]) => floodFill(x, y))
    }

    const leftClickOnField = (x, y) => {
        console.log('click', x, y)
        if (isGameOver) {
            return;
        }

        const board = [...minesBoard];
        const {isMine, isClicked, isFlagged} = board[x][y];
        if (isMine) {
            alert('Game Over');
            setIsGameOver(true);

        }
        if (isClicked || isFlagged) {
            return;
        }
        board[x][y].isClicked = true;
        setMinesBoard(board);
        floodFill(x, y);
    }

    const handleMouseUp = (e, cell) => {
        if (e.button === 0) {
            const {x, y} = cell;
            leftClickOnField(x, y);
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
