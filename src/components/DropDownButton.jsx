import React from 'react';
import './DropDownButton.css';

const DropDownButton = (props) => {
  const showDropDown = () => {
    document.getElementById('myDropdown').classList.toggle('show');
  };

  window.onclick = (event) => {
    if ([...event.target.classList].includes('dropbtn')) {
      return;
    }
    const dropdowns = document.getElementsByClassName('dropdown-content');
    [...dropdowns].forEach((dropdown) => {
      if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
      }
    });
  };

  return (
    <div className="dropdown">
      <button onClick={showDropDown} className="dropbtn">
        {props.label}
      </button>
      <div id="myDropdown" className="dropdown-content">
        {props.children}
      </div>
    </div>
  );
};

export default DropDownButton;
