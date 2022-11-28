import React from 'react';

const Cell = (props) => {
    const BLANK = " ";
    const FLAGGED = "!";
    const MINE = "☀";
    const {isMine, neighbourMines, isClicked, x, y} = props.cellstate;
    const {onMouseUp, onContextMenu} = props;
    const displayed = () => isMine ? MINE : neighbourMines;
    const getClassName = () => isClicked ? 'cell cell-clicked' : 'cell cell-neutral';

    return (
        <div className={getClassName()}
             onMouseUp={onMouseUp}
             onContextMenu={onContextMenu}>

        </div>
    )
}

export default Cell;