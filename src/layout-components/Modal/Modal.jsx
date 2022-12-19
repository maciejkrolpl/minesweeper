import React, { useEffect } from 'react';
import './Modal.css';
import Button from '../Button/Button';

function Modal(props) {
    const {
        onClose,
        children,
        title,
        width: { value, unit },
    } = props;

    const closeButtonRef = React.useRef(null);

    const setFocus = () => {
        if (closeButtonRef && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    };

    const modalWidth = {
        width: `${value}${unit === 'percent' ? 'vw' : 'px'}`,
    };
    useEffect(() => {
        document.addEventListener('setFocus', setFocus);
    }, []);

    return (
        <>
            <div
                className="modal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="myModalLabel"
                aria-hidden="true"
                style={modalWidth}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{title}</h2>
                        </div>
                        <div className="modal-body">{children}</div>
                        <div className="modal-footer">
                            <Button onclick={onClose} ref={closeButtonRef}>
                                close
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="background" />
        </>
    );
}

export default Modal;
