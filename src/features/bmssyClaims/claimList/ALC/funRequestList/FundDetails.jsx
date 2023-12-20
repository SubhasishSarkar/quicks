import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Card, Modal } from "react-bootstrap";
import ErrorAlert from "../../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../../components/list/LoadingSpinner";
import { fetcher } from "../../../../../utils";
import CurrentStatus from "../../CurrentStatus";
import ClaimForBadge from "../../ClaimForBadge";
import ClaimDetailsPage from "../../../../../pages/admin/BmssyClaims/ClaimDetailsPage";
import FundClaimListSearchBySsin from "./FundClaimListSearchBySsin";

const FundDetails = ({ id }) => {
    const { error, data, isFetching } = useQuery(["fund-request-details", id], () => fetcher(`/fund-request-details?id=${id}`), { enabled: id ? true : false });

    const [claimId, setClaimId] = useState();
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
    const [total, setTotal] = useState();
    useEffect(() => {
        // Update filteredData whenever data changes or searchTerm changes
        if (data) {
            const filtered = data?.claimData?.filter((item) => item.ssin_no.includes(searchTerm));
            setFilteredData(filtered);
            const result = filtered.reduce((acc, item) => {
                switch (item.claim_for) {
                    case "disability":
                        return acc + item.claim_amount;

                    default:
                        return acc + item.approved_amount;
                }
            }, 0);
            setTotal(result);
        }
    }, [data, searchTerm]);

    const checkFundClaim = (id) => {
        setClaimId(id);
        setShow(true);
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}

            {!isFetching && (
                <>
                    {error ? (
                        <ErrorAlert error={error} />
                    ) : (
                        <>
                            <Card className="mb-2  border-primary">
                                <Card.Header as="h5" className="bg-primary text-light">
                                    Group Information
                                </Card.Header>
                                <Card.Body>
                                    <div className="ben_details_section">
                                        <h6>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> Fund Request ID : {data?.group?.fund_requirment_id}
                                        </h6>
                                        <h6>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> Fund Request Date : {data?.group?.created_date}
                                        </h6>
                                        <h6>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> RLO : {data?.group?.subdivision_name}
                                        </h6>
                                        <h6>
                                            <i className="fa-solid fa-circle-dot label_pointer"></i> Number Of Application : {data?.group?.number_of_application}
                                        </h6>
                                    </div>
                                    <h6>
                                        <i className="fa-solid fa-circle-dot label_pointer"></i> Approve Amount : ₹ {total}
                                    </h6>
                                    {/* {data?.group?.amount} ( {inWords(data?.group?.amount)} */}
                                </Card.Body>
                            </Card>
                            <Card className="border-primary">
                                <Card.Header as="h5" className="bg-primary text-light">
                                    Claims Information
                                </Card.Header>
                                <Card.Body>
                                    {data && <FundClaimListSearchBySsin searchTerm={searchTerm} setSearchTerm={setSearchTerm} filteredData={filteredData} />}
                                    <div style={{ overflow: "auto" }} className="table-container table-responsive">
                                        <table className="table table-bordered  table-sm table-striped">
                                            <thead>
                                                <tr>
                                                    <th>SL No.</th>
                                                    <th>Claim Reference No</th>
                                                    <th>Beneficiary Name</th>
                                                    <th>Beneficiary SSIN</th>
                                                    <th>Registration No</th>
                                                    <th>Approve Amount</th>
                                                    <th>Claim for</th>
                                                    <th>Status</th>
                                                    <th>Check Claim</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredData.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td style={wrapStyle}>{index + 1}</td>
                                                            <td style={wrapStyle}>{item.id}</td>
                                                            <td style={wrapStyle}>{item.beneficiary_name}</td>
                                                            <td style={wrapStyle}>{item.ssin_no}</td>
                                                            <td style={wrapStyle}>{item.registration_no === "null" ? "" : item.registration_no}</td>
                                                            {(item.claim_for === "death" || item.claim_for === "pf") && <td style={wrapStyle}>{item.approved_amount}</td>}
                                                            {item.claim_for === "disability" && <td>{item.claim_amount}</td>}
                                                            {/* <td className="text-capitalize">{item.claim_for}</td> */}
                                                            <td style={wrapStyle}>
                                                                <ClaimForBadge claimFor={item.claim_for === "death" ? "DEATH" : item.claim_for === "disability" ? "DISABILITY" : "PF"} />
                                                            </td>
                                                            <td style={wrapStyle}>
                                                                <CurrentStatus claimStatus={item.submit_status} />
                                                            </td>
                                                            <td style={wrapStyle}>
                                                                <button className="btn btn-sm btn-info" onClick={() => checkFundClaim(item.encClaimId)}>
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Modal size="xl" show={show} onHide={() => setShow(false)} backdrop="static" aria-labelledby="example-modal-sizes-title-lg" className="rectification_modal ">
                                <Modal.Header closeButton style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#fff", color: "#0886e3" }}>
                                    <Modal.Title>Claim Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body
                                    className="scroll--simple"
                                    style={{
                                        maxHeight: "calc(100vh - 210px)",
                                        overflowY: "auto",
                                    }}
                                >
                                    <ClaimDetailsPage funClaimViewAlcId={claimId} />
                                </Modal.Body>
                            </Modal>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default FundDetails;
