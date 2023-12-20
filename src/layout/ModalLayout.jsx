import React from "react";
import { Modal } from "react-bootstrap";

function ModalLayout({ children, title, show, handleClose, size = "lg", ...rest }) {
    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size={size} className="rectification_modal">
            <Modal.Header closeButton className="rectification_modal_header">
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{React.cloneElement(children, { handleClose, ...rest })}</Modal.Body>
        </Modal>
    );
}

export default ModalLayout;
