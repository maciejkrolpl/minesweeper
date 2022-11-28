import React from 'react';

const Cell = (props) => {
    const BLANK = " ";
    const FLAGGED = "!";
    const MINE = "☀";
    const {isMine, neighbourMines, isClicked, x, y, onClick, onMouseUp, onMouseDown, onContextMenu} = props.cellstate;
    const displayed = isMine ? MINE : neighbourMines;
    return (
        <div className="cell"
             onMouseDown={onMouseDown}
             onMouseUp={onMouseUp}
             onContextMenu={onContextMenu}
             onClick={onClick}>{displayed}</div>
    )
}

export default Cell;