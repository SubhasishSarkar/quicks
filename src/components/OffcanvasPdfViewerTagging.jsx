import React from "react";
import { Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import PdfViewer from "./PdfViewer";
import { getFileExtension } from "../utils";

const OffcanvasPdfViewerTagging = ({ show, handleClose, doc, url, isUrlArray = false }) => {
    const openInNewTab = (url) => {
        window.open(url, "_blank", "noreferrer");
    };
    const renderTooltip = (msg) => (
        <Tooltip id="button-tooltip" placement="top">
            {msg}
        </Tooltip>
    );

    return (
        <>
            <Offcanvas show={show} onHide={handleClose} placement="end" backdrop={false} scroll={true} className="bmssy_offcanvas">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <span style={{ fontSize: "25px", fontFamily: "Poppins" }}>{doc}</span>
                        {url && url?.length > 0 && (
                            <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip("Click here to view full screen.")}>
                                <i className="fa-solid fa-arrow-up-right-from-square" id="open_in_new_tab_offcanvas" onClick={() => openInNewTab(url)} style={{ cursor: "pointer", fontSize: "15px", color: "blue", marginLeft: "12px" }}></i>
                            </OverlayTrigger>
                        )}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {isUrlArray && url?.length > 0 && (
                        <>
                            <div style={{ margin: "-13px" }}>{["JPG", "jpeg", "jpg"].includes(getFileExtension(url)) ? <img src={url} alt="" height="80%" width="80%" /> : <PdfViewer url={url} />}</div>
                        </>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default OffcanvasPdfViewerTagging;
