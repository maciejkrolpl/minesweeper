import React, {useEffect} from 'react';

const Controls = props => {

    const {onSizeChange, sizeX, sizeY, minesCountRange, minesCount, onMinesChange} = props;
    const minSize = 5;
    const maxSize = 20;


    const sizeOptions = () => Array.from({length: maxSize - minSize + 1}, (_, i) => {
        const value = i + minSize;
        return (
            <option value={value}>{value}</option>
        );
    })

    const minesOptions = () => {
        const [minMines, maxMines] = minesCountRange;
        return Array.from({length: maxMines - minMines + 1}, (_, i) => {
            const value = i + minMines;
            return (
                <option value={value}>{value}</option>
            );
        })
    }

    return (
        <div>
            <label for="sizeX">Szerokość</label>
            <select name="sizeX" id="sizeX" onChange={onSizeChange} value={sizeX}>
                {sizeOptions()}
            </select>
            <label for="sizeY">Wysokość</label>
            <select name="sizeY" id="sizeY" onChange={onSizeChange} value={sizeY}>
                {sizeOptions()}
            </select>
            <label for="minesCount">Liczba min</label>
            <select name="minesCount" id="minesCount" onChange={onMinesChange} value={minesCount}>
                {minesOptions()}
            </select>
        </div>
    )
}

export default Controls;