import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { CheckBox } from "../../../../components/form/checkBox";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import { useValidate } from "../../../../hooks";
import { fetcher, updater } from "../../../../utils";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import OffcanvasPdfViewer from "../../../../components/OffcanvasPdfViewer";

const FinalReviewPage = () => {
    const { id } = useParams();
    const { error, data, isFetching } = useQuery(["cr-final-preview", id], () => fetcher(`/cr-final-preview?id=${id}`));

    // Fetch nominee data//
    const {
        data: nomineeData,
        error: nomineeError,
        isFetching: nomineeFetch,
    } = useQuery(["previous-nominee-list", data?.application_id, id], () => fetcher(`/previous-nominee-list?id=${data?.application_id}&crId=${id}`), { enabled: data ? true : false });

    //Fetch dependent data//
    const {
        error: dependentError,
        data: dependentData,
        isFetching: dependentFetch,
    } = useQuery(["previous-dependent-list", data?.application_id], () => fetcher(`/previous-dependent-list?id=${data?.application_id}`), { enabled: data ? true : false });

    //Fetch documents data//
    const { error: preViewError, data: preViewData, isFetching: preViewFetching } = useQuery(["cr-documents-preview", id], () => fetcher(`/cr-documents-preview?id=${id}`), { enabled: data ? true : false });
    //Fetch remarks data//
    const { error: remarksError, data: remarksData, isFetching: remarksFetching } = useQuery(["cr-remarks", id], () => fetcher(`/cr-remarks?id=${id}`), { enabled: data?.status.trim() != "I" ? true : false });

    const { data: approvedSelectedData, error: approvedSelectedError } = useQuery(["get-approved-check-fields", id], () => fetcher(`/get-approved-check-fields?id=${id}`), { enabled: data ? true : false });

    /************************************* This section use for : In which cases documents are showing *****************************/
    const [docSection, setDocSection] = useState(false);
    useEffect(() => {
        if (data?.fieldsArray.includes("name_and_DOB") || data?.fieldsArray.includes("aadhar_number") || data?.fieldsArray.includes("permanent_address") || data?.fieldsArray.includes("bank_details") || data?.fieldsArray.includes("nominee_details")) {
            setDocSection(true);
        }
    }, [data]);

    /************************************* This section use for: automatically scroll to submit button *****************************/
    const divRef = useRef(null);
    useEffect(() => {
        if (data?.status === "I") divRef.current.scrollIntoView({ behavior: "smooth" });
    });

    /****************************************** Documents Review Section Start Here ******************************************/
    const [show, setShow] = useState(false);

    const [doc, setDoc] = useState();
    const [url, setUrl] = useState();

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setShow(true);
        setDoc(e.currentTarget.getAttribute("name"));
        setUrl(e.currentTarget.getAttribute("url"));
    };

    /****************************************** Form submit Section Start Here ******************************************/
    const [form, validator] = useValidate({
        behalf: { value: [], validate: "required" },
        fields: { value: "", validate: "" },
        crId: { value: "", validate: "" },
    });

    useEffect(() => {
        if (data)
            validator.setState((state) => {
                state.fields.value = data?.fieldsArray;
                state.crId.value = id;
                return { ...state };
            });
    }, [data]);

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();

        mutate(
            { url: `/cr-slo-final-submit`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success(data.msg);
                    navigate(`/change-request/list`);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    const dispatch = useDispatch();
    useEffect(() => {
        if (data?.status === "I") {
            dispatch(setPageAddress({ title: "Changed Request", url: "/change-request/entry", subTitle: "Final Preview", subUrl: "" }));
        } else {
            dispatch(setPageAddress({ title: "Changed Request List", url: "/change-request/list", subTitle: "Submitted Changed Request Preview", subUrl: "" }));
        }
    }, [data?.status]);

    const [bmcType, setBmcType] = useState();
    useEffect(() => {
        const dataBmcOld = data?.permanent_address?.permanentAddressOld[0]?.block_type;
        const dataBmcNew = data?.permanent_address?.permanentAddressNew[0]?.block_type;

        const dataBmcOldPresent = data?.present_address?.presentAddressOld[0]?.block_type;
        const dataBmcNewPresent = data?.present_address?.presentAddressNew[0]?.block_type;

        if (data) {
            switch (dataBmcOld || dataBmcNew || dataBmcOldPresent || dataBmcNewPresent) {
                case "B":
                    setBmcType("Block");
                    break;
                case "M":
                    setBmcType("Municipal");
                    break;

                case "C":
                    setBmcType("Corporation");
                    break;

                default:
                    break;
            }
        }
    }, [data]);

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}

            {data?.fieldsArray.includes("name_and_DOB") && (
                <div className="card datatable-box mb-2">
                    <div className="card-header py-2">
                        <div className="row">
                            <div className="col-6">
                                <h5 className="m-0 text-white">Name And Date Of Birth</h5>
                            </div>
                            <div className="col-6 imw_given_status">
                                <span className="d-md-flex justify-content-md-end">
                                    {error && <ErrorAlert error={approvedSelectedError} />}
                                    {data?.status === "A" && approvedSelectedData?.includes("nameAndDate") ? (
                                        <Badge pill bg="success" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                                <i className="fa-solid fa-thumbs-up"></i> Approved By IMW
                                            </p>
                                        </Badge>
                                    ) : data?.status === "I" ? (
                                        <Badge pill bg="warning" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-dark fw-semibold imw_given_status_p">Require IMW Approval</p>
                                        </Badge>
                                    ) : data?.status === "S" ? (
                                        <Badge pill bg="warning" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-dark fw-semibold imw_given_status_p">Pending For Approval</p>
                                        </Badge>
                                    ) : (
                                        <Badge pill bg="danger" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                                <i className="fa-solid fa-thumbs-down"></i> Not approved by IMW
                                            </p>
                                        </Badge>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <tbody>
                                    <tr>
                                        <th>Fields Name </th>
                                        <th>Previously Approved Data</th>
                                        <th>Changed Request Data</th>
                                    </tr>
                                    <tr>
                                        <th>Name</th>
                                        <td>{data?.name_and_DOB?.nameAndDateOld[0].name}</td>
                                        <td>{data?.name_and_DOB?.nameAndDateNew[0].name}</td>
                                    </tr>
                                    <tr>
                                        <th>Date Of Birth</th>
                                        <td>{data?.name_and_DOB?.nameAndDateOld[0].dob}</td>
                                        <td>{data?.name_and_DOB?.nameAndDateNew[0].dob}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {data?.fieldsArray.includes("aadhar_number") && (
                <div className="card datatable-box mb-2">
                    <div className="card-header py-2">
                        <div className="row">
                            <div className="col-6">
                                <h5 className="m-0 text-white">Aadhar Number </h5>
                            </div>
                            <div className="col-6 imw_given_status">
                                <span className="d-md-flex justify-content-md-end">
                                    <span className="d-md-flex justify-content-md-end">
                                        {error && <ErrorAlert error={approvedSelectedError} />}
                                        {data?.status === "A" && approvedSelectedData?.includes("aadharNumber") ? (
                                            <Badge pill bg="success" style={{ border: "1px solid" }}>
                                                <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                                    <i className="fa-solid fa-thumbs-up"></i> Approved By IMW
                                                </p>
                                            </Badge>
                                        ) : data?.status === "I" ? (
                                            <Badge pill bg="warning" style={{ border: "1px solid" }}>
                                                <p className="mb-0 text-dark fw-semibold imw_given_status_p">Require IMW Approval</p>
                                            </Badge>
                                        ) : data?.status === "S" ? (
                                            <Badge pill bg="warning" style={{ border: "1px solid" }}>
                                                <p className="mb-0 text-dark fw-semibold imw_given_status_p">Pending For Approval</p>
                                            </Badge>
                                        ) : (
                                            <Badge pill bg="danger" style={{ border: "1px solid" }}>
                                                <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                                    <i className="fa-solid fa-thumbs-down"></i> Not approved by IMW
                                                </p>
                                            </Badge>
                                        )}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <tbody>
                                    <tr>
                                        <th>Fields Name</th>
                                        <th>Previously Approved Data</th>
                                        <th>Changed Request Data</th>
                                    </tr>
                                    <tr>
                                        <th>Aadhaar</th>
                                        <td>{data?.aadhar_number?.aadharNumberOld[0].aadharNumber}</td>
                                        <td>{data?.aadhar_number?.aadharNumberNew[0].aadharNumber}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {data?.fieldsArray.includes("marital_status") && (
                <div className="card datatable-box mb-2">
                    <div className="card-header py-2">
                        <div className="row">
                            <div className="col-6">
                                <h5 className="m-0 text-white">Marital Status</h5>
                            </div>
                            <div className="col-6 imw_given_status">
                                <span className="d-md-flex justify-content-md-end">
                                    <Badge pill bg="success" style={{ border: "1px solid" }}>
                                        <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                            <i className="fa-solid fa-thumbs-up"></i> Approved By System
                                        </p>
                                    </Badge>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <tbody>
                                    <tr>
                                        <th>Fields Name</th>
                                        <th>Previously Approved Data</th>
                                        <th>Changed Request Data</th>
                                    </tr>
                                    <tr>
                                        <th>Marital Status</th>
                                        <td>{data?.marital_status?.maritalStatusOld[0].maritalStatus}</td>
                                        <td>{data?.marital_status?.maritalStatusNew[0].maritalStatus}</td>
                                    </tr>
                                    <tr>
                                        <th>Husband Name</th>
                                        <td>{data?.marital_status?.maritalStatusOld[0].husbandName}</td>
                                        <td>{data?.marital_status?.maritalStatusNew[0].husbandName}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {data?.fieldsArray.includes("permanent_address") && (
                <div className="card datatable-box mb-2">
                    <div className="card-header py-2">
                        <div className="row">
                            <div className="col-6">
                                <h5 className="m-0 text-white">Permanent Address</h5>
                            </div>
                            <div className="col-6 imw_given_status">
                                <span className="d-md-flex justify-content-md-end">
                                    {error && <ErrorAlert error={approvedSelectedError} />}
                                    {data?.status === "A" && approvedSelectedData?.includes("parmanentAddress") ? (
                                        <Badge pill bg="success" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                                <i className="fa-solid fa-thumbs-up"></i> Approved By IMW
                                            </p>
                                        </Badge>
                                    ) : data?.status === "I" ? (
                                        <Badge pill bg="warning" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-dark fw-semibold imw_given_status_p">Require IMW Approval</p>
                                        </Badge>
                                    ) : data?.status === "S" ? (
                                        <Badge pill bg="warning" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-dark fw-semibold imw_given_status_p">Pending For Approval</p>
                                        </Badge>
                                    ) : (
                                        <Badge pill bg="danger" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                                <i className="fa-solid fa-thumbs-down"></i> Not approved by IMW
                                            </p>
                                        </Badge>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <tbody>
                                    <tr>
                                        <th>Fields Name</th>
                                        <th>Previously Approved Data</th>
                                        <th>Changed Request Data</th>
                                    </tr>
                                    <tr>
                                        <th>District</th>
                                        <td>{data?.permanent_address?.permanentAddressOld[0].district}</td>
                                        <td>{data?.permanent_address?.permanentAddressNew[0].district}</td>
                                    </tr>
                                    <tr>
                                        <th>Subdivision</th>
                                        <td>{data?.permanent_address?.permanentAddressOld[0].subdivision}</td>
                                        <td>{data?.permanent_address?.permanentAddressNew[0].subdivision}</td>
                                    </tr>
                                    <tr>
                                        <th>Block</th>
                                        <td>{data?.permanent_address?.permanentAddressOld[0].block}</td>
                                        <td>{data?.permanent_address?.permanentAddressNew[0].block}</td>
                                    </tr>
                                    <tr>
                                        <th>BMC Type</th>
                                        <td>{bmcType}</td>
                                        <td>{bmcType}</td>
                                    </tr>
                                    <tr>
                                        <th>Gp/Ward</th>
                                        <td>{data?.permanent_address?.permanentAddressOld[0].gp}</td>
                                        <td>{data?.permanent_address?.permanentAddressNew[0].gp}</td>
                                    </tr>
                                    <tr>
                                        <th>Post Office</th>
                                        <td>{data?.permanent_address?.permanentAddressOld[0].po}</td>
                                        <td>{data?.permanent_address?.permanentAddressNew[0].po}</td>
                                    </tr>
                                    <tr>
                                        <th>Police Station</th>
                                        <td>{data?.permanent_address?.permanentAddressOld[0].ps}</td>
                                        <td>{data?.permanent_address?.permanentAddressNew[0].ps}</td>
                                    </tr>
                                    <tr>
                                        <th>Pin Code</th>
                                        <td>{data?.permanent_address?.permanentAddressOld[0].pin}</td>
                                        <td>{data?.permanent_address?.permanentAddressNew[0].pin}</td>
                                    </tr>
                                    <tr>
                                        <th>address</th>
                                        <td>{data?.permanent_address?.permanentAddressOld[0].hvsr}</td>
                                        <td>{data?.permanent_address?.permanentAddressNew[0].hvsr}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {data?.fieldsArray.includes("present_address") && (
                <div className="card datatable-box mb-2">
                    <div className="card-header py-2">
                        <div className="row">
                            <div className="col-6">
                                <h5 className="m-0 text-white">Present Address</h5>
                            </div>
                            <div className="col-6 imw_given_status">
                                <span className="d-md-flex justify-content-md-end">
                                    <Badge pill bg="success" style={{ border: "1px solid" }}>
                                        <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                            <i className="fa-solid fa-thumbs-up"></i> Approved By System
                                        </p>
                                    </Badge>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <tbody>
                                    <tr>
                                        <th>Fields Name</th>
                                        <th>Previously Approved Data</th>
                                        <th>Changed Request Data</th>
                                    </tr>
                                    <tr>
                                        <th>District</th>
                                        <td>{data?.present_address?.presentAddressOld[0].district}</td>
                                        <td>{data?.present_address?.presentAddressNew[0].district}</td>
                                    </tr>
                                    <tr>
                                        <th>Subdivision</th>
                                        <td>{data?.present_address?.presentAddressOld[0].subdivision}</td>
                                        <td>{data?.present_address?.presentAddressNew[0].subdivision}</td>
                                    </tr>
                                    <tr>
                                        <th>Block</th>
                                        <td>{data?.present_address?.presentAddressOld[0].block}</td>
                                        <td>{data?.present_address?.presentAddressNew[0].block}</td>
                                    </tr>
                                    <tr>
                                        <th>B/M/C Type</th>
                                        <td>{bmcType}</td>
                                        <td>{bmcType}</td>
                                    </tr>
                                    <tr>
                                        <th>Gp/Ward</th>
                                        <td>{data?.present_address?.presentAddressOld[0].gp}</td>
                                        <td>{data?.present_address?.presentAddressNew[0].gp}</td>
                                    </tr>
                                    <tr>
                                        <th>Post Office</th>
                                        <td>{data?.present_address?.presentAddressOld[0].po}</td>
                                        <td>{data?.present_address?.presentAddressNew[0].po}</td>
                                    </tr>
                                    <tr>
                                        <th>Police Station</th>
                                        <td>{data?.present_address?.presentAddressOld[0].ps}</td>
                                        <td>{data?.present_address?.presentAddressNew[0].ps}</td>
                                    </tr>
                                    <tr>
                                        <th>Pin Code</th>
                                        <td>{data?.present_address?.presentAddressOld[0].pin}</td>
                                        <td>{data?.present_address?.presentAddressNew[0].pin}</td>
                                    </tr>
                                    <tr>
                                        <th>address</th>
                                        <td>{data?.present_address?.presentAddressOld[0].hvsr}</td>
                                        <td>{data?.present_address?.presentAddressNew[0].hvsr}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {data?.fieldsArray.includes("bank_details") && (
                <div className="card datatable-box mb-2">
                    <div className="card-header py-2">
                        <div className="row">
                            <div className="col-6">
                                <h5 className="m-0 text-white">Bank Details</h5>
                            </div>
                            <div className="col-6 imw_given_status">
                                <span className="d-md-flex justify-content-md-end">
                                    {error && <ErrorAlert error={approvedSelectedError} />}
                                    {data?.status === "A" && approvedSelectedData?.includes("bankDetails") ? (
                                        <Badge pill bg="success" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                                <i className="fa-solid fa-thumbs-up"></i> Approved By IMW
                                            </p>
                                        </Badge>
                                    ) : data?.status === "I" ? (
                                        <Badge pill bg="warning" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-dark fw-semibold imw_given_status_p">Require IMW Approval</p>
                                        </Badge>
                                    ) : data?.status === "S" ? (
                                        <Badge pill bg="warning" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-dark fw-semibold imw_given_status_p">Pending For Approval</p>
                                        </Badge>
                                    ) : (
                                        <Badge pill bg="danger" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                                <i className="fa-solid fa-thumbs-down"></i> Not approved by IMW
                                            </p>
                                        </Badge>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <tbody>
                                    <tr>
                                        <th>Fields Name</th>
                                        <th>Previously Approved Data</th>
                                        <th>Changed Request Data</th>
                                    </tr>
                                    <tr>
                                        <th>IFSC</th>
                                        <td>{data?.bank_details?.bankOld[0].ifsc}</td>
                                        <td>{data?.bank_details?.bankNew[0].ifsc}</td>
                                    </tr>
                                    <tr>
                                        <th>Name</th>
                                        <td>{data?.bank_details?.bankOld[0].name}</td>
                                        <td>{data?.bank_details?.bankNew[0].name}</td>
                                    </tr>
                                    <tr>
                                        <th>Branch</th>
                                        <td>{data?.bank_details?.bankOld[0].branch}</td>
                                        <td>{data?.bank_details?.bankNew[0].branch}</td>
                                    </tr>
                                    <tr>
                                        <th>Location</th>
                                        <td style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{data?.bank_details?.bankOld[0].location}</td>
                                        <td style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{data?.bank_details?.bankNew[0].location}</td>
                                    </tr>
                                    <tr>
                                        <th>District</th>
                                        <td>{data?.bank_details?.bankOld[0].bnkDis}</td>
                                        <td>{data?.bank_details?.bankNew[0].bnkDis}</td>
                                    </tr>
                                    <tr>
                                        <th>Account No.</th>
                                        <td>{data?.bank_details?.bankOld[0].account}</td>
                                        <td>{data?.bank_details?.bankNew[0].account}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {nomineeFetch && <LoadingSpinner />}
            {nomineeError && <ErrorAlert error={nomineeError} />}
            {data?.fieldsArray.includes("nominee_details") && nomineeData && (
                <div className="card datatable-box mb-2">
                    <div className="card-header py-2">
                        <div className="row">
                            <div className="col-6">
                                <h5 className="m-0 text-white">Nominee</h5>
                            </div>
                            <div className="col-6 imw_given_status">
                                <span className="d-md-flex justify-content-md-end">
                                    {error && <ErrorAlert error={approvedSelectedError} />}
                                    {data?.status === "A" && approvedSelectedData?.includes("nomineeDetails") ? (
                                        <Badge pill bg="success" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                                <i className="fa-solid fa-thumbs-up"></i> Approved By IMW
                                            </p>
                                        </Badge>
                                    ) : data?.status === "I" ? (
                                        <Badge pill bg="warning" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-dark fw-semibold imw_given_status_p">Require IMW Approval</p>
                                        </Badge>
                                    ) : data?.status === "S" ? (
                                        <Badge pill bg="warning" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-dark fw-semibold imw_given_status_p">Pending For Approval</p>
                                        </Badge>
                                    ) : (
                                        <Badge pill bg="danger" style={{ border: "1px solid" }}>
                                            <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                                <i className="fa-solid fa-thumbs-down"></i> Not approved by IMW
                                            </p>
                                        </Badge>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Nominee Name</th>
                                        <th>Relationship</th>
                                        <th>Share</th>
                                        <th>Gender</th>
                                        <th>DOB (Age)</th>
                                        <th>Bank Details</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nomineeData.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{1 + index}</td>
                                                <td>{item.nominee_name}</td>
                                                {item.nominee_relationship === "Other" && (
                                                    <td>
                                                        {item.nominee_relationship} : {item.other_name}
                                                    </td>
                                                )}
                                                {item.nominee_relationship != "Other" && <td>{item.nominee_relationship}</td>}
                                                <td>{item.nominee_share}</td>
                                                <td>{item.nominee_gender}</td>
                                                <td>
                                                    {moment(item.nominee_dob).format("DD-MM-YYYY")} ({item.nominee_age})
                                                </td>
                                                <td>
                                                    Account No : {item.nominee_bank_account_no} <br />
                                                    IFSC : {item.nominee_bank_ifsc_code} <br />
                                                    Bank Name : {item.nominee_bank_name} <br />
                                                    Branch Name : {item.nominee_bank_branch_name}
                                                    {item.is_deleted}
                                                </td>
                                                {item?.approvedCrDetailsFrom === "log" && (
                                                    <td>
                                                        {(item.new_status.trim() === "A" || item.new_status.trim() === "0" || item.new_status === null) && (
                                                            <>
                                                                <span className="badge rounded-pill text-bg-success">{approvedSelectedData?.length > 0 ? "Previously Approved" : "Current Approved"} </span>
                                                                <br />
                                                                {item.is_deleted === true && <span className="badge rounded-pill text-bg-danger">Request To Delete</span>}
                                                            </>
                                                        )}
                                                        {approvedSelectedData?.length > 0
                                                            ? item.new_status.trim() === "S" && (
                                                                  <>
                                                                      <span className="badge rounded-pill text-bg-warning mb-1">Changed Request</span>
                                                                      <br />
                                                                      <span className="badge rounded-pill text-bg-success">Current Approved</span>
                                                                  </>
                                                              )
                                                            : item.new_status.trim() === "S" && <span className="badge rounded-pill text-bg-warning">Changed Request</span>}
                                                    </td>
                                                )}
                                                {item?.approvedCrDetailsFrom === "master" && (item.flag_status.trim() === "R" || item.flag_status.trim() === "0") && item.new_status.trim() != "D" ? (
                                                    <td>
                                                        {item.is_deleted === true ? (
                                                            <>
                                                                <Badge bg="success">Previously Approved</Badge> <Badge bg="danger">Inactive</Badge>
                                                            </>
                                                        ) : (
                                                            <Badge bg="success">Current Approved</Badge>
                                                        )}
                                                    </td>
                                                ) : (
                                                    ""
                                                )}
                                                {item?.approvedCrDetailsFrom === "master" && item.new_status.trim() === "D" && (item.flag_status.trim() === "R" || item.flag_status.trim() === "0") && (
                                                    <td>
                                                        <Badge bg="success">Previously Approved</Badge>
                                                    </td>
                                                )}
                                                {item?.approvedCrDetailsFrom === "master" && item.new_status.trim() === "S" && item.flag_status.trim() === "CR" ? (
                                                    <td>
                                                        <Badge bg="warning" text="dark">
                                                            Change Request
                                                        </Badge>
                                                    </td>
                                                ) : (
                                                    ""
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {dependentFetch && <LoadingSpinner />}
            {dependentError && <ErrorAlert error={dependentError} />}
            {data?.fieldsArray.includes("Dependency_details") && dependentData && (
                <div className="card datatable-box mb-2">
                    <div className="card-header py-2">
                        <div className="row">
                            <div className="col-6">
                                <h5 className="m-0 text-white">Dependent</h5>
                            </div>
                            <div className="col-6 imw_given_status">
                                <span className="d-md-flex justify-content-md-end">
                                    <Badge pill bg="success" style={{ border: "1px solid" }}>
                                        <p className="mb-0 text-light fw-semibold imw_given_status_p">
                                            <i className="fa-solid fa-thumbs-up"></i> Approved By System
                                        </p>
                                    </Badge>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Dependent Name</th>
                                        <th>Relationship</th>
                                        <th>Gender</th>
                                        <th>DOB</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dependentData.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1} </td>
                                                <td>{item.depedent_name} </td>
                                                {item.depedent_relationship === "Other" && (
                                                    <td>
                                                        {item.depedent_relationship} : {item.other_name}
                                                    </td>
                                                )}
                                                {item.depedent_relationship != "Other" && <td>{item.depedent_relationship}</td>}

                                                <td>{item.depedent_gender} </td>
                                                <td>{item.depedent_dob} </td>
                                                {(item.flag_status.trim() === "R" || item.flag_status.trim() === "0") && item.status.trim() != "D" ? (
                                                    <td>
                                                        <span className="badge rounded-pill text-bg-success">Approved</span>
                                                    </td>
                                                ) : (
                                                    ""
                                                )}
                                                {item.status.trim() === "D" && (item.flag_status.trim() === "R" || item.flag_status.trim() === "0") ? (
                                                    <td>
                                                        <span className="badge rounded-pill text-bg-warning">Previously Approve</span>
                                                    </td>
                                                ) : (
                                                    ""
                                                )}
                                                {item.status.trim() === "S" && item.flag_status.trim() === "CR" ? (
                                                    <td>
                                                        <span className="badge rounded-pill text-bg-warning">Changed</span>
                                                    </td>
                                                ) : (
                                                    ""
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {preViewFetching && <LoadingSpinner />}
            {preViewError && <ErrorAlert error={preViewError} />}
            {docSection && preViewData && (
                <div className="card datatable-box mb-2">
                    <div className="card-header py-2">
                        <div className="row">
                            <div className="col-12">
                                <h5 className="m-0 text-white">Uploaded Documents</h5>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        {parseInt(preViewData?.count) === 0 ? (
                            <div className="d-flex justify-content-md-center">
                                <button className="btn btn-sm btn-primary" onClick={() => navigate("/change-request/documents/" + id)}>
                                    <i className="fa-solid fa-cloud-arrow-up"></i> Upload Documents
                                </button>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>Document Name</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {preViewData?.aadhar && (
                                            <tr>
                                                <>
                                                    <td>Aadhaar</td>
                                                    <td>
                                                        <Button variant="primary" onClick={handleShow} name="Aadhaar" url={preViewData?.aadhar} size="sm">
                                                            view
                                                        </Button>
                                                    </td>
                                                </>
                                            </tr>
                                        )}
                                        {preViewData?.passbook && (
                                            <tr>
                                                <>
                                                    <td>Bank Passbook</td>
                                                    <td>
                                                        <Button variant="primary" onClick={handleShow} name="Bank Passbook" url={preViewData?.passbook} size="sm">
                                                            view
                                                        </Button>
                                                    </td>
                                                </>
                                            </tr>
                                        )}
                                        {preViewData?.nominee && (
                                            <tr>
                                                <>
                                                    <td>Nominee Declaration</td>
                                                    <td>
                                                        <Button variant="primary" onClick={handleShow} name="Nominee Declaration" url={preViewData?.nominee} size="sm">
                                                            view
                                                        </Button>
                                                    </td>
                                                </>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <OffcanvasPdfViewer show={show} handleClose={handleClose} doc={doc} url={process.env.APP_BASE + url} />

            {data?.status === "I" && (
                <form onSubmit={handleSubmit} noValidate>
                    <div className="card">
                        <div className="card-body">
                            <div className="col-md-12" ref={divRef}>
                                <div className="form-check">
                                    <CheckBox.Group
                                        value={form.behalf.value}
                                        onChange={(value) => {
                                            handleChange({ name: "behalf", value: [...value] });
                                        }}
                                    >
                                        <div className="form-check">
                                            <CheckBox className={`form-check-input ${form.behalf.error && "is-invalid"}`} value="yes" name="behalf" id="behalf" required={form.behalf.required} />
                                            <label className="form-check-label" htmlFor="behalf">
                                                <h6> I do here by submit the application on behalf of the beneficiary on his/her request.</h6>
                                            </label>
                                        </div>
                                    </CheckBox.Group>
                                    {/* <div className="invalid-feedback">
                                        <i className="fa-solid fa-triangle-exclamation"></i> {form.behalf.error}
                                    </div> */}
                                    <div className="d-grid d-md-flex justify-content-md-start">
                                        <button className="btn btn-success btn-sm" type="submit">
                                            {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Verify And Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <span className="text-wrap fw-normal lh-1 font-monospace">
                                <i className="fa-solid fa-circle-info"></i> Aadhar Number, Name & DOB, Permanent Address, Bank Details and Nominee Details are pending for approval and other will be automatically approved by system.
                            </span>
                        </div>
                    </div>
                </form>
            )}

            {remarksFetching && <LoadingSpinner />}
            {remarksError && <ErrorAlert error={remarksError} />}
            {remarksData && data?.status != "I" && (
                <div className="card datatable-box mb-2">
                    <div className="card-header py-2">
                        <div className="row">
                            <div className="col-6">
                                <h5 className="m-0 text-white">Remarks</h5>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Current Status</th>
                                        <th>Remarks</th>
                                        <th>Date</th>
                                        <th>Remarks By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {remarksData.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{1 + index}</td>
                                                <td>{item.status === "A" ? "Approved" : "Submitted"}</td>
                                                <td>{item.remarks}</td>
                                                <td>{moment(item.remark_date).format("DD-MM-YYYY")}</td>
                                                <td>
                                                    {item.remark_by_hrms_employee_id} ({item.remark_by_name ? item.remark_by_name : ""})
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FinalReviewPage;
