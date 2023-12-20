import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetcher } from "../../../../../utils";
import { useParams } from "react-router";
import LoadingSpinner from "../../../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../../../components/list/ErrorAlert";
import PfCafClaimRemarkStatus from "../../../../../pages/admin/BmssyClaims/PfCafClaimRemarkStatus";
import { Button, Offcanvas } from "react-bootstrap";
import PdfViewer from "../../../../../components/PdfViewer";

const PfCafDetailsPage = () => {
    const { id } = useParams();
    const { error, data, isFetching } = useQuery(["get-pf-caf-claim-details", id], () => fetcher(`/get-pf-caf-claim-details?id=${id}`), { enabled: id ? true : false });

    const [show, setShow] = useState(false);

    const [doc, setDoc] = useState();
    const [url, setUrl] = useState();

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setShow(true);
        setDoc(e.currentTarget.getAttribute("attr_name"));
        setUrl(e.currentTarget.getAttribute("attr_url"));
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <div>
                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header py-2">
                            <h5 className="m-0 font-weight-bold text-white">Beneficiary Basic Information </h5>
                        </div>
                        <div className="card-body">
                            <div style={{ overflow: "auto" }} className="table-container table-responsive">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <th>SSIN</th>
                                            <th>Registration No</th>
                                            <th>Registration Date</th>
                                            <th>Worker Type</th>
                                            <th>Aadhar Number</th>
                                        </tr>
                                        <tr>
                                            <td style={wrapStyle}>{data?.val?.name}</td>
                                            <td style={wrapStyle}>{data?.val?.ssin}</td>
                                            <td style={wrapStyle}>{data?.val?.regNo}</td>
                                            <td style={wrapStyle}>{data?.val?.view_reg_date}</td>
                                            <td style={wrapStyle}>{data?.val?.cat_worker_type === "ow" ? "Other Worker" : data?.val?.cat_worker_type === "cw" ? "Construction Worker" : "Transport Worker"}</td>
                                            <td style={wrapStyle}>{data?.val?.aadhar}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header py-2">
                            <h5 className="m-0 font-weight-bold text-white">Beneficiary Address Information </h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive mb-2">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>District</th>
                                            <th>Sub Division</th>
                                            <th>Block</th>
                                            <th>Gp/Ward</th>
                                            <th>Post Office</th>
                                            <th>Police Station</th>
                                            <th>Pin Code</th>
                                            <th>House/Village/Street/Road</th>
                                        </tr>
                                        <tr>
                                            <td style={wrapStyle}>{data?.val?.district_name}</td>
                                            <td style={wrapStyle}>{data?.val?.subdivision_name}</td>
                                            <td style={wrapStyle}>{data?.val?.block_mun_name}</td>
                                            <td style={wrapStyle}>{data?.val?.gp_ward_name}</td>
                                            <td style={wrapStyle}>{data?.val?.po_name}</td>
                                            <td style={wrapStyle}>{data?.val?.ps_name}</td>
                                            <td style={wrapStyle} >{data?.val?.pinCode}</td>
                                            <td style={wrapStyle}>{data?.val?.hvsr}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header py-2">
                            <h5 className="m-0 font-weight-bold text-white">Beneficiary Bank Information </h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive mb-2">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <th>IFSC</th>
                                            <th>Branch</th>
                                            <th>Location</th>
                                            <th>Account No.</th>
                                        </tr>
                                        <tr>
                                            <td style={wrapStyle}>{data?.val?.bank_name}</td>
                                            <td style={wrapStyle}>{data?.val?.bank_ifsc}</td>
                                            <td style={wrapStyle}>{data?.val?.bank_branch_name}</td>
                                            <td style={wrapStyle}>{data?.val?.bank_location}</td>
                                            <td style={wrapStyle}>{data?.val?.bank_account_no}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="card datatable-box shadow mb-2">
                        <div className="card-header py-2">
                            <h5 className="m-0 font-weight-bold text-white">Beneficiary Documents Information </h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive mb-2">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>SL No.</th>
                                            <th>Document Name</th>
                                            <th>View</th>
                                        </tr>
                                        {data?.documents?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td style={wrapStyle}>{data?.from + index}</td>
                                                    <td style={wrapStyle}>{item?.name}</td>
                                                    <td style={wrapStyle}>
                                                        <Button onClick={handleShow} attr_name={item?.name} attr_url={item?.file} size="sm">
                                                            view
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Offcanvas show={show} onHide={handleClose} placement="end" backdrop="static">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>{doc}</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <PdfViewer url={process.env.APP_BASE + "/" + url} />
                        </Offcanvas.Body>
                    </Offcanvas>

                    <PfCafClaimRemarkStatus id={id} />
                </div>
            )}
        </>
    );
};

export default PfCafDetailsPage;
