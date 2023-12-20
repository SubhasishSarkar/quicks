import React from "react";
import { Button } from "react-bootstrap";

const DocumentsDetailsForModal = ({ arrData }) => {
    const data = arrData?.uploads;

    const openInNewTab = (url) => {
        window.open(process.env.APP_BASE + url, "_blank", "noreferrer");
    };
    return (
        <>
            {data.map((item, index) => {
                return (
                    <div className="row" key={index}>
                        <Button variant="light btn-sm mb-2" onClick={() => openInNewTab(item?.file_url)}>
                            <div className="col-12 d-flex justify-content-md-center">
                                <p className="lh-1 text-uppercase fs-7 fw-semibold text-dark" style={{ margin: "8px" }}>
                                    {index + 1}.{item?.doc_name}
                                </p>
                            </div>
                        </Button>
                    </div>
                );
            })}
        </>
    );
};

export default DocumentsDetailsForModal;
