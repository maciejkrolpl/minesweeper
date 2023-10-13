import React from 'react';
import './Button.css';
import PropTypes from 'prop-types';

const Button = React.forwardRef((props, ref) => {
    const { onclick, children, isActive, id, className, type } = props;

    return (
        <button
            // eslint-disable-next-line react/button-has-type
            type={type}
            className={isActive ? `${className} active` : className}
            onClick={onclick}
            id={id}
            ref={ref}
        >
            {children}
        </button>
    );
});

Button.propTypes = {
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

Button.defaultProps = {
    type: 'button',
};

export default Button;
