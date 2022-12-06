import React, { useState } from 'react';
import './DropDownButton.css';
import Button from './Button';

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
      <Button onclick={showDropDown} className="dropbtn">
        {props.label}
      </Button>
      {isOpen ? (
        <div id="myDropdown" className="dropdown-content">
          {props.children}
        </div>
      ) : null}
    </div>
  );
};

export default DropDownButton;
