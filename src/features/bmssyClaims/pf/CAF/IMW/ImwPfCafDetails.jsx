import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetcher, updater } from "../../../../../utils";
import { useNavigate, useParams } from "react-router";
import LoadingSpinner from "../../../../../components/list/LoadingSpinner";
import ErrorAlert from "../../../../../components/list/ErrorAlert";
import PfCafClaimRemarkStatus from "../../../../../pages/admin/BmssyClaims/PfCafClaimRemarkStatus";
import { Button, Offcanvas } from "react-bootstrap";
import PdfViewer from "../../../../../components/PdfViewer";
import { useValidate } from "../../../../../hooks";
import { CheckBox } from "../../../../../components/form/checkBox";
import { toast } from "react-toastify";

const ImwPfCafDetails = () => {
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

    const [form, validator] = useValidate({
        cafClaimId: { value: id, validate: "" },
        action: { value: "", validate: "required" },
        remark: { value: "", validate: "required" },
        verify: { value: "", validate: "required" },
    });

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
            { url: `/imw-pf-caf-from-action-submit`, body: formData },
            {
                onSuccess(data, variables, context) {
                    if (data.action === "B") {
                        toast.success(data.msg);
                        navigate("/claim/list?type=CAF Submitted During Claim&caf-type=Caf Back For Correction");
                    } else if (data.action === "R") {
                        toast.success(data.msg);
                        navigate("/claim/list?type=CAF Submitted During Claim&caf-type=Caf Rejected");
                    } else if (data.action === "A") {
                        toast.success(data.msg);
                        navigate("/claim/list?type=CAF Submitted During Claim&caf-type=Caf Approved");
                    }
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
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
                                            <td style={wrapStyle}>{data?.val?.pinCode}</td>
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
                            <div style={{ overflow: "auto" }} className="table-container table-responsive">
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
                            <div style={{ overflow: "auto" }} className="table-container table-responsive">
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

                    {data?.val.status === "Submitted" && (
                        <div className="card datatable-box shadow mb-2">
                            <div className="card-header py-2">
                                <h5 className="m-0 font-weight-bold text-white">Your Action </h5>
                            </div>
                            <div className="card-body">
                                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-check mb-2">
                                                <label className="form-label" htmlFor="action">
                                                    Select Action {form.action.required && <span className="text-danger">*</span>}
                                                </label>
                                                <select
                                                    id="action"
                                                    name="action"
                                                    className={`form-select ${form.action.error && "is-invalid"}`}
                                                    onChange={(e) => {
                                                        handleChange(e.currentTarget);
                                                    }}
                                                    value={form.action.value}
                                                    required={form.action.required}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="A">Approve</option>
                                                    <option value="B">Back for Rectification</option>
                                                    <option value="R">Reject</option>
                                                </select>
                                                <div className="invalid-feedback">{form.action.error}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-4">
                                            <div className="form-check mb-2">
                                                <label className="form-label" htmlFor="remark">
                                                    Enter Remark {form.remark.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input className={`form-control ${form.remark.error && "is-invalid"}`} type="text" value={form.remark.value} name="remark" id="remark" onChange={(e) => handleChange(e.currentTarget)} />
                                                <div className="invalid-feedback">{form.remark.error}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-check">
                                                <CheckBox.Group
                                                    value={form.verify.value}
                                                    onChange={(value) => {
                                                        handleChange({ name: "verify", value: [...value] });
                                                    }}
                                                >
                                                    <div className="form-check">
                                                        <CheckBox className={`form-check-input ${form.verify.error && "is-invalid"}`} value="verify" name="verify" id="verify" required={form.verify.required} />
                                                        <label className="form-check-label" htmlFor="verify">
                                                            <h6> All relevant documents have been received in hard copy.</h6>
                                                        </label>
                                                        <div className="invalid-feedback">
                                                            <i className="fa-solid fa-triangle-exclamation"></i> Check this checkbox
                                                        </div>
                                                    </div>
                                                </CheckBox.Group>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <div className="d-grid  justify-content-md-end">
                                                    <button className="btn btn-success" type="submit" disabled={isLoading}>
                                                        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <PfCafClaimRemarkStatus id={id} />
                </div>
            )}
        </>
    );
};

export default ImwPfCafDetails;
