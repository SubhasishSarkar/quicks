import React from "react";
import { Button, Modal } from "react-bootstrap";

const ConfirmationModal = ({ handleConfirm, handleClose, title }) => {
    return (
        <>
            <Modal show={true} className="confirm_modal">
                <Modal.Header className="confirm_modal_header d-flex justify-content-md-center my-0">
                    <Modal.Title>Please Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body className="confirm_modal_body">
                    <h6>
                        <p className="text-dark fs-5 fw-normal lh-base font-monospace">{title}</p>
                    </h6>
                </Modal.Body>
                <div style={{ background: "#fff", borderTop: "1px solid #e1dbdb" }}>
                    <div className="modal-btn">
                        <Button variant="success" onClick={() => handleConfirm()}>
                            <i className="fa-solid "></i> YES
                        </Button>
                        <Button variant="warning" onClick={() => handleClose(false)}>
                            <i className="fa-solid "></i> NO
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ConfirmationModal;
