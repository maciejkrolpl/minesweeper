import React from 'react';

const Cell = (props) => {
    const {
        cellstate: {
            isMine,
            neighbourMines,
            isClicked,
            isFlagged,
            isWrongFlagged,
            x,
            y
        },
        onMouseUp,
        onContextMenu
    } = props;
    const getClassName = () =>
        isWrongFlagged ? 'cell cell-wrong' :
            isFlagged ? 'cell cell-flagged' :
                isClicked ?
                    isMine ? 'cell cell-mine' : `cell cell-clicked mines-${neighbourMines}`
                    : 'cell cell-neutral';
    const getTitle = () => `${x}x${y}`;
    return (
        <div className={getClassName()}
             onMouseUp={onMouseUp}
             onContextMenu={onContextMenu}
             title={getTitle()}
        >
        </div>
    )
}

export default Cell;