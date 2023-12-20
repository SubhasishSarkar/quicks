import React, { useState } from "react";
import FormUpload from "./FormUpload";
import ApplicationDetails from "./ApplicationDetails";
import { Modal } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

function TW({ data }) {
    const query = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showModal, setShowModal] = useState(false);
    const handleRenew = (item) => {
        setShowModal(true);
    };
    return (
        <div className="mt-2">
            <div className="my-2">{data && <ApplicationDetails data={data} handleRenew={handleRenew} />}</div>

            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                }}
                size="xl"
                backdrop="static"
                className="rectification_modal"
            >
                <Modal.Header closeButton className="rectification_modal_header">
                    <Modal.Title id="example-custom-modal-styling-title" className="rectification_title">
                        Title
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormUpload
                        data={data}
                        handleRenewed={() => {
                            setSearchParams("");
                            setShowModal(false);
                            query.invalidateQueries("renew-e-district", searchParams.toString());
                        }}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default TW;
