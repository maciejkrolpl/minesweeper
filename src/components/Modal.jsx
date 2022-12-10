/* eslint-disable react/prop-types */
import React from 'react';
import './Modal.css';
import Button from './Button';

function Modal(props) {
    const { onClose, children, title } = props;

    return (
        <div className="background">
            <div className="modal" id="modal">
                <h2>{title}</h2>
                <div className="content">{children}</div>
                <div className="actions">
                    <Button onclick={onClose}>close</Button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
