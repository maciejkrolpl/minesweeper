import React, { useEffect, useState } from 'react';
import Cell from '../Cell/Cell';
import Controls from '../Controls/Controls';
import HighScores from '../HighScores/HighScores';
import Modal from '../../layout-components/Modal/Modal';
import './Board.css';

function Board() {
    const LEVEL_SETTINGS = {
        beginner: {
            sizeX: 8,
            sizeY: 8,
            minesCount: 10,
        },
        intermediate: {
            sizeX: 16,
            sizeY: 16,
            minesCount: 40,
        },
        expert: {
            sizeX: 30,
            sizeY: 16,
            minesCount: 99,
        },
    };

    const [areControlsDisabled, setAreControlsDisabled] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameRun, setIsGameRun] = useState(false);
    const [isRunTimer, setIsRunTimer] = useState(false);
    const [isShownHighScores, setIsShownHighScores] = useState(false);
    const [isShownModal, setIsShownModal] = useState(false);
    const [level, setLevel] = useState('');
    const [minesBoard, setMinesBoard] = useState([]);
    const [minesCount, setMinesCount] = useState(0);
    const [minesCountRange, setMinesCountRange] = useState([]);
    const [minesLeft, setMinesLeft] = useState(0);
    const [sizeX, setSizeX] = useState(0);
    const [sizeY, setSizeY] = useState(0);
    const [currentScore, setCurrentScore] = useState(null);
    const [gameStartTime, setGameStartTime] = useState(null);
    const isFieldInBoard = (x, y) => x >= 0 && x < sizeX && y >= 0 && y < sizeY;
    const isMine = (x, y) => minesBoard[x][y].isMine;
    const isFlagged = (x, y) => minesBoard[x][y].isFlagged || false;
    const isClicked = (x, y) => minesBoard[x][y].isClicked;
    const isEmpty = (x, y) => {
        const cell = minesBoard[x][y];
        return (
            cell.isClicked &&
            (cell.neighbourMines === 0 || !('neighbourMines' in cell))
        );
    };

    useEffect(() => {
        if (isRunTimer) {
            setGameStartTime(Date.now());
            setCurrentScore(0);
        } else {
            const gameEndTime = Date.now();
            setCurrentScore(gameEndTime - gameStartTime);
        }
    }, [isRunTimer]);

    useEffect(() => {
        const {
            sizeX: lvlSizeX,
            sizeY: lvlSizeY,
            minesCount: lvlMinesCount,
        } = Object.values(LEVEL_SETTINGS)[0];
        setSizeX(lvlSizeX);
        setSizeY(lvlSizeY);
        setMinesCount(lvlMinesCount);
        setMinesLeft(lvlMinesCount);
        setLevel(Object.keys(LEVEL_SETTINGS)[0]);
    }, []);

    const toggleShowModal = () => setIsShownModal(!isShownModal);
    const toggleHighScores = () => setIsShownHighScores(!isShownHighScores);
    const minesOnNeighbours = (x, y) => minesBoard[x][y].neighbourMines || 0;
    const isArrayInArray = (arrContainer, arrItem) =>
        JSON.stringify(arrContainer).includes(JSON.stringify(arrItem));

    const getFieldsNeighbours = (x, y) =>
        [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y - 1],
            [x, y + 1],
            [x + 1, y - 1],
            [x + 1, y],
            [x + 1, y + 1],
        ].filter(([x1, y1]) => isFieldInBoard(x1, y1));

    const floodFill = (x, y) => {
        const board = [...minesBoard];
        board[x][y].isClicked = true;
        setMinesBoard(board);
        if (board[x][y].neighbourMines !== 0) {
            return;
        }
        const toFill = getFieldsNeighbours(x, y).filter(
            ([x1, y1]) =>
                !isMine(x1, y1) && !isClicked(x1, y1) && !isFlagged(x1, y1)
        );
        toFill.forEach(([x1, y1]) => floodFill(x1, y1));
    };

    const generateMines = (newMinesBoard, clickedX, clickedY) => {
        const minedBoard = [...newMinesBoard];
        let i = minesCount;
        let security = 150;
        const fieldsNeighbours = getFieldsNeighbours(clickedX, clickedY);

        do {
            const randX = Math.floor(Math.random() * sizeX);
            const randY = Math.floor(Math.random() * sizeY);

            if (
                !minedBoard[randX][randY].isMine &&
                randX !== clickedX &&
                randY !== clickedY &&
                !isArrayInArray(fieldsNeighbours, [randX, randY])
            ) {
                minedBoard[randX][randY].isMine = true;
                i -= 1;
            }
            security -= 1;
            if (security === 0) {
                throw Error('Problems with pseudo-random number generator!');
            }
        } while (i > 0);
        return minedBoard;
    };

    const calculateNeighbourMines = (minesBoardToCalculate) => {
        const resultBoard = [...minesBoardToCalculate].map(
            (column, x, inputArray) =>
                column.map((cell, y) => {
                    if (!cell.isMine) {
                        const neighbours = getFieldsNeighbours(x, y);
                        cell.neighbourMines = neighbours.reduce(
                            (sum, [x1, y1]) =>
                                inputArray[x1][y1].isMine ? sum + 1 : sum,
                            0
                        );
                    }
                    return cell;
                })
        );

        return resultBoard;
    };

    const genericBoardCreation = () =>
        Array.from({ length: +sizeX }, (_, x) =>
            Array.from({ length: +sizeY }, (__, y) => ({ x, y }))
        );

    const createMinesBoard = () => {
        const newMinesBoard = genericBoardCreation();
        setMinesBoard(newMinesBoard);
        setIsGameOver(false);
    };

    const startNewGame = (doSetMinesLeft) => {
        setIsGameRun(false);
        setAreControlsDisabled(false);
        if (doSetMinesLeft) {
            setMinesLeft(minesCount);
        }
        createMinesBoard();
        setIsRunTimer(false);
    };

    const countMinesCountRange = () => {
        const minRange = Math.max(sizeX, sizeY);
        const maxRange = (sizeX - 1) * (sizeY - 1);
        setMinesCountRange([minRange, maxRange]);
    };

    useEffect(() => {
        createMinesBoard();
        countMinesCountRange();
    }, [sizeX, sizeY]);

    useEffect(() => {
        createMinesBoard();
    }, [minesCount]);

    useEffect(() => {
        if (!isGameOver) {
            return;
        }

        const board = [...minesBoard];
        board.map((column) =>
            column.map((cell) => {
                if (cell.isMine) {
                    cell.isClicked = true;
                }
                if (cell.isFlagged && !cell.isMine) {
                    cell.isWrongFlagged = true;
                }
                return cell;
            })
        );
        setMinesBoard(board);
    }, [isGameOver]);

    const gameOver = () => {
        setIsGameOver(true);
        setIsGameRun(false);
        setIsRunTimer(false);
    };

    const setAllMinesFlagged = () => {
        const board = [...minesBoard].map((column) =>
            column.map((cell) =>
                cell.isMine ? { ...cell, isFlagged: true } : { ...cell }
            )
        );
        setMinesBoard(board);
    };

    const doGameWon = () => {
        setMinesLeft(0);
        setIsGameRun(false);
        setAllMinesFlagged();
        setIsRunTimer(false);
        toggleShowModal();
    };

    const leftClickOnClicked = (x, y) => {
        if (isEmpty(x, y)) {
            return;
        }

        const fieldsNeighbours = getFieldsNeighbours(x, y);

        const flagsOnNeighbours = fieldsNeighbours.filter(([x1, y1]) =>
            isFlagged(x1, y1)
        ).length;

        if (!flagsOnNeighbours || flagsOnNeighbours < minesOnNeighbours(x, y)) {
            return;
        }

        const wellFlaggedNeighbours = getFieldsNeighbours(x, y).filter(
            ([x1, y1]) => isMine(x1, y1) && isFlagged(x1, y1)
        ).length;

        if (wellFlaggedNeighbours === minesOnNeighbours(x, y)) {
            fieldsNeighbours
                .filter(([x1, y1]) => !isClicked(x1, y1) && !isFlagged(x1, y1))
                .forEach(([x1, y1]) => floodFill(x1, y1));
        } else {
            gameOver();
        }
    };

    const checkIsWon = () => {
        const notRevealed = minesBoard.reduce(
            (sum, column) =>
                column.filter((cell) => !cell.isClicked).length + sum,
            0
        );

        if (notRevealed === minesCount) {
            doGameWon();
        }
    };

    const leftClickOnField = (x, y) => {
        const board = [...minesBoard];
        const {
            isMine: fieldIsMine,
            isClicked: fieldIsClicked,
            isFlagged: fieldIsFlagged,
        } = board[x][y];

        if (fieldIsFlagged) {
            return;
        }

        if (fieldIsClicked) {
            leftClickOnClicked(x, y);
        }

        if (fieldIsMine) {
            gameOver();
            return;
        }

        board[x][y].isClicked = true;
        setMinesBoard(board);
        floodFill(x, y);
        checkIsWon();
    };

    const rightClickOnField = (x, y) => {
        const board = [...minesBoard];
        if (board[x][y].isClicked) {
            return;
        }
        setMinesLeft(minesLeft + (board[x][y].isFlagged ? 1 : -1));
        board[x][y].isFlagged = !board[x][y].isFlagged;
        setMinesBoard(board);
    };

    const createBoardAndMines = (x, y) => {
        let board = [...minesBoard];
        board = generateMines(board, x, y);
        board = calculateNeighbourMines(board);
        setMinesBoard(board);
    };

    const runGame = (x, y) => {
        createBoardAndMines(x, y);
        setIsRunTimer(true);
        setIsGameRun(true);
    };

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
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
    };

    const showHighScores = () => {
        setIsShownHighScores(true);
    };

    const handleLevelSelect = (e, x, y, m) => {
        let selectedSizeX;
        let selectedSizeY;
        let selectedMinesCount;
        if (e) {
            const levelName = e.target.id;

            if (!(levelName in LEVEL_SETTINGS)) {
                throw new Error('Invalid level name');
            }
            setLevel(levelName);

            ({
                sizeX: selectedSizeX,
                sizeY: selectedSizeY,
                minesCount: selectedMinesCount,
            } = LEVEL_SETTINGS[levelName]);
        } else {
            setLevel('custom');
            selectedSizeX = x;
            selectedSizeY = y;
            selectedMinesCount = m;
        }
        setSizeX(selectedSizeX);
        setSizeY(selectedSizeY);
        setMinesCount(selectedMinesCount);
        setMinesLeft(selectedMinesCount);
        startNewGame(false);
    };

    const boardBody = minesBoard.map((column) => (
        <div className="column" key={`${column[0].x}${column[0].y}`}>
            {column.map((cell) => (
                <Cell
                    cellstate={cell}
                    onMouseUp={(e) => handleMouseUp(e, cell)}
                    onContextMenu={handleContextMenu}
                    key={`${cell.x}x${cell.y}`}
                />
            ))}
        </div>
    ));

    return (
        <>
            <div className="controls">
                <Controls
                    minesCountRange={minesCountRange}
                    minesCount={minesCount}
                    minesLeft={minesLeft}
                    onStartGame={() => startNewGame(true)}
                    onShowHighScores={showHighScores}
                    areControlsDisabled={areControlsDisabled}
                    onLevelSelect={handleLevelSelect}
                    level={level}
                    sizeX={sizeX}
                    sizeY={sizeY}
                    isRunTimer={isRunTimer}
                />
            </div>
            <div className="board">{boardBody}</div>

            {isShownModal && (
                <Modal onClose={toggleShowModal} title="High Scores">
                    <HighScores level={level} score={currentScore} />
                </Modal>
            )}
            {isShownHighScores && (
                <Modal onClose={toggleHighScores} title="High Scores">
                    <HighScores display="true" />
                </Modal>
            )}
        </>
    );
}

export default Board;
