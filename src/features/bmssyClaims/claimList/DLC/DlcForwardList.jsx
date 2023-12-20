import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useValidate } from "../../../../hooks";
import { useQuery } from "@tanstack/react-query";
import RloSelect from "../../../../components/select/RloSelect";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import { Button, Modal } from "react-bootstrap";
import FundDetails from "../ALC/funRequestList/FundDetails";
import { fetcher } from "../../../../utils";

function DlcForwardList() {
    const type = "forwarded";
    const [show, setShow] = useState(false);
    const [getId, setGetId] = useState(false);

    const user = useSelector((state) => state.user.user);
    const [form, validator] = useValidate({
        workerType: { value: "", validate: "required" },
        claimType: { value: "", validate: "required" },
        rloCode: { value: "", validate: "required" },
    });
    const [formData, setFormData] = useState();
    const { error, data, isFetching } = useQuery(["alc-fund-request-list", formData, type], () => fetcher(`/alc-fund-request-list?${formData}&type=${type}`), { enabled: formData ? true : false });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        const urlSearchParams = new URLSearchParams(formData);
        setFormData(urlSearchParams.toString());
    };
    const handleChange = (e) => {
        validator.validOnChange(e);
    };
    const modalEventSet = (id) => {
        setShow(true);
        setGetId(id);
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    return (
        <>
            <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                <div className="row mb-2">
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">
                                Worker Type
                            </span>
                            <select
                                id="workerType"
                                name="workerType"
                                className={`form-select ${form.workerType.error && "is-invalid"}`}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                                value={form.workerType.value}
                                required={form.workerType.required}
                            >
                                <option value="">Select</option>
                                <option value="ow">Other Worker</option>
                                <option value="cw">Construction Worker</option>
                                <option value="tw">Transport Worker</option>
                            </select>
                            <div className="invalid-feedback">Please select worker type</div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">
                                Claim Type
                            </span>
                            <select
                                id="claimType"
                                name="claimType"
                                className={`form-select ${form.claimType.error && "is-invalid"}`}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                                value={form.claimType.value}
                                required={form.claimType.required}
                            >
                                <option value="">Select</option>
                                <option value="1">Death</option>
                                <option value="2">Disability</option>
                                <option value="3">PF</option>
                            </select>
                            <div className="invalid-feedback">Please select claim type</div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon3">
                                RLO
                            </span>
                            <RloSelect
                                className={`form-select ${form.rloCode.error && "is-invalid"}`}
                                id="rloCode"
                                name="rloCode"
                                districtCode={user.district}
                                onChange={(e) => {
                                    handleChange(e.currentTarget);
                                }}
                                value={form.rloCode.value}
                                required={form.rloCode.required}
                            />
                            <div className="invalid-feedback">Please select RLO</div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="d-grid mt-1 d-md-flex">
                            <button className="btn btn-primary btn-sm" type="submit" disabled={isFetching}>
                                {isFetching && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} <i className="fa-solid fa-magnifying-glass"></i> Search
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {error && <ErrorAlert error={error} />}
            {isFetching && <LoadingSpinner />}
            {data?.data?.length > 0 && (
                <div style={{ overflow: "auto" }} className="table-container table-responsive">
                    <table className="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>SL No.</th>
                                <th>Fund Request ID</th>
                                <th>Fund Request Date</th>
                                <th>Amount</th>
                                <th>Number Of Beneficiary</th>
                                <th>Created By</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={wrapStyle}>{index + 1}</td>
                                        <td style={wrapStyle}>{item.id}</td>
                                        <td style={wrapStyle}>{item.fdate}</td>
                                        <td style={wrapStyle}>{item.amount}</td>
                                        <td style={wrapStyle}>{item.number_of_application}</td>
                                        <td style={wrapStyle}>{item.fullname}</td>
                                        <td style={wrapStyle}>
                                            <Button variant="success" onClick={() => modalEventSet(item.id)} size="sm">
                                                View Details
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-90w" size="xl" aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">Fund Request Details Of ID : {getId}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        maxHeight: "calc(100vh - 210px)",
                        overflowY: "auto",
                    }}
                >
                    <FundDetails id={getId} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default DlcForwardList;
