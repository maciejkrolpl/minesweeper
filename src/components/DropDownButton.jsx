import React, { Component } from 'react';
import './DropDownButton.css';
import Button from './Button';

class DropDownButton extends Component {
  constructor(props) {
    super(props);
    document.onclick = ({ target }) => {
      if (!target.closest('.dropdown')) {
        this.hideDropDown();
      }
    };
    this.state = {
      isOpen: false
    }
  }

  toggleDropDown = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  hideDropDown = () => {
    this.setState({ isOpen: false })
  }

  render() {
    return (
      <div className="dropdown">
        <Button onclick={this.toggleDropDown} className="dropbtn" isActive={this.props.isActive}>
          {this.props.label}
        </Button>
        {this.state.isOpen ? (
          <div id="myDropdown" className="dropdown-content">
            {this.props.children}
          </div>
        ) : null}
      </div>
    )
  }

}

export default DropDownButton;
