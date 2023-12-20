import React from "react";
import { Accordion, Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import PdfViewer from "./PdfViewer";
import { getFileExtension } from "../utils";

const OffcanvasPdfViewer = ({ show, handleClose, doc, url, crId = "", isUrlArray = false }) => {
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
            {isUrlArray ? (
                <>
                    <Offcanvas show={show} onHide={handleClose} placement="end" backdrop={false} scroll={true} className="bmssy_offcanvas ">
                        <Offcanvas.Header closeButton className="bmssy_offcanvas_header">
                            <Offcanvas.Title>
                                <span style={{ fontSize: "25px", fontFamily: "Poppins" }}>{doc}</span>
                                {url && url?.length === 1 && (
                                    <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip("Click here to view full screen.")}>
                                        <i className="fa-solid fa-arrow-up-right-from-square" id="open_in_new_tab_offcanvas" onClick={() => openInNewTab(url)} style={{ cursor: "pointer", fontSize: "15px", color: "blue", marginLeft: "12px" }}></i>
                                    </OverlayTrigger>
                                )}
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="bmssy_offcanvas_body">
                            <Accordion defaultActiveKey="0">
                                {url?.length > 0 &&
                                    url?.map((_item, _index) => {
                                        return (
                                            <Accordion.Item eventKey={String(_index)} key={_index} style={{ backgroundColor: "transparent" }}>
                                                <Accordion.Header>
                                                    {(crId[_index] === null || crId[_index] === "") && <strong>Uploaded At Time Of Registration</strong>}

                                                    {crId[_index] != "" && crId[_index] != null && <strong>Upload for CR {crId[_index] != null ? ", CR No: " + crId[_index] : ""}</strong>}

                                                    {url && url?.length > 1 && (
                                                        <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip("Click here to view full screen.")}>
                                                            <i
                                                                className="fa-solid fa-arrow-up-right-from-square"
                                                                id="open_in_new_tab_offcanvas"
                                                                onClick={() => openInNewTab(_item)}
                                                                style={{ cursor: "pointer", fontSize: "15px", color: "blue", marginLeft: "7px" }}
                                                            ></i>
                                                        </OverlayTrigger>
                                                    )}
                                                </Accordion.Header>
                                                <Accordion.Body style={{ margin: "-13px" }}>{["JPG", "jpeg", "jpg"].includes(getFileExtension(_item)) ? <img src={_item} alt="" height="80%" width="80%" /> : <PdfViewer url={_item} />}</Accordion.Body>
                                            </Accordion.Item>
                                        );
                                    })}
                            </Accordion>
                        </Offcanvas.Body>
                    </Offcanvas>
                </>
            ) : (
                <Offcanvas show={show} onHide={handleClose} placement="end" backdrop={false} scroll={true} className="bmssy_offcanvas">
                    <Offcanvas.Header closeButton className="bmssy_offcanvas_header">
                        <Offcanvas.Title>
                            <span style={{ fontFamily: "Poppins" }}>{doc}</span>
                            <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 50 }} overlay={renderTooltip("Click here to view full screen.")}>
                                <i className="fa-solid fa-arrow-up-right-from-square" id="open_in_new_tab_offcanvas" onClick={() => openInNewTab(url)} style={{ cursor: "pointer", fontSize: "15px", color: "blue", marginLeft: "12px" }}></i>
                            </OverlayTrigger>
                        </Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body className="bmssy_offcanvas_body">
                        {doc != "CR_Nominee" && (getFileExtension(url) === "pdf" || getFileExtension(url) === "") && <PdfViewer url={url} />}
                        {["JPG", "jpeg", "jpg"].includes(getFileExtension(url)) && <img src={url} alt="" height="80%" width="80%" />}
                    </Offcanvas.Body>
                </Offcanvas>
            )}
        </>
    );
};

export default OffcanvasPdfViewer;
