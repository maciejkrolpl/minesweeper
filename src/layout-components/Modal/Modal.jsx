import React from 'react';
import './Modal.css';
import Button from '../Button/Button';

function Modal(props) {
    const { onClose, children, title } = props;

    return (
        <>
        <div
            className="modal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="myModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{title}</h2>
                    </div>
                    <div className="modal-body">
                        {children}
                        </div>
                    <div className="modal-footer">
                        <Button onclick={onClose}>close</Button>
                    </div>
                </div>
            </div>
        </div>
        <div className='background'/>
        </>
    );
}

export default Modal;
