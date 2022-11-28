import React from 'react';

const Cell = (props) => {
    const BLANK = " ";
    const FLAGGED = "!";
    const MINE = "☀";
    const {isMine, neighbourMines, isClicked, x, y, onClick, onMouseUp, onMouseDown, onContextMenu} = props;
    return (
        <div className="cell"
             onMouseDown={onMouseDown}
             onMouseUp={onMouseUp}
             onContextMenu={onContextMenu}
             onClick={onClick}>{BLANK}</div>
    )
}

export default Cell;