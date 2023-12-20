import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import { useValidate } from "../../../../hooks";
import { fetcher, updater } from "../../../../utils";
import ImwAadhaarDetails from "./ImwAadhaarDetails";
import ImwBankView from "./ImwBankView";
import ImwDependentView from "./ImwDependentView";
import ImwMaritalDetails from "./ImwMaritalDetails";
import ImwNomineeView from "./ImwNomineeView";
import ImwPermanentAdd from "./ImwPermanentAdd";
import ImwPresentAdd from "./ImwPresentAdd";
import NameAndDobView from "./NameAndDobView";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import NoDataFound from "../../../../components/list/NoDataFound";
import OffcanvasPdfViewer from "../../../../components/OffcanvasPdfViewer";

const ImwCrDetailsView = () => {
    const { id } = useParams();
    const { error, data, isFetching } = useQuery(["imw-cr-details-data", id], () => fetcher(`/imw-cr-details-data?crId=${id}`));
    const { error: remarksError, data: remarksData, isFetching: remarksFetching } = useQuery(["cr-remarks", id], () => fetcher(`/cr-remarks?id=${id}`), { enabled: data ? true : false });
    const { error: docError, data: docData, isFetching: docFetching } = useQuery(["cr-documents-preview", id], () => fetcher(`/cr-documents-preview?id=${data?.arrData?.encCrId}`), { enabled: data ? true : false });
    const fieldsArray = data?.arrData?.arrFields ? data?.arrData?.arrFields : "";

    const [form, validator] = useValidate({
        radioCrBank: { value: "", validate: "" },
        radioCrAadhaar: { value: "", validate: "" },
        radioCrName: { value: "", validate: "" },
        radioCrNominee: { value: "", validate: "" },
        radioCrPerAdd: { value: "", validate: "" },
        remark: { value: "", validate: "" },
        crId: { value: id, validate: "" },
    });

    const [radioBank, setRadioBank] = useState();
    const [radioAadhar, setRadioAadhar] = useState();
    const [radioName, setRadioName] = useState();
    const [radioNominee, setRadioNominee] = useState();
    const [radioAddress, setRadioAddress] = useState();
    const [remarksState, setRemarksState] = useState(true);

    useEffect(() => {
        if (true === radioBank || true === radioAadhar || true === radioName || true === radioNominee || true === radioAddress) {
            setRemarksState(false);
            validator.setState((state) => {
                state.remark.required = true;
                state.remark.validate = "required";
                return { ...state };
            });
        } else {
            setRemarksState(true);
            validator.setState((state) => {
                state.remark.required = false;
                state.remark.validate = "";
                state.remark.value = "";
                state.remark.error = null;
                return { ...state };
            });
        }
    }, [radioBank, radioAadhar, radioName, radioNominee, radioAddress]);

    const handleChange = (evt) => {
        validator.validOnChange(evt, async (value, name) => {
            switch (name) {
                case "radioCrBank":
                    if (value === "notAccept") {
                        setRadioBank(true);
                    } else if (value === "accept") {
                        setRadioBank(false);
                    }
                    break;
                case "radioCrAadhaar":
                    if (value === "notAccept") {
                        setRadioAadhar(true);
                    } else if (value === "accept") {
                        setRadioAadhar(false);
                    }
                    break;
                case "radioCrName":
                    if (value === "notAccept") {
                        setRadioName(true);
                    } else if (value === "accept") {
                        setRadioName(false);
                    }
                    break;
                case "radioCrNominee":
                    if (value === "notAccept") {
                        setRadioNominee(true);
                    } else if (value === "accept") {
                        setRadioNominee(false);
                    }
                    break;
                case "radioCrPerAdd":
                    if (value === "notAccept") {
                        setRadioAddress(true);
                    } else if (value === "accept") {
                        setRadioAddress(false);
                    }
                    break;
            }
        });
    };

    useEffect(() => {
        if (fieldsArray.includes("aadhar_number")) {
            validator.setState((state) => {
                state.radioCrAadhaar.required = true;
                state.radioCrAadhaar.validate = "required";
                return { ...state };
            });
        } else {
            validator.setState((state) => {
                state.radioCrAadhaar.required = false;
                state.radioCrAadhaar.validate = "";
                return { ...state };
            });
        }

        if (fieldsArray.includes("name_and_DOB")) {
            validator.setState((state) => {
                state.radioCrName.required = true;
                state.radioCrName.validate = "required";
                return { ...state };
            });
        } else {
            validator.setState((state) => {
                state.radioCrAadhaar.required = false;
                state.radioCrName.validate = "";
                return { ...state };
            });
        }

        if (fieldsArray.includes("permanent_address")) {
            validator.setState((state) => {
                state.radioCrPerAdd.required = true;
                state.radioCrPerAdd.validate = "required";
                return { ...state };
            });
        } else {
            validator.setState((state) => {
                state.radioCrPerAdd.required = false;
                state.radioCrPerAdd.validate = "";
                return { ...state };
            });
        }

        if (fieldsArray.includes("nominee_details")) {
            validator.setState((state) => {
                state.radioCrNominee.required = true;
                state.radioCrNominee.validate = "required";
                return { ...state };
            });
        } else {
            validator.setState((state) => {
                state.radioCrNominee.required = false;
                state.radioCrNominee.validate = "";
                return { ...state };
            });
        }

        if (fieldsArray.includes("bank_details")) {
            validator.setState((state) => {
                state.radioCrBank.required = true;
                state.radioCrBank.validate = "required";
                return { ...state };
            });
        } else {
            validator.setState((state) => {
                state.radioCrBank.required = false;
                state.radioCrBank.validate = "";
                return { ...state };
            });
        }
    }, [fieldsArray]);

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return toast.error("Please select your preference for every tabs.");
        const formData = validator.generalize();
        mutate(
            { url: `/cr-imw-final-submit`, body: formData },
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
        dispatch(setPageAddress({ title: "Changed Request List", url: "/change-request/list", subTitle: "Changed Request Details", subUrl: "" }));
    }, []);

    const benViewDetails = (appId, isActive, newBlock, oldBlock) => {
        if (newBlock.trim() !== oldBlock.trim()) {
            toast.warning("This beneficiary not in your jurisdiction.");
            return;
        } else {
            const url = `/v2/beneficiary-details/${appId}/${isActive === 1 ? "bmssy" : "ssy"}`;
            window.open(url, "_blank", "noreferrer");
        }
    };

    const [show, setShow] = useState(false);

    const [doc, setDoc] = useState();
    const [url, setUrl] = useState();

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setShow(true);
        setDoc(e.currentTarget.getAttribute("name"));
        setUrl(e.currentTarget.getAttribute("url"));
    };

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="card datatable-box mb-2">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-8">
                                    <h5 className="m-0">
                                        Changed Request Details of {"  "}
                                        <small className="d-inline-flex px-1 py-1 fw-semibold bg-opacity-10 rounded-2 text-light bg-info bg-opacity-50 border border-success border-opacity-10">{data?.arrData?.approved_name}</small>
                                    </h5>
                                </div>
                                <div className="col-md-4 d-grid d-md-flex justify-content-md-end">
                                    <button
                                        className="btn btn-sm btn-warning"
                                        type="button"
                                        onClick={() => benViewDetails(data?.arrData?.encAppId, data?.arrData?.is_active, data?.arrData?.permanentAddressNew[0].block, data?.arrData?.permanentAddressOld[0].block)}
                                    >
                                        <i className="fa-solid fa-arrow-up-right-from-square"></i> View all approved details
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-9">
                                    <div className="card-nav-tabs">
                                        {fieldsArray && (
                                            <Tabs>
                                                {fieldsArray.includes("aadhar_number") && (
                                                    <Tab eventKey="1" title="Aadhaar">
                                                        <ImwAadhaarDetails data={data?.arrData} form={form} handleChange={handleChange} />
                                                    </Tab>
                                                )}
                                                {fieldsArray.includes("bank_details") && (
                                                    <Tab eventKey="2" title="Bank">
                                                        <ImwBankView data={data?.arrData} form={form} handleChange={handleChange} />
                                                    </Tab>
                                                )}
                                                {(fieldsArray.includes("name_and_DOB") || fieldsArray.includes("name_and_date")) && (
                                                    <Tab eventKey="3" title="Name & Dob">
                                                        <NameAndDobView data={data?.arrData} form={form} handleChange={handleChange} />
                                                    </Tab>
                                                )}
                                                {(fieldsArray.includes("permanent_address") || fieldsArray.includes("parmanent_address")) && (
                                                    <Tab eventKey="4" title="Permanent Address">
                                                        <ImwPermanentAdd data={data?.arrData} newData={data?.arrData?.permanentAddressNew} oldData={data?.arrData?.permanentAddressOld} form={form} handleChange={handleChange} />
                                                    </Tab>
                                                )}
                                                {fieldsArray.includes("nominee_details") && (
                                                    <Tab eventKey="5" title="Nominee">
                                                        <ImwNomineeView data={data?.arrData} form={form} handleChange={handleChange} />
                                                    </Tab>
                                                )}
                                                {(fieldsArray.includes("marital_status") || fieldsArray.includes("present_address") || fieldsArray.includes("Dependency_details")) && (
                                                    <Tab eventKey="6" title="Auto Approved" className="scroll--simple" style={{ overflowX: "auto", height: "390px" }}>
                                                        <p className="text-center auto_approved_msg">
                                                            <i className="fa-solid fa-triangle-exclamation fa-beat-fade auto_approved_msg_icn"></i> All these changes in this section are automatically approved by the system.
                                                        </p>
                                                        {fieldsArray.includes("marital_status") && <ImwMaritalDetails data={data?.arrData} />}
                                                        {fieldsArray.includes("present_address") && <ImwPresentAdd newData={data?.arrData?.presentAddressNew} oldData={data?.arrData?.presentAddressOld} />}
                                                        {fieldsArray.includes("Dependency_details") && <ImwDependentView data={data?.arrData} />}
                                                    </Tab>
                                                )}
                                            </Tabs>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card-nav-tabs">
                                        <Tabs>
                                            <Tab eventKey="0" title="Documents Details">
                                                {docFetching && <LoadingSpinner />}
                                                {docError && <ErrorAlert error={docError} />}
                                                {docData && docData?.count > 0 ? (
                                                    <>
                                                        <div className="row p-0 m-0">
                                                            {docData?.aadhar != "" && (
                                                                <Button variant="light btn-sm mb-1 border-secondary" onClick={handleShow} name="Aadhar" url={docData?.aadhar}>
                                                                    <div className="col-12 d-flex justify-content-md-center">
                                                                        <p className="lh-1 text-uppercase fs-7 fw-semibold text-dark" style={{ margin: "8px" }}>
                                                                            <i className="fa-solid fa-file-lines"></i> Aadhar
                                                                        </p>
                                                                    </div>
                                                                </Button>
                                                            )}
                                                            {docData?.nominee != "" && (
                                                                <Button variant="light btn-sm mb-1 border-secondary" onClick={handleShow} name="Nominee Declaration" url={docData?.nominee}>
                                                                    <div className="col-12 d-flex justify-content-md-center">
                                                                        <p className="lh-1 text-uppercase fs-7 fw-semibold text-dark" style={{ margin: "8px" }}>
                                                                            <i className="fa-solid fa-file-lines"></i> Nominee Declaration
                                                                        </p>
                                                                    </div>
                                                                </Button>
                                                            )}

                                                            {docData?.passbook != "" && (
                                                                <Button variant="light btn-sm mb-1 border-secondary" onClick={handleShow} name="Bank Passbook" url={docData?.passbook}>
                                                                    <div className="col-12 d-flex justify-content-md-center">
                                                                        <p className="lh-1 text-uppercase fs-7 fw-semibold text-dark" style={{ margin: "8px" }}>
                                                                            <i className="fa-solid fa-file-lines"></i> Bank Passbook
                                                                        </p>
                                                                    </div>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    !docFetching && <NoDataFound />
                                                )}
                                            </Tab>
                                        </Tabs>
                                        <OffcanvasPdfViewer show={show} handleClose={handleClose} doc={doc} url={process.env.APP_BASE + url} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {data?.arrData?.status != "A" && (
                            <div className="col-md-6">
                                <div className="card datatable-box mb-2">
                                    <div className="card-header py-2">
                                        <h5 className="m-0">Your Action</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="form-group">
                                                <div className="col-md-12">
                                                    <label className="form-control-label" htmlFor="remark">
                                                        Enter Remark {form.remark.required && <span className="text-danger">*</span>}
                                                    </label>
                                                    <textarea
                                                        type="text"
                                                        className={`form-control ${form.remark.error && "is-invalid"}`}
                                                        name="remark"
                                                        id="remark"
                                                        required={form.remark.required}
                                                        value={form.remark.value}
                                                        onChange={(e) => handleChange(e.currentTarget)}
                                                        disabled={remarksState}
                                                    />
                                                    <div className="invalid-feedback">{form.remark.error}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="d-grid d-md-flex justify-content-md-end">
                                            <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                                {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className={data?.arrData?.status === "A" ? "col-md-12" : "col-md-6"}>
                            {remarksFetching && <LoadingSpinner />}
                            {remarksError && <ErrorAlert error={remarksError} />}
                            {remarksData && data?.status != "I" && (
                                <div className="card datatable-box mb-4">
                                    <div className="card-header py-2">
                                        <div className="row">
                                            <div className="col-6">
                                                <h5 className="m-0">Remarks</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table  table-bordered table-sm">
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
                                                                <td>{item.remark_status?.trim() === "A" ? "Disposed" : "Submitted"}</td>
                                                                <td style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{item.remarks}</td>
                                                                <td>{moment(item.remark_date).format("DD-MM-YYYY")}</td>
                                                                <td style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
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
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default ImwCrDetailsView;
