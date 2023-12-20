import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useValidate } from "../../hooks";
import { fetcher, searchParamsToObject } from "../../utils";
import WorkerTypeSelect from "../../components/select/WorkerTypeSelect";
import DistrictSelect from "../../components/select/DistrictSelect";
import SubDivSelect from "../../components/select/SubDivSelect";
import BMCNameSelect from "../../components/select/BMCNameSelect";
import GPWardSelect from "../../components/select/GPWardSelect";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../store/slices/headerTitleSlice";
import { useQuery } from "@tanstack/react-query";
import TableList from "../../components/table/TableList";
import BmSsyLoader from "../../components/BmSsyLoader";
import { Modal } from "react-bootstrap";
import BeneficiaryViewDetails from "./ApprovedBeneficiary/BeneficiaryViewDetails";

const OtherBeneficiaryList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Beneficiary List", url: "" }));
    }, []);

    const [searchParams, setSearchParams] = useSearchParams();
    const [show, setShow] = useState(false);
    const [benAppId, setBenAppId] = useState();

    const [form, validator] = useValidate(
        {
            cat_worker_type: { value: "", validate: "required" },
            status: { value: "", validate: "required" },
            collectedBy: { value: "", validate: "" },
            addedBy: { value: "", validate: "" },
            district: { value: "", validate: "required" },
            subDivision: { value: "", validate: "" },
            bmc: { value: "", validate: "" },
            gpWard: { value: "", validate: "" },
            fromDate: { value: "", validate: "required" },
            toDate: { value: "", validate: "required" },
        },
        searchParamsToObject(searchParams)
    );

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const urlSearchParams = new URLSearchParams(formData);
        setSearchParams(urlSearchParams.toString());
    };

    const { data, isFetching, error } = useQuery(["get-beneficiary-list", searchParams.toString()], () => fetcher("/get-beneficiary-list?" + searchParams.toString()), { enabled: searchParams ? true : false });

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };
    const clearParams = (evt) => {
        evt.preventDefault();
        validator.reset();
        setSearchParams("");
        // remove();
    };

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "application_id",
            headerName: "Application Number",
        },
        {
            field: "ssin_no",
            headerName: "SSIN",
        },
        {
            field: "name",
            headerName: "Beneficiary Name",
        },
        {
            field: "aadhar",
            headerName: "Aadhar",
        },
        {
            field: "mobile",
            headerName: "Mobile No.",
        },
        {
            field: "approval_date",
            headerName: "Approved Date",
        },
        {
            field: "last_modified_date",
            headerName: "Submitted Date",
        },
        {
            field: "status",
            headerName: "Current Status",
            renderHeader: (props) => {
                return (
                    <>
                        {props.status.trim() === "A" && <span className="badge rounded-pill text-bg-success">Approved</span>}
                        {props.status.trim() === "B" && <span className="badge rounded-pill text-bg-warning">Back For Correction</span>}
                        {props.status.trim() === "S" && <span className="badge rounded-pill text-bg-secondary">Submitted</span>}
                        {props.status.trim() === "R" && <span className="badge rounded-pill text-bg-danger">Rejected</span>}
                    </>
                );
            },
        },

        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => showModal(props.encAppId)}>
                        View
                    </button>
                );
            },
        },
    ];

    const showModal = (id) => {
        setBenAppId(id);
        setShow(true);
    };

    const { data: modalData } = useQuery(["alc-imw-claim-details-modal-data", benAppId], () => fetcher(`/alc-imw-claim-details-modal-data?id=${benAppId}`), {
        enabled: show ? true : false,
    });

    return (
        <>
            <div className="card datatable-box mb-3">
                <form noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <label htmlFor="cat_worker_type" className="form-label">
                                    Worker Type {form.cat_worker_type.required && <span className="text-danger">*</span>}
                                </label>
                                <WorkerTypeSelect
                                    className={`form-select ${form.cat_worker_type.error && "is-invalid"}`}
                                    id="cat_worker_type"
                                    name="cat_worker_type"
                                    required={form.cat_worker_type.required}
                                    value={form.cat_worker_type.value}
                                    onChange={(e) => handleChange({ name: "cat_worker_type", value: e.currentTarget.value })}
                                    option_all="true"
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.cat_worker_type.error}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-control-label" htmlFor="status">
                                    Status {form.status.required && <span className="text-danger">*</span>}
                                </label>
                                <select
                                    name="status"
                                    id="status"
                                    className={`form-select ${form.status.error && "is-invalid"}`}
                                    value={form.status.value}
                                    required={form.status.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                >
                                    <option value="">Select One</option>
                                    <option value="A">Approved</option>
                                    <option value="0">Submitted</option>
                                    <option value="B">Back for correction</option>
                                    <option value="R">Reject</option>
                                </select>
                                <div id="Feedback" className="invalid-feedback">
                                    {form.status.error}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-control-label" htmlFor="collectedBy">
                                    Collected By {form.collectedBy.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="collectedBy"
                                    name="collectedBy"
                                    className={`form-control ${form.collectedBy.error && "is-invalid"}`}
                                    value={form.collectedBy.value}
                                    required={form.collectedBy.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.collectedBy.error}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-control-label" htmlFor="addedBy">
                                    Added By {form.addedBy.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="text"
                                    id="addedBy"
                                    name="addedBy"
                                    className={`form-control ${form.addedBy.error && "is-invalid"}`}
                                    value={form.addedBy.value}
                                    required={form.addedBy.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.addedBy.error}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="district" className="form-label">
                                    District {form.district.required && <span className="text-danger">*</span>}
                                </label>
                                <DistrictSelect
                                    className={`form-select ${form.district.error && "is-invalid"}`}
                                    id="district"
                                    name="district"
                                    // disabled
                                    required={form.district.required}
                                    value={form.district.value}
                                    onChange={(e) => handleChange({ name: "district", value: e.currentTarget.value })}
                                    option_all="true"
                                />
                                <div className="invalid-feedback">Please select district</div>
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="subDivision" className="form-label">
                                    Sub Division {form.subDivision.required && <span className="text-danger">*</span>}
                                </label>
                                <SubDivSelect
                                    className={`form-select ${form.subDivision.error && "is-invalid"}`}
                                    id="subDivision"
                                    name="subDivision"
                                    // disabled
                                    required={form.subDivision.required}
                                    value={form.subDivision.value}
                                    onChange={(e) => handleChange({ name: "subDivision", value: e.currentTarget.value })}
                                    districtCode={form.district.value}
                                    option_all="true"
                                />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="bmc" className="form-label">
                                    Name of B/M/C {form.bmc.required && <span className="text-danger">*</span>}
                                </label>
                                <BMCNameSelect
                                    className={`form-select ${form.bmc.error && "is-invalid"}`}
                                    id="bmc"
                                    name="bmc"
                                    required={form.bmc.required}
                                    value={form.bmc.value}
                                    onChange={(e) => handleChange({ name: "bmc", value: e.currentTarget.value })}
                                    subDivision={form.subDivision.value}
                                    option_all="true"
                                />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="gpWard" className="form-label">
                                    GP / Ward {form.gpWard.required && <span className="text-danger">*</span>}
                                </label>
                                <GPWardSelect
                                    className={`form-select ${form.gpWard.error && "is-invalid"}`}
                                    id="gpWard"
                                    name="gpWard"
                                    required={form.gpWard.required}
                                    value={form.gpWard.value}
                                    onChange={(e) => handleChange({ name: "gpWard", value: e.currentTarget.value })}
                                    block={form.bmc.value}
                                    option_all="true"
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-control-label" htmlFor="fromDate">
                                    From Date {form.fromDate.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="date"
                                    id="fromDate"
                                    name="fromDate"
                                    className={`form-control ${form.fromDate.error && "is-invalid"}`}
                                    value={form.fromDate.value}
                                    required={form.fromDate.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.fromDate.error}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-control-label" htmlFor="toDate">
                                    To Date {form.toDate.required && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type="date"
                                    id="toDate"
                                    name="toDate"
                                    className={`form-control ${form.toDate.error && "is-invalid"}`}
                                    value={form.toDate.value}
                                    required={form.toDate.required}
                                    onChange={(e) => {
                                        handleChange(e.currentTarget);
                                    }}
                                />
                                <div id="Feedback" className="invalid-feedback">
                                    {form.toDate.error}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-grid  d-md-flex justify-content-md-end gap-2">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isFetching}>
                                {/* {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} */}
                                Search
                            </button>
                            {data && (
                                <button className="btn btn-sm btn-warning" onClick={(evt) => clearParams(evt)}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            {isFetching && <BmSsyLoader />}

            {data && (
                <>
                    <TableList data={data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                </>
            )}

            <Modal backdrop="static" show={show} onHide={() => setShow(false)} dialogClassName="modal-90w" size="xl" aria-labelledby="example-custom-modal-styling-title" className="rectification_modal ">
                <Modal.Header closeButton style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#fff", color: "#0886e3" }}>
                    <Modal.Title>Approved Beneficiary Details</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        maxHeight: "calc(100vh - 210px)",
                        overflowY: "auto",
                    }}
                >
                    <BeneficiaryViewDetails propsId={modalData?.id} propsType={modalData?.type} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default OtherBeneficiaryList;
