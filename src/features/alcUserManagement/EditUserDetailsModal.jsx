import React from "react";
import { Modal } from "react-bootstrap";
import ErrorAlert from "../../components/list/ErrorAlert";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, updater } from "../../utils";
import { useValidate } from "../../hooks";
import { toast } from "react-toastify";
import DistrictSelect from "../../components/select/DistrictSelect";
import AsyncSelect from "../../components/select/AsyncSelect";

const EditUserDetailsModal = ({ lgShow, userId, handleClose, otherData }) => {
    const { error, data } = useQuery(["users-management-edit-employee", userId], () => fetcher(`/users-management-edit-employee?id=${userId}`), { enabled: userId ? true : false });

    const [form, validator] = useValidate(
        {
            fullname: { value: "", validate: "required" },
            employeeId: { value: "", validate: "required|number" },
            mobile: { value: "", validate: "required|number|length:10" },
            mail: { value: "", validate: "email" },
            designation: { value: "", validate: "required" },
            userName: { value: "", validate: "required" },
            userId: { value: userId, validate: "" },
            bankAccountNo: { value: "", validate: "required" },
            bankName: { value: "", validate: "required" },
            bankIfscCode: { value: "", validate: "required" },
            bankBranchName: { value: "", validate: "required" },
            bankDistrictCode: { value: "", validate: "required" },
            bankLocation: { value: "", validate: "required" },
            pan: { value: "", validate: "required" },
            role: { value: "", validate: "" },
        },
        data,
        true
    );

    const autoPopulate = (item) => {
        validator.setState((state) => {
            state.bankName.value = item.bank_name || "";
            state.bankBranchName.value = item.branch_name || "";
            state.bankDistrictCode.value = item.dist_code || "";
            state.bankLocation.value = item.branch_address || "";
            return { ...state };
        });
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const query = useQueryClient();
    const handleInfoSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const infoData = validator.generalize();

        mutate(
            { url: `/users-management-update-employee`, body: { data: infoData, changeType: 2 } },
            {
                onSuccess(data, variables, context) {
                    handleClose(false);
                    query.invalidateQueries("users-management-list");
                    toast.success("Info Successfully Updated");
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };
    return (
        <>
            <Modal size="lg" show={lgShow} onHide={handleClose} backdrop="static" aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        <b>Edit Info</b>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <ErrorAlert error={error} />}
                    {data && (
                        <form noValidate onSubmit={handleInfoSubmit}>
                            <div className="card">
                                <div className="card-header" style={{ fontSize: "20px" }}>
                                    {" "}
                                    <b>
                                        <i
                                            className="fa-solid fa-user-tie"
                                            style={{
                                                backgroundColor: "#fff",
                                                padding: "8px",
                                                borderRadius: "19px",
                                                color: "black",
                                                marginRight: "7px",
                                            }}
                                        ></i>
                                    </b>
                                    {otherData}
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="fullname">
                                                    Full Name {form.fullname.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input type="text" id="fullname" name="fullname" className={`form-control ${form.fullname.error && "is-invalid"}`} value={form.fullname.value} required={form.fullname.required} disabled />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.fullname.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="employeeId">
                                                    Employee Id {form.employeeId.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input type="text" id="employeeId" name="employeeId" className={`form-control ${form.employeeId.error && "is-invalid"}`} value={form.employeeId.value} required={form.employeeId.required} disabled />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.employeeId.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="mobile">
                                                    Mobile {form.mobile.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="mobile"
                                                    name="mobile"
                                                    className={`form-control ${form.mobile.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.mobile.value}
                                                    required={form.mobile.required}
                                                />

                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.mobile.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="mail">
                                                    e-Mail {form.mail.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="mail"
                                                    name="mail"
                                                    className={`form-control ${form.mail.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.mail.value}
                                                    required={form.mail.required}
                                                />

                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.mail.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="role">
                                                    Change Role {form.role.required && <span className="text-danger">*</span>}
                                                </label>
                                                <select name="role" value={form.role.value} className="form-control" onChange={(e) => handleChange({ name: "role", value: e.currentTarget.value })}>
                                                    <option value="">Select One</option>
                                                    <option value="23">Collecting Agent</option>
                                                    <option value="13">SLO</option>
                                                </select>

                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.role.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="bankIfscCode">
                                                    Bank IFSC Code {form.bankIfscCode.required && <span className="text-danger">*</span>}
                                                </label>
                                                <AsyncSelect
                                                    className={form.bankIfscCode.error && "is-invalid"}
                                                    loadOptions={async (value) => {
                                                        try {
                                                            const data = await fetcher(`/bank-ifsc-suggestion?ifsc=${value}`);
                                                            return data.map((item) => ({ ...item, value: `${item.ifsc_code} ${item.bank_name} ${item.branch_name}`, key: item.ifsc_code }));
                                                        } catch (error) {
                                                            return [];
                                                        }
                                                    }}
                                                    onItemSubmit={autoPopulate}
                                                    id="bankIfscCode"
                                                    value={form.bankIfscCode.value}
                                                    onChange={(value) => handleChange({ name: "bankIfscCode", value: value })}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.bankIfscCode.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="bankName">
                                                    Bank Name {form.userName.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="bankName"
                                                    name="bankName"
                                                    className={`form-control ${form.bankName.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.bankName.value}
                                                    required={form.bankName.required}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.bankName.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="bankBranchName">
                                                    Bank Branch Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="bankBranchName"
                                                    name="bankBranchName"
                                                    className={`form-control ${form.bankBranchName.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.bankBranchName.value}
                                                    required={form.bankBranchName.required}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.bankBranchName.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="bankDistrictCode">
                                                    Bank District Name {form.bankDistrictCode.required && <span className="text-danger">*</span>}
                                                </label>
                                                <DistrictSelect
                                                    className={`form-select ${form.bankDistrictCode.error && "is-invalid"}`}
                                                    id="bankDistrictCode"
                                                    name="bankDistrictCode"
                                                    required={form.bankDistrictCode.required}
                                                    value={form.bankDistrictCode.value}
                                                    onChange={(e) => handleChange({ name: "bankDistrictCode", value: e.currentTarget.value })}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.bankDistrictCode.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="bankLocation">
                                                    Bank Location {form.bankLocation.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="bankLocation"
                                                    name="bankLocation"
                                                    className={`form-control ${form.bankLocation.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.bankLocation.value}
                                                    required={form.bankLocation.required}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.bankLocation.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="bankAccountNo">
                                                    Bank Account No.{form.bankAccountNo.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="bankAccountNo"
                                                    name="bankAccountNo"
                                                    className={`form-control ${form.bankAccountNo.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.bankAccountNo.value}
                                                    required={form.bankAccountNo.required}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.bankAccountNo.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <div className="form-group">
                                                <label className="form-control-label" htmlFor="pan">
                                                    PAN {form.pan.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="pan"
                                                    name="pan"
                                                    className={`form-control ${form.pan.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.pan.value}
                                                    required={form.pan.required}
                                                    disabled={data.pan !== null && data.pan !== "" ? true : false}
                                                />
                                                <div id="Feedback" className="invalid-feedback">
                                                    {form.pan.error}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <div className="d-grid mt-2 d-md-flex justify-content-md-end">
                                                    <button className="btn btn-success" type="submit" disabled={isLoading}>
                                                        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                                        Update
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default EditUserDetailsModal;
