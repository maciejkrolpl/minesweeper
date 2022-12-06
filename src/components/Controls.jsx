import React, { useEffect } from 'react';
import './Controls.css';
import Timer from './Timer';
import DropDownButton from './DropDownButton';
import Button from './Button';

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
        level,
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
                <Button id="beginner" onclick={onLevelSelect} isActive={level === 'beginner'}>Beginner</Button>
            </div>
            <div>
                <Button id="intermediate" onclick={onLevelSelect} isActive={level === 'intermediate'}>Intermediate</Button>
            </div>
            <div>
                <Button id="expert" onclick={onLevelSelect} isActive={level === 'expert'}>Expert</Button>
            </div>
            <div>
                <DropDownButton label="Custom sizes" onSizeChange={onSizeChange} id="custom" isActive={level==='custom'}>
                    <div>
                        <label htmlFor="sizeX">Columns</label>
                        <select name="sizeX" id="sizeX" onChange={onSizeChange} value={sizeX}>
                            {sizeOptions()}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sizeY">Rows</label>
                        <select name="sizeY" id="sizeY" onChange={onSizeChange} value={sizeY}>
                            {sizeOptions()}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="minesCount">Mines</label>
                        <select name="minesCount" id="minesCount" onChange={onMinesChange} value={minesCount}>
                            {minesOptions()}
                        </select>
                    </div>
                    <div>
                        <Button onclick={onLevelSelect} >OK</Button>
                    </div>
                </DropDownButton>
            </div>
            <div>
                <label htmlFor="minesLeft">Mines left</label>
                <input type="text" disabled id="minesLeft" name="minesLeft" value={minesLeft} />
            </div>
            <div>
                <Timer isRunTimer={isRunTimer} />
            </div>
            <div>
                <Button type="button" id="startNewGame" onclick={onStartGame}>Start new game</Button>

            </div>
        </div>
    )
}

export default Controls;