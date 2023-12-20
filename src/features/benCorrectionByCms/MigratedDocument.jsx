import React, { useState } from "react";
import OffcanvasPdfViewer from "../../components/OffcanvasPdfViewer";
import { useQuery } from "@tanstack/react-query";
import { Humanize, fetcher } from "../../utils";
import { useParams } from "react-router";
import { Button } from "react-bootstrap";

const MigratedDocument = () => {
    const { id } = useParams();
    const applicationId = id;

    const { data } = useQuery(["get-ssy-document", applicationId], () => fetcher(`/get-ssy-document?id=${applicationId}`), {
        enabled: applicationId ? true : false,
    });

    console.log("data", data);

    const [show, setShow] = useState(false);
    const [doc, setDoc] = useState();
    const [url, setUrl] = useState();

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setShow(true);
        setDoc(Humanize(e.currentTarget.getAttribute("attr_name")));
        setUrl(e.currentTarget.getAttribute("attr_url"));
    };

    return (
        <>
            {data && (
                <>
                    <div className="card-body" style={{ position: "relative", overflow: "hidden" }}>
                        <div className="card-text">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <p>
                                            Photo :
                                            {data[0]?.ben_photo_filepath && (
                                                <Button onClick={handleShow} attr_name={"Epic"} attr_url={data[0]?.ben_photo_filepath} className="btn btn-success btn-sm " type="button">
                                                    View
                                                </Button>
                                            )}
                                        </p>
                                        <p>
                                            Signature :
                                            {data[0]?.ben_signature_filepath && (
                                                <Button onClick={handleShow} attr_name={"Epic"} attr_url={data[0]?.ben_signature_filepath} className="btn btn-success btn-sm" type="button">
                                                    View
                                                </Button>
                                            )}
                                        </p>
                                        <p>
                                            Bank Passbook :
                                            {data[0]?.ben_passbook_filepath && (
                                                <Button onClick={handleShow} attr_name={"Epic"} attr_url={data[0]?.ben_passbook_filepath} className="btn btn-success btn-sm " type="button">
                                                    View
                                                </Button>
                                            )}
                                        </p>
                                        <p>
                                            Epic :
                                            {data[0]?.ben_identity_filepath && (
                                                <Button onClick={handleShow} attr_name={"Epic"} attr_url={data[0]?.ben_identity_filepath} className="btn btn-success btn-sm " type="button">
                                                    View
                                                </Button>
                                            )}
                                        </p>
                                        <p>
                                            Form1:
                                            {data[0]?.ben_form1_filepath && (
                                                <Button onClick={handleShow} attr_name={"Epic"} attr_url={data[0]?.ben_form1_filepath} className="btn btn-success btn-sm" type="button">
                                                    View
                                                </Button>
                                            )}
                                        </p>
                                        <p>
                                            Aadhaar :
                                            {data[0]?.ben_aadhaar_filepath && (
                                                <Button onClick={handleShow} attr_name={"Epic"} attr_url={data[0]?.ben_aadhaar_filepath} className="btn btn-success btn-sm " type="button">
                                                    View
                                                </Button>
                                            )}
                                        </p>
                                        <p>
                                            Scheme Certificate :
                                            {data[0]?.ben_schemecertificate_filepath && (
                                                <Button onClick={handleShow} attr_name={"Epic"} attr_url={data[0]?.ben_schemecertificate_filepath} className="btn btn-success btn-sm " type="button">
                                                    View
                                                </Button>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <OffcanvasPdfViewer show={show} handleClose={handleClose} doc={doc} url={process.env.APP_BASE + url} />
                </>
            )}
        </>
    );
};

export default MigratedDocument;
