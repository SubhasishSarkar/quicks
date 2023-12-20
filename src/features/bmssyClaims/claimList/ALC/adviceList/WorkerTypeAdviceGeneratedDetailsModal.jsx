import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Modal } from "react-bootstrap";
import { fetcher } from "../../../../../utils";
import LoadingSpinner from "../../../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../../../components/list/ErrorAlert";

const WorkerTypeAdviceGeneratedDetailsModal = ({ showHide, setShowHide, getName, id }) => {
    const { error, data, isFetching } = useQuery(["memo-details", id], () => fetcher(`/memo-details?id=${id}`), { enabled: id ? true : false });

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            <Modal show={showHide} onHide={() => setShowHide(false)} backdrop="static" keyboard={false} dialogClassName="modal-90w" size="lg" aria-labelledby="example-custom-modal-styling-title" className="confirm_modal">
                <Modal.Header closeButton style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#fff", color: "#0886e3" }}>
                    <Modal.Title>
                        MEMO : <span style={{ color: "#FA5807" }}>{getName}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        maxHeight: "calc(100vh - 210px)",
                        overflowY: "auto",
                    }}
                >
                    <div className="card">
                        <div className="card-body">
                            {isFetching && <LoadingSpinner />}
                            {error && <ErrorAlert error={error} />}
                            {data && (
                                <div style={{ overflow: "auto" }} className="table-container table-responsive">
                                    <table className="table table-bordered  table-sm table-striped">
                                        <thead>
                                            <tr>
                                                <th>SL No.</th>
                                                <th>Fund Request</th>
                                                <th>Number Of Application</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td style={wrapStyle}>{index + 1}</td>
                                                        <td style={wrapStyle}>{item.fund_requirment_id}</td>
                                                        <td style={wrapStyle}>{item.number_of_application}</td>
                                                        <td style={wrapStyle}>{item.amount}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default WorkerTypeAdviceGeneratedDetailsModal;
