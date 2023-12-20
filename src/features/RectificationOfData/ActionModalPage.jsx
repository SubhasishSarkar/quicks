import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Card, Modal, Tab, Tabs } from "react-bootstrap";
import ErrorAlert from "../../components/list/ErrorAlert";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import PdfViewer from "../../components/PdfViewer";
import { fetcher, updater } from "../../utils";

import WorkerRectificationForm from "../../features/RectificationOfData/workerTypeRectification/WorkerRectificationForm";
import { toast } from "react-toastify";
import RegistrationNumberUpdate from "./correctionOfRegistrationNumber/RegistrationNumberUpdate";
import RegistrationDateUpdate from "./correctionOfRegistrationDate/RegistrationDateUpdate";
import RegistrationDateUpdateForCwTw from "./correctionOfRegistrationDateForCwTw/RegistrationDateUpdateForCwTw";
import noFile from "../../../public/assets/no_documents.png";
import AadharRectificationForm from "./AadharRectification/AadharRectificationForm";
import AddressUpdate from "./correctionOfAddress/AddressUpdate";
import RectificationYesAndNoSection from "./RectificationYesAndNoSection";
import ConfirmationModal from "../../components/ConfirmationModal";
import BmssyImageZoom from "../../components/BmssyImageZoom";

const ActionModalPage = ({ show, encId, handleClose, isActive, ssin, benName, actionTabType, registrationDate, registrationNo, workerType }) => {
    //For Confirm modal section
    const [openConfirm, setOpenConfirm] = useState(false);
    const [confirmMsg, setConfirmMsg] = useState();

    const params = `application_id=${encId}&ssin=${ssin}&isActive=${isActive}`;
    const { error, data, isFetching } = useQuery(["get-doc-for-correction", encId], () => fetcher(`/get-doc-for-correction?${params}`), {
        enabled: show ? true : false,
    });

    const getExtension = (url) => {
        if (url) return url.split(/[#?]/)[0].split(".").pop().trim();
    };

    const [buttonFlag, setButtonFlag] = useState(false);
    useEffect(() => {
        if (show === false) setButtonFlag(false);
    }, [show]);

    const { mutate: forNoBtn, isLoading: forNoLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const query = useQueryClient();
    const updateWant = (val) => {
        if (val === "Yes") {
            setButtonFlag(true);
        } else if (val === "No") {
            setButtonFlag(false);
            setOpenConfirm(true);
            switch (actionTabType) {
                case "registrationNo":
                    setConfirmMsg(`The current registration no: "${registrationNo}" of ssin: "${ssin}" is not require any rectification. Are you sure?`);
                    break;
                case "registrationDate":
                    setConfirmMsg(`The current registration date: ${registrationDate} of ssin: "${ssin}" is not require any rectification. Are you sure?`);
                    break;
                case "registrationDateCwTw":
                    setConfirmMsg(`The current registration date: "${registrationDate}" of ssin: "${ssin}" is not require any rectification. Are you sure?`);
                    break;
                case "workerType":
                    setConfirmMsg(`The current worker type: "${workerType === "ow" ? "Other Worker" : workerType === "cw" ? "Construction Worker" : "Transport Worker"}" of ssin: "${ssin}" is not require any rectification. Are you sure?`);
                    break;
                case "addressRectification":
                    setConfirmMsg(`Are you sure ? This ssin: "${ssin}" is not under your RLO`);
                    break;
                default:
                    break;
            }
        }
    };

    const handleConfirm = () => {
        const body = { application_id: encId, typeOfRectification: actionTabType };
        setOpenConfirm(false);
        forNoBtn(
            { url: `/rectification_not_required`, body: body },
            {
                onSuccess(data, variables, context) {
                    let url = "";
                    let successMsg = "";
                    switch (actionTabType) {
                        case "registrationNo":
                            url = "get-erroneous-registration-number";
                            successMsg = "Registration number rectified successfully.";
                            break;
                        case "registrationDate":
                            url = "wrong-registration-date-list";
                            successMsg = "Registration date rectified successfully.";
                            break;
                        case "registrationDateCwTw":
                            url = "wrong-registration-date-list-cw-tw";
                            successMsg = "Registration date rectified successfully.";
                            break;
                        case "workerType":
                            url = "wrong-worker-type-list";
                            successMsg = "Worker type rectified successfully.";
                            break;
                        case "addressRectification":
                            url = "address_rectification";
                            successMsg = "Address Rectification";
                            break;
                        default:
                            break;
                    }
                    query.invalidateQueries(url);
                    handleClose(true);
                    toast.success(successMsg);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    return (
        <>
            {openConfirm && <ConfirmationModal handleConfirm={handleConfirm} handleClose={setOpenConfirm} title={confirmMsg} />}
            <Modal show={show} onHide={handleClose} size="xl" backdrop="static" className="rectification_modal">
                <Modal.Header closeButton className="rectification_modal_header">
                    <Modal.Title id="example-custom-modal-styling-title" className="rectification_title">
                        {actionTabType === "workerType" && (
                            <>
                                <div className="row text_shadow_class">
                                    <div className="col-md-12 d-flex justify-content-md-center">
                                        <p className="text-light text-uppercase fs-3 fw-semibold lh-1">Worker Type Rectification</p>
                                    </div>
                                    <div className="col-md-12 d-flex justify-content-md-center text-light">
                                        SSIN : {ssin} ({benName}) & Existing Worker Type : {workerType === "ow" ? "Other Worker" : workerType === "cw" ? "Construction Worker" : "Transport Worker"}
                                    </div>
                                </div>
                            </>
                        )}
                        {actionTabType === "registrationNo" && (
                            <>
                                <div className="row text_shadow_class">
                                    <div className="col-md-12 d-flex justify-content-md-center">
                                        <p className="text-light text-uppercase fs-3 fw-semibold lh-1">Registration Number Rectification</p>
                                    </div>
                                    <div className="col-md-12 d-flex justify-content-md-center text-light">
                                        SSIN : {ssin} ({benName}) & Existing Registration No : {registrationNo}
                                    </div>
                                </div>
                            </>
                        )}
                        {actionTabType === "registrationDate" && (
                            <>
                                <div className="row text_shadow_class">
                                    <div className="col-md-12 d-flex justify-content-md-center">
                                        <p className="text-light text-uppercase fs-3 fw-semibold lh-1">Registration Date Rectification</p>
                                    </div>
                                    <div className="col-md-12 d-flex justify-content-md-center text-light">
                                        SSIN : {ssin} ({benName}) & Existing Registration Date : {registrationDate}
                                    </div>
                                </div>
                            </>
                        )}
                        {actionTabType === "registrationDateCwTw" && (
                            <>
                                <div className="row text_shadow_class">
                                    <div className="col-md-12 d-flex justify-content-md-center">
                                        <p className="text-light text-uppercase fs-3 fw-semibold lh-1">Registration Date Rectification for CW & TW</p>
                                    </div>
                                    <div className="col-md-12 d-flex justify-content-md-center text-light">
                                        SSIN : {ssin} ({benName}) & Existing Registration Date : {registrationDate}
                                    </div>
                                </div>
                            </>
                        )}
                        {actionTabType === "aadharRectification" && `Tagging Of Aadhaar Number`}
                        {actionTabType === "addressRectification" && (
                            <>
                                <div className="row text_shadow_class">
                                    <div className="col-md-12 d-flex justify-content-md-center">
                                        <p className="text-light text-uppercase fs-3 fw-semibold lh-1">Address Rectification</p>
                                    </div>
                                    <div className="col-md-12 d-flex justify-content-md-center text-light">
                                        SSIN : {ssin} ({benName}) & Existing Registration Date : {registrationDate}
                                    </div>
                                </div>
                            </>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isFetching && <LoadingSpinner />}
                    {error && <ErrorAlert error={error} />}

                    {data && (
                        <div className="row">
                            <div className="col-md-8">
                                <div className="card-nav-tabs mb-2">
                                    <Tabs>
                                        <Tab eventKey="0" title="Aadhaar">
                                            {data?.fileJson[0]?.benAadhaarFilepath != "" ? (
                                                <>
                                                    {(getExtension(data?.fileJson[0]?.benAadhaarFilepath) === "jpg" || getExtension(data?.fileJson[0]?.benAadhaarFilepath) === "jpeg") && (
                                                        <BmssyImageZoom imageUrl={"https://bmssy.wblabour.gov.in" + data?.fileJson[0].benAadhaarFilepath} />
                                                    )}
                                                    {getExtension(data?.fileJson[0]?.benIdentityFilepath) === "pdf" && (
                                                        <div className="scroll--simple" style={{ maxHeight: "550px", overflowY: "auto" }}>
                                                            <PdfViewer url={"https://bmssy.wblabour.gov.in" + data?.fileJson[0]?.benAadhaarFilepath} />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <img src={noFile} alt="" width="30%" />
                                                    <span style={{ color: "#ff8181a1", display: "grid", fontFamily: "Poppins" }}>Document not found!</span>
                                                </div>
                                            )}
                                        </Tab>
                                        <Tab eventKey="1" title="Passbook">
                                            {data?.fileJson[0]?.benPassbookFilepath != "" ? (
                                                <>
                                                    {(getExtension(data?.fileJson[0]?.benPassbookFilepath) === "jpg" || getExtension(data?.fileJson[0]?.benPassbookFilepath) === "jpeg") && (
                                                        <BmssyImageZoom imageUrl={"https://bmssy.wblabour.gov.in" + data?.fileJson[0].benPassbookFilepath} />
                                                    )}
                                                    {getExtension(data?.fileJson[0]?.benIdentityFilepath) === "pdf" && (
                                                        <div className="scroll--simple" style={{ maxHeight: "550px", overflowY: "auto" }}>
                                                            <PdfViewer url={"https://bmssy.wblabour.gov.in" + data?.fileJson[0]?.benPassbookFilepath} />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <img src={noFile} alt="" width="30%" />
                                                    <span style={{ color: "#ff8181a1", display: "grid", fontFamily: "Poppins" }}>Document not found!</span>
                                                </div>
                                            )}
                                        </Tab>
                                        <Tab eventKey="2" title="Certificate">
                                            {data?.fileJson[0]?.benSchemeCertificateFilepath != "" ? (
                                                <>
                                                    {(getExtension(data?.fileJson[0]?.benSchemeCertificateFilepath) === "jpg" || getExtension(data?.fileJson[0]?.benSchemeCertificateFilepath) === "jpeg") && (
                                                        <BmssyImageZoom imageUrl={"https://bmssy.wblabour.gov.in" + data?.fileJson[0].benSchemeCertificateFilepath} />
                                                    )}
                                                    {getExtension(data?.fileJson[0]?.benIdentityFilepath) === "pdf" && (
                                                        <div className="scroll--simple" style={{ maxHeight: "550px", overflowY: "auto" }}>
                                                            <PdfViewer url={"https://bmssy.wblabour.gov.in" + data?.fileJson[0]?.benSchemeCertificateFilepath} />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <img src={noFile} alt="" width="30%" />
                                                    <span style={{ color: "#ff8181a1", display: "grid", fontFamily: "Poppins" }}>Document not found!</span>
                                                </div>
                                            )}
                                        </Tab>
                                        <Tab eventKey="3" title="Epic/Identity">
                                            {data?.fileJson[0]?.benIdentityFilepath != "" ? (
                                                <>
                                                    {(getExtension(data?.fileJson[0]?.benIdentityFilepath) === "jpg" || getExtension(data?.fileJson[0]?.benIdentityFilepath) === "jpeg") && (
                                                        <BmssyImageZoom imageUrl={"https://bmssy.wblabour.gov.in" + data?.fileJson[0].benIdentityFilepath} />
                                                    )}
                                                    {getExtension(data?.fileJson[0]?.benIdentityFilepath) === "pdf" && (
                                                        <div className="scroll--simple" style={{ maxHeight: "550px", overflowY: "auto" }}>
                                                            <PdfViewer url={"https://bmssy.wblabour.gov.in" + data?.fileJson[0]?.benIdentityFilepath} />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <img src={noFile} alt="" width="30%" />
                                                    <span style={{ color: "#ff8181a1", display: "grid", fontFamily: "Poppins" }}>Document not found!</span>
                                                </div>
                                            )}
                                        </Tab>
                                        <Tab eventKey="4" title="Form 1">
                                            {data?.fileJson[0]?.benForm1Filepath != "" ? (
                                                <>
                                                    {(getExtension(data?.fileJson[0]?.benForm1Filepath) === "jpg" || getExtension(data?.fileJson[0]?.benForm1Filepath) === "jpeg") && (
                                                        <BmssyImageZoom imageUrl={"https://bmssy.wblabour.gov.in" + data?.fileJson[0].benForm1Filepath} />
                                                    )}

                                                    {getExtension(data?.fileJson[0]?.benForm1Filepath) === "pdf" && (
                                                        <div className="scroll--simple" style={{ maxHeight: "550px", overflowY: "auto" }}>
                                                            <PdfViewer url={"https://bmssy.wblabour.gov.in" + data?.fileJson[0]?.benForm1Filepath} />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <img src={noFile} alt="" width="30%" />
                                                    <span style={{ color: "#ff8181a1", display: "grid", fontFamily: "Poppins" }}>Document not found!</span>
                                                </div>
                                            )}
                                        </Tab>
                                        <Tab eventKey="5" title="Photo & Signature">
                                            <Card body className="border-0">
                                                <div className="col-md-12 row">
                                                    <div className="col-md-12 d-flex justify-content-md-center">
                                                        <img src={"https://bmssy.wblabour.gov.in" + data?.fileJson[0].benPhotoFilepath} alt="" style={{ width: "40%", border: "2px solid rgb(87 86 87)" }} />
                                                    </div>
                                                </div>
                                            </Card>
                                            <Card footer className="border-0">
                                                <div className="col-md-12 d-flex justify-content-md-center">
                                                    <img src={"https://bmssy.wblabour.gov.in" + data?.fileJson[0].benSignatureFilepath} alt="" style={{ width: "40%" }} />
                                                </div>
                                            </Card>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card">
                                    <div className="card-body">
                                        {/* worker type rectification */}
                                        {actionTabType === "workerType" &&
                                            (buttonFlag === false ? <RectificationYesAndNoSection updateWant={updateWant} forNoLoading={forNoLoading} /> : <WorkerRectificationForm encId={encId} ssin={ssin} handleClose={handleClose} />)}

                                        {/* registration no ow rectification */}
                                        {actionTabType === "registrationNo" &&
                                            (buttonFlag === false ? (
                                                <>
                                                    <RectificationYesAndNoSection updateWant={updateWant} forNoLoading={forNoLoading} />
                                                    <p className="fw-normal lh-2 lh-sm font-monospace" style={{ color: "red" }}>
                                                        NOTE : If the beneficiary is a Construction / Transport worker please select no button.
                                                    </p>
                                                </>
                                            ) : (
                                                <RegistrationNumberUpdate encId={encId} handleClose={handleClose} ssin={ssin} registrationNo={registrationNo} />
                                            ))}

                                        {/* registration date rectification */}
                                        {actionTabType === "registrationDate" &&
                                            (buttonFlag === false ? (
                                                <RectificationYesAndNoSection updateWant={updateWant} forNoLoading={forNoLoading} />
                                            ) : (
                                                <RegistrationDateUpdate encId={encId} handleClose={handleClose} ssin={ssin} registrationDate={registrationDate} />
                                            ))}

                                        {/* verhoff aadhar rectification  */}
                                        {actionTabType === "aadharRectification" && <AadharRectificationForm encId={encId} handleClose={handleClose} ssin={ssin} />}

                                        {/* registration no for cw/tw rectification */}
                                        {actionTabType === "registrationDateCwTw" &&
                                            (buttonFlag === false ? (
                                                <RectificationYesAndNoSection updateWant={updateWant} forNoLoading={forNoLoading} />
                                            ) : (
                                                <RegistrationDateUpdateForCwTw encId={encId} handleClose={handleClose} ssin={ssin} registrationDate={registrationDate} />
                                            ))}

                                        {actionTabType === "addressRectification" && <AddressUpdate handleClose={handleClose} encId={encId} updateWant={updateWant} forNoLoading={forNoLoading} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ActionModalPage;
