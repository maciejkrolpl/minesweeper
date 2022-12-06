import React, { useEffect, useRef, useState } from "react";
import Cell from "./Cell";
import Controls from "./Controls";

const Board = () => {
    const LEVEL_SETTINGS = {
        beginner: {
            sizeX: 8,
            sizeY: 8,
            minesCount: 10
        },
        intermediate: {
            sizeX: 16,
            sizeY: 16,
            minesCount: 40
        },
        expert: {
            sizeX: 30,
            sizeY: 16,
            minesCount: 99
        }
    }

    const [minesBoard, setMinesBoard] = useState([]);
    const [level, setLevel] = useState('');
    const [isGameOver, setIsGameOver] = useState(false);
    const [sizeX, setSizeX] = useState(0);
    const [sizeY, setSizeY] = useState(0);
    const [minesCount, setMinesCount] = useState(0);
    const [areControlsDisabled, setAreControlsDisabled] = useState(false);
    const [minesLeft, setMinesLeft] = useState(0);
    const [minesCountRange, setMinesCountRange] = useState([]);
    const [isGameRun, setIsGameRun] = useState(false);
    const [isRunTimer, setIsRunTimer] = useState(false);
    const isFieldInBoard = (x, y) => x >= 0 && x < sizeX && y >= 0 && y < sizeY;
    const isMine = (x, y) => minesBoard[x][y].isMine;
    const isFlagged = (x, y) => minesBoard[x][y].isFlagged || false;
    const isClicked = (x, y) => minesBoard[x][y].isClicked;
    const isEmpty = (x, y) => {
        const cell = minesBoard[x][y];
        return cell.isClicked && (
            cell.neighbourMines === 0 || !('neighbourMines' in cell)
        );
    }

    useState(() => {
        const { sizeX, sizeY, minesCount } = Object.values(LEVEL_SETTINGS)[0];
        setSizeX(sizeX);
        setSizeY(sizeY);
        setMinesCount(minesCount);
        setLevel(Object.keys(LEVEL_SETTINGS)[0])

    })

    const minesOnNeighbours = (x, y) => minesBoard[x][y].neighbourMines || 0;

    const isArrayInArray = (arrContainer, arrItem) => JSON.stringify(arrContainer).includes(JSON.stringify(arrItem))

    const generateMines = (newMinesBoard, clickedX, clickedY) => {
        let i = minesCount;
        let security = 150;
        const fieldsNeighbours = getFieldsNeighbours(clickedX, clickedY);

        do {
            const randX = Math.floor(Math.random() * sizeX);
            const randY = Math.floor(Math.random() * sizeY);

            if (!newMinesBoard[randX][randY].isMine
                && (randX !== clickedX && randY !== clickedY)
                && (!isArrayInArray(fieldsNeighbours, [randX, randY]))
            ) {
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
        Array.from({ length: +sizeX }, (_, x) =>
            Array.from({ length: +sizeY }, (_, y) => ({ x, y }))
        );

    const startNewGame = () => {
        setIsGameRun(false);
        setAreControlsDisabled(false);
        setMinesLeft(minesCount);
        createMinesBoard();
        setIsRunTimer(false);
    }

    const createMinesBoard = () => {
        let newMinesBoard = genericBoardCreation();
        setMinesBoard(newMinesBoard);
        setIsGameOver(false);
    };

    const countMinesCountRange = () => {
        const minRange = Math.max(sizeX, sizeY);
        const maxRange = (sizeX - 1) * (sizeY - 1);
        setMinesCountRange([minRange, maxRange]);
    }

    useEffect(() => {
        createMinesBoard();
        countMinesCountRange();
    }, [sizeX, sizeY]);

    useEffect(() => {
        createMinesBoard()
    }, [minesCount])

    useEffect(() => {
        if (!isGameOver) {
            return;
        }

        const board = [...minesBoard];
        board.forEach(column => column.forEach(cell => {
            if (cell.isMine) {
                cell.isClicked = true;
            }
            if (cell.isFlagged && !cell.isMine) {
                cell.isWrongFlagged = true;
            }
        }))
        setMinesBoard(board);
    }, [isGameOver])

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
            .filter(([x, y]) => !isMine(x, y) && !isClicked(x, y) && !isFlagged(x, y))
        toFill.forEach(([x, y]) => floodFill(x, y))
    }

    const gameOver = () => {
        setIsGameOver(true);
        setIsGameRun(false);
        setIsRunTimer(false);
    }

    const doGameWon = () => {
        setMinesLeft(0);
        setIsGameRun(false);
        setAllMinesFlagged();
        setIsRunTimer(false);
    }

    const setAllMinesFlagged = () => {
        const board = [...minesBoard].map(column => column.map(cell => cell.isMine ?
            { ...cell, isFlagged: true } : { ...cell }))
        setMinesBoard(board);
    }

    const leftClickOnClicked = (x, y) => {
        if (isEmpty(x, y)) {
            return;
        }

        const fieldsNeighbours = getFieldsNeighbours(x, y);

        const flagsOnNeighbours = fieldsNeighbours
            .filter(([x, y]) => isFlagged(x, y)).length;

        if (!flagsOnNeighbours || flagsOnNeighbours < minesOnNeighbours(x, y)) {
            return;
        }

        const wellFlaggedNeighbours = getFieldsNeighbours(x, y)
            .filter(([x, y]) => isMine(x, y) && isFlagged(x, y))
            .length;

        if (wellFlaggedNeighbours === minesOnNeighbours(x, y)) {
            fieldsNeighbours
                .filter(([x, y]) => !isClicked(x, y) && !isFlagged(x, y))
                .forEach(([x, y]) => floodFill(x, y));
        } else {
            gameOver();
        }
    }

    const leftClickOnField = (x, y) => {
        const board = [...minesBoard];
        const { isMine, isClicked } = board[x][y];

        if (isClicked) {
            leftClickOnClicked(x, y);
        }

        if (isMine) {
            gameOver();
            return;
        }

        board[x][y].isClicked = true;
        setMinesBoard(board);
        floodFill(x, y);
        checkIsWon();
    }

    const checkIsWon = () => {
        const notRevealed = minesBoard.reduce((sum, column) =>
            column.filter(cell => (!cell.isClicked)).length + sum
            , 0)

        if (notRevealed === minesCount) {
            doGameWon();
        }
    }

    const handleMouseUp = (e, cell) => {
        if (isGameOver) {
            return;
        }
        const { x, y } = cell;
        if (!isGameRun) {
            runGame(x, y);
        }

        if (e.button === 0) {
            leftClickOnField(x, y);
        } else if (e.button === 2) {
            rightClickOnField(x, y);
        }
    }

    const rightClickOnField = (x, y) => {
        const board = [...minesBoard];
        if (board[x][y].isClicked) {
            return;
        }
        setMinesLeft(minesLeft + (board[x][y].isFlagged ? 1 : -1));
        board[x][y].isFlagged = !board[x][y].isFlagged;
        setMinesBoard(board);
    }

    const handleContextMenu = e => {
        e.preventDefault();
    }

    const handleChangeSize = e => {
        const { name, value } = e.target;
        if (name === 'sizeX') {
            setSizeX(value);
        } else if (name === 'sizeY') {
            setSizeY(value);
        }
    }

    const createBoardAndMines = (x, y) => {
        let board = [...minesBoard];
        board = generateMines(board, x, y);
        board = calculateNeighbourMines(board);
        setMinesBoard(board);
    }

    const runGame = (x, y) => {
        createBoardAndMines(x, y);
        setAreControlsDisabled(true);
        setIsGameRun(true);
        setIsRunTimer(true);
    }

    // const handleChangeMines = e => {
    //     const { value } = e.target;
    //     setMinesCount(+value);
    //     minesLeft.current = +value;
    // }

    const handleLevelSelect = (e, x, y, m) => {
        let sizeX;
        let sizeY;
        let minesCount;
        if (e) {
            const levelName = e.target.id;
            
            if (!levelName in LEVEL_SETTINGS) {
                throw new Error('Invalid level name')
            }
            setLevel(levelName);

            ({ sizeX, sizeY, minesCount } = LEVEL_SETTINGS[levelName]);
        } else {
            setLevel('custom')
            sizeX = x;
            sizeY = y;
            minesCount = m;
        }

        setSizeX(sizeX);
        setSizeY(sizeY);
        setMinesCount(minesCount);
        startNewGame();
    }

    const boardBody = minesBoard.map((column, index) =>
        <div className='column' key={index}>{column.map((cell) =>
            <Cell
                cellstate={cell}
                onMouseUp={(e) => handleMouseUp(e, cell)}
                onContextMenu={handleContextMenu}
                key={`${cell.x}${cell.y}`}
            />
        )}
        </div>
    );

    return (
        <>
            <div className='controls'>
                <Controls
                    minesCountRange={minesCountRange}
                    minesCount={minesCount}
                    minesLeft={minesLeft}
                    onStartGame={startNewGame}
                    areControlsDisabled={areControlsDisabled}
                    isRunTimer={isRunTimer}
                    onLevelSelect={handleLevelSelect}
                    level={level}
                    sizeX={sizeX}
                    sizeY={sizeY}
                />
            </div>
            <div className='board'>
                {boardBody}
            </div>
        </>
    );
};

export default Board;
