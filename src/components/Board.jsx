import React, {useState, useEffect, useRef} from "react";
import Cell from "./Cell";
import Controls from "./Controls";

const Board = () => {
    const [minesBoard, setMinesBoard] = useState([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [sizeX, setSizeX] = useState(5);
    const [sizeY, setSizeY] = useState(5);
    const [minesCount, setMinesCount] = useState(5);
    const [areControlsDisabled, setAreControlsDisabled] = useState(false);
    const minesLeft =  useRef(5);
    const [minesCountRange, setMinesCountRange] = useState([]);
    const [isGameRun, setIsGameRun] = useState(false);
    const isFieldInBoard = (x, y) => x >= 0 && x < sizeX && y >= 0 && y < sizeY;
    const isMine = (x, y) => minesBoard[x][y].isMine;
    const isFlagged = (x, y) => minesBoard[x][y].isFlagged;
    const isClicked = (x, y) => minesBoard[x][y].isClicked;


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

    const startNewGame = () => {
        setAreControlsDisabled(false);
        minesLeft.current = minesCount;
        createMinesBoard();
    }

    const createMinesBoard = () => {
        setIsGameOver(false);
        let newMinesBoard = genericBoardCreation();
        newMinesBoard = generateMines(newMinesBoard);
        newMinesBoard = calculateNeighbourMines(newMinesBoard);
        setMinesBoard(newMinesBoard);
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
            .filter(([x, y]) => !isMine(x, y) && !isClicked(x, y) && !isFlagged(x,y))
        toFill.forEach(([x, y]) => floodFill(x, y))
    }

    const gameOver = () => {
        setIsGameOver(true);
        setIsGameRun(false);
    }

    const leftClickOnField = (x, y) => {
        const board = [...minesBoard];
        const {isMine, isClicked, isFlagged} = board[x][y];

        if (isClicked) {
            return;
        }

       if (isMine) {
           gameOver();
           return;

       }

        //console.log('click', x, y)


        board[x][y].isClicked = true;
        setMinesBoard(board);
        floodFill(x, y);
    }

    const handleMouseUp = (e, cell) => {
        if (isGameOver) {
            return;
        }
        if (!isGameRun) {
            runGame();
        }

        const {x, y} = cell;
        if (e.button === 0) {
            leftClickOnField(x, y);
        }
        // right click
        if (e.button === 2) {
            rightClickOnField(x, y);
        }
    }

    const rightClickOnField = (x, y) => {
        const board = [...minesBoard];
        if (board[x][y].isClicked) {
            return;
        }
        minesLeft.current = (minesLeft.current + (board[x][y].isFlagged ?  1 : -1) );
        board[x][y].isFlagged = !board[x][y].isFlagged;
        setMinesBoard(board);
    }

    const handleContextMenu = e => {
        e.preventDefault();
    }

    const handleChangeSize = e => {
        const {name, value} = e.target;
        if (name === 'sizeX') {
            setSizeX(value);
        } else if (name === 'sizeY') {
            setSizeY(value);
        }
    }

    const runGame = () => {
        setAreControlsDisabled(true);
        setIsGameRun(true);
        // startTimer()

    }

    const handleChangeMines = e => {
        const {value} = e.target;
        setMinesCount(+value);
        minesLeft.current = +value;
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
        <>
            <div className='controls'>
                <Controls
                    minesCountRange={minesCountRange}
                    minesCount={minesCount}
                    minesLeft={minesLeft.current}
                    onSizeChange={handleChangeSize}
                    onMinesChange={handleChangeMines}
                    onStartGame={startNewGame}
                    areControlsDisabled={areControlsDisabled}/>
            </div>
            <div className='board'>
                {boardBody}
            </div>
        </>
    );
};

export default Board;
