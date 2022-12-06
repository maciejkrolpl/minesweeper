import React from "react";
import "./Modal.css";
import PropTypes from "prop-types";
import Button from "./Button";


const Modal = props => {
    const { onClose, show, children, title } = props;

    if (!show) {
        return null;
    }
    return (
        <div className="background">
            <div className="modal" id="modal">
                <h2>{title}</h2>
                <div className="content">{children}</div>
                <div className="actions">
                    <Button onclick={onClose}>
                        close
                    </Button>
                </div>
            </div>

        </div>
    );

}

Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};

export default Modal;