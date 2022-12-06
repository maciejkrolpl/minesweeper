import React, { useState } from 'react';
import './DropDownButton.css';

const DropDownButton = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const showDropDown = () => {
    setIsOpen(!isOpen);
  };

  document.onclick = ({ target }) => {
    if (!target.closest('.dropdown')) {
      setIsOpen(false);
    }
  };

  return (
    <div className="dropdown">
      <button onClick={showDropDown} className="dropbtn">
        {props.label}
      </button>
      {isOpen ? (
        <div id="myDropdown" className="dropdown-content">
          {props.children}
        </div>
      ) : null}
    </div>
  );
};

export default DropDownButton;
