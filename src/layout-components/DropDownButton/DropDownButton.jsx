import React, { Component } from 'react';
import './DropDownButton.css';
import Button from '../Button/Button';

class DropDownButton extends Component {
    constructor(props) {
        super(props);
        document.onclick = ({ target }) => {
            if (!target.closest('.dropdown')) {
                this.hideDropDown();
            }
        };
        this.state = {
            isOpen: false,
        };
    }

    toggleDropDown = () => {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen,
        }));
    };

    hideDropDown = () => {
        this.setState({ isOpen: false });
    };

    render() {
      const {isActive, label, children, isOpen} = this.props;
        return (
            <div className="dropdown">
                <Button
                    onclick={this.toggleDropDown}
                    className="dropbtn"
                    isActive={isActive}
                >
                    {label}
                </Button>
                {isOpen ? (
                    <div id="myDropdown" className="dropdown-content">
                        {children}
                    </div>
                ) : null}
            </div>
        );
    }
}

export default DropDownButton;
