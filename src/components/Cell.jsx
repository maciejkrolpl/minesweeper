import React from 'react';

const Cell = (props) => {
    const BLANK = " ";
    const FLAGGED = "!";
    const MINE = "☀";
    const {cellstate: {isMine, neighbourMines, isClicked, x, y}, onMouseUp, onContextMenu} = props;
    const displayed = () => isMine ? MINE : '';
    const getClassName = () => isClicked ?
        isMine ? 'cell cell-mine' : `cell cell-clicked mines-${neighbourMines}`
        : 'cell cell-neutral';
    const getTitle = () => `${x}x${y}`;
    return (
        <div className={getClassName()}
             onMouseUp={onMouseUp}
             onContextMenu={onContextMenu}
             title={getTitle()}
        >
            {displayed()}
        </div>
    )
}

export default Cell;