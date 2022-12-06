import React, { useEffect } from 'react';
import './Controls.css';
import Timer from './Timer';

const Controls = props => {

    const {
        onSizeChange,
        sizeX,
        sizeY,
        minesCountRange,
        minesCount,
        minesLeft,
        onMinesChange,
        onStartGame,
        areControlsDisabled,
        isRunTimer,
        onLevelSelect
    } = props;
    const minSize = 5;
    const maxSize = 20;

    // useEffect(() => {
    //     const controls = ['sizeX', 'sizeY', 'minesCount']
    //         .map(id => document.getElementById(id));
    //     controls.forEach(control => control.disabled = areControlsDisabled);
    // }, [areControlsDisabled])


    const sizeOptions = () => Array.from({ length: maxSize - minSize + 1 }, (_, i) => {
        const value = i + minSize;
        return (
            <option value={value} key={value}>{value}</option>
        );
    })

    const minesOptions = () => {
        const [minMines, maxMines] = minesCountRange;
        return Array.from({ length: maxMines - minMines + 1 }, (_, i) => {
            const value = i + minMines;
            return (
                <option value={value} key={value}>{value}</option>
            );
        })
    }

    return (
        <div className="controls-container">
            <div>
                <button type="button" id="beginner" onClick={onLevelSelect}>Beginner</button>
            </div>
            <div>
                <button type="button" id="intermediate" onClick={onLevelSelect}>Intermediate</button>
            </div>
            <div>
                <button type="button" id="expert" onClick={onLevelSelect}>Expert</button>
            </div>
            <div>
                <label htmlFor="minesLeft">Mines left</label>
                <input type="text" disabled id="minesLeft" name="minesLeft" value={minesLeft} />
            </div>
            <div>
                <Timer isRunTimer={isRunTimer} />
            </div>
            <div>
                <button type="button" id="startNewGame" onClick={onStartGame}>Start new game</button>

            </div>
        </div>
    )
}

export default Controls;