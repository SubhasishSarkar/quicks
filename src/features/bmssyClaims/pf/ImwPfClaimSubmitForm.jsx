import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { fetcher, updater } from "../../../utils";
import { useValidate } from "../../../hooks";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { CheckBox } from "../../../components/form/checkBox";
import LoadingSpinner from "../../../components/list/LoadingSpinner";
import FPUploader from "../../../components/FPUploader";
import moment from "moment";

const ImwPfClaimSubmitForm = ({ id, data }) => {
    const [closingAmount, setClosingAmount] = useState("");
    const [excessAmount, setExcessAmount] = useState(0);
    const [setErrColor, setSetErrColor] = useState(false);
    const [finalAmtExc, setFinalAmtExc] = useState("");
    const [loading, setLoading] = useState(false);
    const { data: checkChronological, isLoading: loadingChronological } = useQuery(["check-chronological-order", id], () => fetcher(`/check-chronological-order?id=${id}&status='1'`));

    const claimType = data?.basicDetails?.claim_for;
    const claimBy = data?.basicDetails?.claim_by;
    const { data: preViewData } = useQuery(["claim-documents-preview", id, claimType, claimBy], () => fetcher(`/claim-documents-preview?id=${id}&claimType=${claimType}&claimBy=${claimBy}`));

    const [form, validator] = useValidate({
        first_subscription_date: { value: "", validate: "" },
        action: { value: "", validate: "required" },
        remark: { value: "", validate: "required" },
        excRemark: { value: "", validate: "" },
        hardCopy: { value: "", validate: "required" },
        id: { value: id, validate: "" },
        claimType: { value: "Pf", validate: "" },
        approve_share: { value: "", validate: "" },
        excess: { value: excessAmount, validate: "" },
        ssy_closing_balance: { value: closingAmount, validate: "" },
        finalAmount: { value: finalAmtExc, validate: "" },
        twoSchemStdt: { value: data?.startDate ? data?.startDate : "", validate: "" },
        upto_date: { value: data?.applicantDetails?.upto_date, validate: "required" },
    });

    console.log(data?.applicantDetails?.approve_share);
    useEffect(() => {
        validator.setState((state) => {
            if (checkChronological) state.excRemark.validate = "required";
            return { ...state };
        });
    }, [checkChronological]);

    useEffect(() => {
        validator.setState((state) => {
            if (data?.basicDetails?.new_reg === 0 && data?.basicDetails?.worker_type != "ow") {
                state.first_subscription_date.required = "required";
            } else {
                state.first_subscription_date.required = "";
            }
            if (data?.applicantDetails?.approve_share) {
                state.approve_share.value = data?.applicantDetails?.approve_share;
            } else {
                state.approve_share.value = "";
            }
            return { ...state };
        });
    }, [data]);

    console.log("->" + form.approve_share.value);

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "action":
                    setState((state) => {
                        if (value != "A") {
                            state.first_subscription_date.required = false;
                            state.first_subscription_date.validate = "";
                            state.first_subscription_date.value = "";
                            state.first_subscription_date.error = null;

                            // state.approve_share.required = false;
                            // state.approve_share.validate = "";
                            // state.approve_share.value = "";
                            // state.approve_share.error = null;
                        } else {
                            if (data?.basicDetails?.new_reg === 0 && data?.basicDetails?.worker_type != "ow") {
                                state.first_subscription_date.required = true;
                                state.first_subscription_date.validate = "required";
                                state.first_subscription_date.value = "";
                                state.first_subscription_date.error = null;
                            } else {
                                state.first_subscription_date.required = false;
                                state.first_subscription_date.validate = "";
                                state.first_subscription_date.value = "";
                                state.first_subscription_date.error = null;
                            }

                            if (data?.basicDetails?.type_of_claim === "12") {
                                state.approve_share.required = true;
                                state.approve_share.validate = "required";
                            } else {
                                state.approve_share.required = false;
                                state.approve_share.validate = "";
                                state.approve_share.value = "";
                                state.approve_share.error = null;
                            }
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();

        console.log(formData);

        mutate(
            { url: `/imw-from-action-submit`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success(data.msg);
                    navigate("/claim/list");
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    const query = useQueryClient();
    const afterSuccess = (docName) => {
        query.invalidateQueries("claim-documents-preview");
        toast.success(docName + " uploaded successfully");
    };

    const afterDelete = (docName) => {
        toast.success(docName + " remove successfully");
        query.invalidateQueries("claim-documents-preview");
    };

    const pfDataForCalculation = (name, value) => {
        validator.setState((state) => {
            if (name === "closing_amount") {
                setFinalAmtExc("");
                setClosingAmount(value);
                state.ssy_closing_balance.value = value;
            }
            if (name === "excess_amount") {
                setExcessAmount(value);
                state.excess.value = value;
            }
            return { ...state };
        });
    };

    const pfCalculation = async () => {
        if (!closingAmount && !excessAmount) {
            setSetErrColor(true);
            toast.error("Please enter closing amount.");
        }

        if (Number(closingAmount) >= 0) {
            if (new Date(data?.applicantDetails?.upto_date) < new Date("2020-04-01")) {
                setFinalAmtExc(closingAmount);
                validator.setState((state) => {
                    state.finalAmount.value = closingAmount;

                    return { ...state };
                });
            } else {
                setLoading(true);
                let dtl;
                if (data?.twoschemeExists == 0) {
                    dtl = await fetcher("/bmssyCalculatePFClosing?opening=" + closingAmount + "&&upto_date=" + data?.applicantDetails?.upto_date);
                } else {
                    dtl = await fetcher("/bmssyCalculatePFClosing?opening=" + closingAmount + "&&upto_date=" + data?.applicantDetails?.upto_date + "&&start_date=" + data?.startDate);
                }
                if (dtl.status == true) {
                    setLoading(false);
                    setFinalAmtExc(dtl.total_closing_amount);
                    validator.setState((state) => {
                        state.finalAmount.value = dtl.total_closing_amount;
                        state.twoSchemStdt.value = data?.startDate ? data?.startDate : "";
                        return { ...state };
                    });
                } else {
                    setLoading(false);
                    toast.error("Try Again");
                }
            }
        }
    };

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };

    const [otherDocumentReady, setOtherDocumentReady] = useState(false);

    const setOtherDocumentReadyFunction = (cb) => {
        setOtherDocumentReady(cb);
    };

    return (
        <>
            {loadingChronological && <LoadingSpinner />}

            <div className="card mb-2">
                <div className="card-header">PF Information</div>
                <div className="card-body">
                    <div className="card  mb-3">
                        <div className="section_title">
                            <strong>PF Details</strong>
                        </div>
                        <div className="card-body">
                            <div style={{ overflow: "auto" }} className="table-container table-responsive">
                                <table className="table table-bordered table-sm">
                                    <thead>
                                        <tr className="text-center">
                                            <th>Date Of Birth</th>
                                            <th>Maturity Date</th>
                                            <th>
                                                Total Calculated Amount <br />
                                                (Upto {data?.applicantDetails?.upto_date_1})
                                            </th>
                                            <th>
                                                Total Excess Amount <br />
                                                (Upto {data?.applicantDetails?.upto_date_1})
                                            </th>
                                            <th>Total Payable Amount</th>
                                            <th>
                                                Amount Payable from {data?.basicDetails?.workerTypeBoard} <br />
                                                Upto {data?.applicantDetails?.upto_date_1}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="text-center">
                                            <td style={wrapStyle}>{data?.applicantDetails?.date_of_birth}</td>
                                            <td style={wrapStyle}>{data?.applicantDetails?.maturity_dt}</td>
                                            <td style={wrapStyle} className="bg-info text-light">
                                                {data?.old_ben == 0 ? data?.claim_amount : data?.applicantDetails?.claim_amount ? data?.applicantDetails?.claim_amount : "----"}
                                            </td>
                                            <td style={wrapStyle} className="bg-warning text-dark">
                                                {data?.applicantDetails?.excess_amount ? data?.applicantDetails?.excess_amount : "----"}
                                            </td>
                                            <td style={wrapStyle} className="bg-primary text-light">
                                                {data?.payable_amount ? data?.payable_amount : "----"}
                                            </td>
                                            <td style={wrapStyle} className="bg-success text-light">
                                                {data?.applicantDetails?.approved_amount ? data?.applicantDetails?.approved_amount : "----"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {data?.old_ben == 1 && (
                        <div className="card shadow">
                            <div className="section_title">
                                <strong>Closing Amount Calculation</strong>
                            </div>

                            <div className="card-body">
                                <div style={{ overflow: "auto" }} className="table-container table-responsive">
                                    <table className="table table-bordered table-sm">
                                        <thead>
                                            <tr className="text-center">
                                                <th>
                                                    Opening Balance As <br />
                                                    On {data?.last_interest_date}
                                                </th>
                                                <th>
                                                    Calculate PF <br />
                                                    Amount upto date
                                                </th>
                                                <th>
                                                    Closing Amount Upto 31-03-2020/
                                                    <br /> Date of Death/ Maturity Date
                                                </th>
                                                <th>Excess Amount</th>
                                                <th>
                                                    Final Amount <br />
                                                    Excluding Excess
                                                </th>
                                                <th>
                                                    Click to <br /> calculate
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="text-center">
                                                <td style={wrapStyle}>
                                                    <input type="text" name="opening_balance" className="form-control" aria-describedby="basic-addon" value={data?.claim_amount} disabled />
                                                </td>
                                                <td style={wrapStyle}>
                                                    <input type="text" name="amount_upto_date" className="form-control" aria-describedby="basic-addon3" value={data?.applicantDetails?.upto_date_1} disabled />
                                                </td>
                                                <td style={wrapStyle}>
                                                    <input
                                                        type="text"
                                                        name="closing_amount"
                                                        className={setErrColor && (!closingAmount || !Number(closingAmount)) ? "form-control is-invalid" : "form-control"}
                                                        aria-describedby="basic-addon1"
                                                        placeholder=""
                                                        onKeyUp={(e) => pfDataForCalculation(e.target.name, e.target.value)}
                                                    />
                                                </td>
                                                <td style={wrapStyle}>
                                                    <input
                                                        type="text"
                                                        name="excess_amount"
                                                        className="form-control"
                                                        // className={setErrColor && (!excessAmount || !Number(excessAmount)) ? "form-control is-invalid" : "form-control"}
                                                        aria-describedby="basic-addon1"
                                                        placeholder=""
                                                        onKeyUp={(e) => pfDataForCalculation(e.target.name, e.target.value)}
                                                    />
                                                </td>
                                                <td style={wrapStyle}>
                                                    <input type="text" name="final_amt_exc" className="form-control" aria-describedby="basic-addon" value={finalAmtExc} disabled />
                                                </td>
                                                <td colSpan="1">
                                                    <button className="btn btn-primary btn-sm" onClick={pfCalculation} disabled={loading}>
                                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid  fa-calculator"></i>} Calculate
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="card datatable-box mb-2">
                <div className="card-header">Please Submit Your Action</div>
                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="row">
                                    <div className="col-md-6 mb-2">
                                        <div className="form-check">
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
                                                <option value="B">Back for Rectification</option>
                                                <option value="A">Forward to ALC for approval</option>

                                                <option value="R">Recommend for Rejection to ALC</option>
                                            </select>
                                            <div className="invalid-feedback">{form.action.error}</div>
                                        </div>
                                    </div>

                                    {form.action.value === "A" && data?.basicDetails.worker_type != "ow" && data?.basicDetails?.new_reg == "0" && (
                                        <div className="col-md-6 mb-2">
                                            <div className="form-check">
                                                <label htmlFor="first_subscription_date" className="form-label">
                                                    First Date Of PF Subscription {form.first_subscription_date.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    placeholder=""
                                                    className={`form-control ${form.first_subscription_date.error && "is-invalid"}`}
                                                    type="date"
                                                    value={form.first_subscription_date.value}
                                                    name="first_subscription_date"
                                                    id="first_subscription_date"
                                                    min="2017-04-01"
                                                    onChange={(e) =>
                                                        handleChange({
                                                            name: "first_subscription_date",
                                                            value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                                        })
                                                    }
                                                />
                                                <div className="invalid-feedback">{form.first_subscription_date.error}</div>
                                            </div>
                                        </div>
                                    )}

                                    {form.action.value === "A" && data?.basicDetails?.type_of_claim == "12" && (
                                        <div className="col-md-6">
                                            <div className="form-check mb-2">
                                                <label className="form-label" htmlFor="approve_share">
                                                    Approved Share {form.approve_share.required && <span className="text-danger">*</span>}
                                                </label>
                                                <input
                                                    className={`form-control ${form.approve_share.error && "is-invalid"}`}
                                                    type="text"
                                                    value={form.approve_share.value}
                                                    name="approve_share"
                                                    id="approve_share"
                                                    onChange={(e) => handleChange(e.currentTarget)}
                                                />
                                                <div className="invalid-feedback">{form.approve_share.error}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-md-6 mb-2">
                                        <div className="form-check ">
                                            <label className="form-label" htmlFor="remark">
                                                Enter Remark {form.remark.required && <span className="text-danger">*</span>}
                                            </label>
                                            <input className={`form-control ${form.remark.error && "is-invalid"}`} type="text" value={form.remark.value} name="remark" id="remark" onChange={(e) => handleChange(e.currentTarget)} />
                                            <div className="invalid-feedback">{form.remark.error}</div>
                                        </div>
                                    </div>
                                    {checkChronological && (
                                        <div className="col-md-6 mb-2">
                                            <div className="form-check">
                                                <label className="form-label" htmlFor="excRemark">
                                                    Enter Exception Remark {checkChronological && <span className="text-danger">*</span>}
                                                </label>
                                                <input className={`form-control ${form.excRemark.error && "is-invalid"}`} type="text" value={form.excRemark.value} name="excRemark" id="excRemark" onChange={(e) => handleChange(e.currentTarget)} />
                                                <div className="invalid-feedback">{form.excRemark.error}</div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <label className="form-label" htmlFor="excRemark">
                                                Please clarify {form.hardCopy.required && <span className="text-danger">*</span>}
                                            </label>
                                            <CheckBox.Group
                                                value={form.hardCopy.value}
                                                onChange={(value) => {
                                                    handleChange({ name: "hardCopy", value: [...value] });
                                                }}
                                            >
                                                <div className="form-check">
                                                    <CheckBox className={`form-check-input ${form.hardCopy.error && "is-invalid"}`} value="hardCopy" name="hardCopy" id="hardCopy" required={form.hardCopy.required} />
                                                    <label className="form-check-label" htmlFor="hardCopy">
                                                        <span> All relevant documents have been received in hard copy.</span>
                                                    </label>
                                                    <div className="invalid-feedback">
                                                        <i className="fa-solid fa-triangle-exclamation"></i> Check this checkbox
                                                    </div>
                                                </div>
                                            </CheckBox.Group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <FPUploader
                                    fileURL={preViewData?.imwOtherDocument ? process.env.APP_BASE + preViewData?.imwOtherDocument : ""}
                                    title="Copy of any other document"
                                    maxFileSize="150KB"
                                    description="Please upload pdf only. File size must be under 150 KB"
                                    acceptedFileTypes={["application/pdf"]}
                                    name="enquiryReport"
                                    onUploadSuccessful={() => afterSuccess("Other Document")}
                                    onDeleteSuccessful={() => afterDelete("Other Document")}
                                    upload={`/claim-documents-upload?id=${id}&name=IMW_other_doc&claimType=${claimType}`}
                                    isFileReadyToUpload={setOtherDocumentReadyFunction}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <div className="d-grid d-md-flex justify-content-md-end">
                            <button className="btn btn-success btn-sm" type="submit" disabled={isLoading || otherDocumentReady}>
                                {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ImwPfClaimSubmitForm;
