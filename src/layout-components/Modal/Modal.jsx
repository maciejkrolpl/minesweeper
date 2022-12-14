import React, { useEffect } from 'react';
import './Modal.css';
import Button from '../Button/Button';

function Modal(props) {
    const { onClose, children, title } = props;

    const closeButtonRef = React.useRef(null);

    const setFocus = () => {
        if (closeButtonRef && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    };

    useEffect(() => {
        document.addEventListener('setFocus', setFocus);
    }, []);

    return (
        <div className="background">
            <div className="modal" id="modal">
                <h2>{title}</h2>
                <div className="content">{children}</div>
                <div className="actions">
                    <Button
                        onclick={onClose}
                        id="button-close"
                        ref={closeButtonRef}
                    >
                        close
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
