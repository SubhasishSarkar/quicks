import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetcher } from "../../utils";
import ErrorAlert from "../../components/list/ErrorAlert";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import { Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";

const getOrgFieldsName = (type, values) => {
    let fields = "";
    switch (type) {
        case "SLO_SIDE":
            if (values.includes("aadhar_number")) fields += "Aadhar Number_";
            if (values.includes("name_and_DOB") || values.includes("name_and_date")) fields += "Name and DOB_";
            if (values.includes("marital_status")) fields += "Marital Status_";
            if (values.includes("permanent_address") || values.includes("parmanent_address")) fields += "Permanent Address_";
            if (values.includes("present_address")) fields += "Present Address_";
            if (values.includes("bank_details")) fields += "Bank Details_";
            if (values.includes("nominee_details")) fields += "Nominee Details_";
            if (values.includes("Dependency_details")) fields += "Dependent Details_";
            break;
        case "IMW_SIDE":
            if (values.includes("aadharNumber")) fields += "Aadhar Number_";
            if (values.includes("nameAndDate")) fields += "Name and DOB_";
            if (values.includes("nomineeDetails")) fields += "Nominee Details_";
            if (values.includes("parmanentAddress")) fields += "Permanent Address_";
            if (values.includes("bankDetails")) fields += "Bank Details_";
            break;
        default:
            break;
    }
    //replace all underscore to comma
    //replace last comma to white space
    //make a new array also
    return fields.replaceAll("_", ",").replace(/,*$/, "").split(",");
};

const getUniqueValues = (array1, array2) => {
    const unmatchedValues = array1.filter((value) => !array2.includes(value));
    return unmatchedValues;
};

const ApprovedBenCRApplicationRemarks = ({ applicationId }) => {
    const [crRecords, setCrRecords] = useState([]);
    const [cache, setCache] = useState({});

    const [loading, setLoading] = useState();

    const [show, setShow] = useState(false);

    const [modalTitleData, setModalTitleData] = useState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // const [fields, setFields] = useState();
    const { error, data, isFetching } = useQuery(["get-changed-request-remarks-for-approved-ben", applicationId], () => fetcher(`/get-changed-request-remarks-for-approved-ben/${applicationId}`), { enabled: applicationId ? true : false });

    const { mutate: aadharAlgo } = useMutation({
        mutationFn: (val) => {
            if (cache[val] || cache[val] == "") {
                return cache[val];
            }
            return fetcher(val);
        },
    });

    const getOldChangedRequestData = (crId, fieldsName) => {
        setCrRecords();
        setLoading(true);
        handleShow(true);
        setModalTitleData(`Log of Changed Request details of ${fieldsName} (CR Id : ${crId})`);
        // setFields(fieldsName);
        const url = `/get-changed-records?crId=${crId}&fieldsName=${fieldsName}`;
        aadharAlgo(url, {
            onSuccess(data, variables, context) {
                setCrRecords(data);
                setLoading(false);
                setCache((prev) => {
                    return { ...prev, [url]: data };
                });
            },
            onError(error, variables, context) {
                toast.error(error);
            },
        });
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <div>
            {error && <ErrorAlert error={error} />}
            {isFetching && <LoadingSpinner />}
            {data &&
                (data?.remarks.length > 0 ? (
                    <div style={{ overflow: "auto" }} className="table-container">
                        <Table className="table table-bordered table-sm table-striped">
                            <thead>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>CR No.</th>
                                    <th>Date</th>
                                    <th>Request Type</th>
                                    <th>
                                        Request Status ( <button className="btn btn-sm btn-success disabled p-0">Approved</button>/<button className="btn btn-sm btn-danger disabled p-0">Rejected</button> )
                                    </th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                    {/* <th>Apply Request</th>
                                    <th>Approved/Auto approved Request</th> */}
                                    <th>Action Taken By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.remarks?.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={wrapStyle}>{item.serial_number} </td>
                                            <td style={wrapStyle}>{item.cr_application_id}</td>
                                            <td style={wrapStyle}>{item.remark_date} </td>
                                            <td style={wrapStyle}>
                                                {getOrgFieldsName("SLO_SIDE", item.apply_request).map((_item, _index) => {
                                                    return (
                                                        <div key={_index}>
                                                            <button className="btn btn-sm border-0" style={{ fontSize: "13px" }} onClick={() => getOldChangedRequestData(item.cr_application_id, _item)} disabled>
                                                                {_item}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </td>
                                            <td style={wrapStyle}>
                                                {/* This section is for those option which is not accept by imw */}
                                                {item?.approved_request?.split() &&
                                                    getUniqueValues(getOrgFieldsName("SLO_SIDE", item.apply_request), getOrgFieldsName("IMW_SIDE", JSON.stringify(item.approved_request))).map((imwNotAcceptItem, imwNotAcceptIdex) => {
                                                        return (
                                                            <div key={imwNotAcceptIdex}>
                                                                {imwNotAcceptItem != "Marital Status" && imwNotAcceptItem != "Present Address" && imwNotAcceptItem != "Dependent Details" ? (
                                                                    <button className="btn btn-sm btn-danger text-light  mb-1" style={{ fontSize: "13px" }} disabled>
                                                                        <i className="fa-solid fa-xmark"></i> {imwNotAcceptItem}
                                                                    </button>
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </div>
                                                        );
                                                    })}

                                                {/* This section is for those option which is accept by imw */}
                                                {getOrgFieldsName("IMW_SIDE", JSON.stringify(item.approved_request)) != "" &&
                                                    getOrgFieldsName("IMW_SIDE", JSON.stringify(item.approved_request)).map((_item, _index) => {
                                                        return (
                                                            <div key={_index}>
                                                                <button className="btn btn-sm btn-success text-light  mb-1" style={{ fontSize: "13px" }} onClick={() => getOldChangedRequestData(item.cr_application_id, _item)}>
                                                                    <i className="fa-solid fa-check"></i> {_item}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}

                                                {/* This section when anything is auto approved */}
                                                {item.remark_status.trim() === "A" &&
                                                    getOrgFieldsName("SLO_SIDE", item.apply_request).map((_item, _index) => {
                                                        return (
                                                            <div key={_index}>
                                                                {_item === "Marital Status" || _item === "Present Address" || _item === "Dependent Details" ? (
                                                                    <button className="btn btn-sm btn-success text-light  mb-1" style={{ fontSize: "13px" }} onClick={() => getOldChangedRequestData(item.cr_application_id, _item)}>
                                                                        <i className="fa-solid fa-check"></i> {_item}
                                                                    </button>
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                            </td>
                                            <td style={wrapStyle}>
                                                {item.remark_status.trim() === "S" && "Submitted"}
                                                {item.remark_status.trim() === "A" && "Disposed"}
                                            </td>
                                            <td style={wrapStyle}>
                                                {item.remarks.trim() === "Change Request Submited" || item.remarks.trim() === "Change Request Submitted" ? "" : item.remarks.trim() === "Accepted by Inspector" ? "" : item.remarks}
                                            </td>
                                            <td style={wrapStyle}>{item.remark_by} </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                ) : (
                    <div style={{ display: "flex", justifyContent: "center", color: "#ee2727bd" }}>
                        <i className="fa-solid fa-circle-exclamation" style={{ margin: "3px" }}></i> {data?.message}
                    </div>
                ))}

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} dialogClassName="modal-90w" size="xl" className="rectification_modal ">
                <Modal.Header closeButton style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#fff", color: "#0886e3" }}>
                    <Modal.Title>{modalTitleData}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        maxHeight: "calc(100vh - 210px)",
                        overflowY: "auto",
                        backgroundColor: "#e1e0e0",
                    }}
                >
                    {loading ? <LoadingSpinner /> : <div dangerouslySetInnerHTML={{ __html: crRecords != "" ? crRecords : "No data" }}></div>}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ApprovedBenCRApplicationRemarks;
