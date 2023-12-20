import React, { useState } from "react";
import { Button } from "react-bootstrap";
import OffcanvasPdfViewer from "../../components/OffcanvasPdfViewer";

const DocumentsDetails = ({ arrData }) => {
    const data = arrData?.uploads;

    const [show, setShow] = useState(false);

    const [doc, setDoc] = useState();
    const [url, setUrl] = useState();
    const [crId, setCrId] = useState();

    const handleClose = () => setShow(false);
    const handleShow = (doc, url1, crId) => {
        let arrayUrl = Array.isArray(url1) ? url1 : [url1];
        let arrayCrId = Array.isArray(crId) ? crId : [crId];
        arrayUrl = arrayUrl.map((item) => process.env.APP_BASE + item);
        setShow(true);
        setDoc(doc);
        setUrl(arrayUrl);
        setCrId(arrayCrId);
    };

    return (
        <>
            <div className="scroll--simple " style={{ maxHeight: "333px", overflowX: "clip", overflowY: "auto" }}>
                {data.map((item, index) => {
                    return (
                        <div className="row p-0 m-0" key={index}>
                            <Button variant="light btn-sm mb-1 border-secondary" onClick={() => handleShow(item?.doc_name, item?.file_url, item.crId)} disabled={item.uploaded_file_path === "" || item.uploaded_file_path === null}>
                                <div className="col-12 d-flex justify-content-md-center">
                                    <p className="lh-1 text-uppercase fs-7 fw-semibold text-dark" style={{ margin: "8px" }}>
                                        {item.uploaded_file_path === "" || item.uploaded_file_path === null ? <del>{item?.doc_name}</del> : item?.doc_name}
                                    </p>
                                </div>
                            </Button>
                        </div>
                    );
                })}
            </div>

            <OffcanvasPdfViewer show={show} handleClose={handleClose} doc={doc} isUrlArray url={url} crId={crId} />
        </>
    );
};

export default DocumentsDetails;
