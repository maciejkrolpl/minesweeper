import React from 'react';

const Cell = (props) => {
console.log(props);
  return (
          <div className="cell">{props.cellstate.neighbourMines}</div>
  )
}

export default Cell;