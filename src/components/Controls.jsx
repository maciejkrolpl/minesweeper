import React, { useState } from 'react';
import './Controls.css';
import Timer from './Timer';
import DropDownButton from './DropDownButton';
import Button from './Button';
import { useEffect } from 'react';

const Controls = props => {

    const {
        sizeX,
        sizeY,
        minesCountRange,
        minesCount,
        minesLeft,
        onStartGame,
        level,
        isRunTimer,
        onLevelSelect
    } = props;
    const minSize = 5;
    const maxSize = 20;

    const [tempX, setTempX] = useState(0);
    const [tempY, setTempY] = useState(0);
    const [tempMines, setTempMines] = useState(0);

    useEffect(() => {
        console.log('x',sizeX)
        setTempX(sizeX)
    }, [sizeX])

    useEffect(() => {
        console.log('y',sizeY)
        setTempY(sizeY)
    }, [sizeY])

    useEffect(() => {
        console.log('m', minesCount)
        setTempMines(minesCount)
    }, [minesCount])

    // useEffect(() => {
    //     const controls = ['sizeX', 'sizeY', 'minesCount']
    //         .map(id => document.getElementById(id));
    //     controls.forEach(control => control.disabled = areControlsDisabled);
    // }, [areControlsDisabled])

    const onSizeChange = e => {
        const elem = e.target.id;
        const value = e.target.value;

        const actions = {
            sizeX: setTempX,
            sizeY: setTempY,
            minesCount: setTempMines
        };

        actions[elem](value);
    }

    const sizeOptions = () => Array.from({ length: maxSize - minSize + 1 }, (_, i) => {
        const value = i + minSize;
        return (
            <option value={value} key={value}>{value}</option>
        );
    })

    const onCustomLevelSelect = e => {
        onLevelSelect(null, tempX, tempY, tempMines);
    }

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
                <DropDownButton label="Custom sizes" id="custom" isActive={level === 'custom'}>
                    <div>
                        <label htmlFor="sizeX">Columns</label>
                        <select name="sizeX" id="sizeX" onChange={onSizeChange} value={tempX}>
                            {sizeOptions()}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sizeY">Rows</label>
                        <select name="sizeY" id="sizeY" onChange={onSizeChange} value={tempY}>
                            {sizeOptions()}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="minesCount">Mines</label>
                        <select name="minesCount" id="minesCount" onChange={onSizeChange} value={tempMines}>
                            {minesOptions()}
                        </select>
                    </div>
                    <div>
                        <Button onclick={onCustomLevelSelect} >OK</Button>
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