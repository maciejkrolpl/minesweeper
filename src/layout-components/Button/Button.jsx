import React from 'react';
import './Button.css';

function Button(props) {
    const { onclick, children, isActive, id, className } = props;

    return (
        <button
            type="button"
            className={isActive ? `${className} active` : className}
            onClick={onclick}
            id={id}
        >
            {children}
        </button>
    );
}

export default Button;
