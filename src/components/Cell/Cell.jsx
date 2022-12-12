import React from 'react';
import './Cell.css';

function Cell(props) {
    const {
        cellstate: {
            isMine,
            neighbourMines,
            isClicked,
            isFlagged,
            isWrongFlagged,
            x,
            y,
        },
        onMouseUp,
        onContextMenu,
    } = props;
    const getClassName = () => {
        if (isWrongFlagged) {
            return 'cell cell-wrong';
        }
        if (isFlagged) {
            return 'cell cell-flagged';
        }
        if (isClicked) {
            if (isMine) {
                return 'cell cell-mine';
            }
            return `cell cell-clicked mines-${neighbourMines}`;
        }
        return 'cell cell-neutral';
    };
    const getTitle = () => `${x}x${y}`;
    return (
        /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
        <button
            type="button"
            className={getClassName()}
            onMouseUp={onMouseUp}
            onContextMenu={onContextMenu}
            title={getTitle()}
            aria-label=" "
        />
    );
}

export default Cell;
