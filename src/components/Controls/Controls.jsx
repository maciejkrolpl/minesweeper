import React, { createRef, useEffect, useState } from 'react';
import Button from '../../layout-components/Button/Button';
import Timer from '../Timer/Timer';
import './Controls.css';
import DropDownButton from '../../layout-components/DropDownButton/DropDownButton';

function Controls(props) {
    const {
        sizeX,
        sizeY,
        minesCountRange,
        minesCount,
        onStartGame,
        level,
        onLevelSelect,
        onShowHighScores,
        minesLeft,
        isRunTimer
    } = props;
    const minSize = 5;
    const maxSize = 30;

    const [tempX, setTempX] = useState(0);
    const [tempY, setTempY] = useState(0);
    const [tempMines, setTempMines] = useState(0);

    const dropDownReference = createRef();

    useEffect(() => {
        setTempX(sizeX);
        setTempY(sizeY);
        setTempMines(minesCount);
    }, [sizeX, sizeY, minesCount]);

    const onSizeChange = (e) => {
        const elem = e.target.id;
        const value = +e.target.value;

        const actions = {
            sizeX: setTempX,
            sizeY: setTempY,
            minesCount: setTempMines,
        };

        actions[elem](value);
    };

    const sizeOptions = () =>
        Array.from({ length: maxSize - minSize + 1 }, (_, i) => {
            const value = i + minSize;
            return (
                <option value={value} key={value}>
                    {value}
                </option>
            );
        });

    const onCustomLevelSelect = () => {
        dropDownReference.current.hideDropDown();
        onLevelSelect(null, tempX, tempY, tempMines);
    };

    const minesOptions = () => {
        const [minMines, maxMines] = minesCountRange;
        return Array.from({ length: maxMines - minMines + 1 }, (_, i) => {
            const value = i + minMines;
            return (
                <option value={value} key={value}>
                    {value}
                </option>
            );
        });
    };

    return (
        <div className="controls-container">
            <div>
                <Button
                    id="beginner"
                    onclick={onLevelSelect}
                    isActive={level === 'beginner'}
                >
                    Beginner
                </Button>
            </div>
            <div>
                <Button
                    id="intermediate"
                    onclick={onLevelSelect}
                    isActive={level === 'intermediate'}
                >
                    Intermediate
                </Button>
            </div>
            <div>
                <Button
                    id="expert"
                    onclick={onLevelSelect}
                    isActive={level === 'expert'}
                >
                    Expert
                </Button>
            </div>
            <div>
                <DropDownButton
                    label="Custom size"
                    id="custom"
                    isActive={level === 'custom'}
                    ref={dropDownReference}
                >
                    <div>
                        Columns
                        <select
                            name="sizeX"
                            id="sizeX"
                            onChange={onSizeChange}
                            value={tempX}
                        >
                            {sizeOptions()}
                        </select>
                    </div>
                    <div>
                        Rows
                        <select
                            name="sizeY"
                            id="sizeY"
                            onChange={onSizeChange}
                            value={tempY}
                        >
                            {sizeOptions()}
                        </select>
                    </div>
                    <div>
                        Mines
                        <select
                            name="minesCount"
                            id="minesCount"
                            onChange={onSizeChange}
                            value={tempMines}
                        >
                            {minesOptions()}
                        </select>
                    </div>
                    <div>
                        <Button onclick={onCustomLevelSelect}>OK</Button>
                    </div>
                </DropDownButton>
            </div>
            <div>
                Mines Left
                <input
                    type="text"
                    disabled
                    id="minesLeft"
                    name="minesLeft"
                    value={minesLeft}
                />
            </div>
            <div>
                Timer
                <Timer isRunTimer={isRunTimer} />
            </div>
            <div>
                <Button type="button" id="startNewGame" onclick={onStartGame}>
                    Start new game
                </Button>
            </div>
            <div>
                <Button
                    type="button"
                    id="showHighScores"
                    onclick={onShowHighScores}
                >
                    Show HighScores
                </Button>
            </div>
        </div>
    );
}

export default Controls;
