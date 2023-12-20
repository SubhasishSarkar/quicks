import React, { useEffect, useState } from "react";
import { useValidate } from "../../hooks";
import ApplicationStatus from "../../components/list/ApplicationStatus";
import FPUploader from "../../components/FPUploader";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, updater } from "../../utils";
import { disableQuery } from "../../data";

import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const TwoSchemeDocUpload = ({ mergedata, checkFileUpload, aadharArray, appId, setPhase1, setPhase2 }) => {
    console.log(mergedata);
    const [merging, setMerging] = useState(false);
    const query = useQueryClient();
    const maxDate = moment().format("2017-03-31");
    const minDate = moment().format("2001-01-01");
    const [enQry, setEnQry] = useState(0);
    const [apiHit, setApiiHit] = useState(false);
    const [form, validator] = useValidate({
        appId: { value: appId, validate: "required" },
        new_aadhaar: { value: "", validate: checkFileUpload.aadhaar_file == 1 ? "required" : "" },
        new_registration_date: { value: "", validate: checkFileUpload.reg_file == 1 ? "required" : "" },
        new_dob: { value: "", validate: checkFileUpload.dob_file == 1 ? "required" : "" },
        aadhaar_file: { value: checkFileUpload.aadhaar_file, validate: "" },
        reg_file: { value: checkFileUpload.reg_file, validate: "" },
        dob_file: { value: checkFileUpload.dob_file, validate: "" },
        one_unapproved: { value: checkFileUpload.one_unapproved, validate: "" },
    });
    const navigate = useNavigate();
    const handleChange = (evt) => {
        validator.validOnChange(evt, async (value, name, setState) => {
            switch (name) {
                case "new_aadhaar":
                    setState((state) => {
                        if (!value) {
                            state.new_aadhaar.error = "Please Select Aadhaar";
                        }
                        return { ...state };
                    });
                    break;
                case "new_dob":
                    setState((state) => {
                        const age = moment().diff(value, "years", false);
                        if (age < 18 || age > 90) state.new_dob.error = "Please provide a valid Date of Birth";
                        return { ...state };
                    });

                    break;
                case "new_registration_date":
                    setState((state) => {
                        if (value) {
                            const validateDate = moment(value).format("YYYY-MM-DD");
                            if (validateDate >= minDate && validateDate <= maxDate) {
                                state.new_registration_date.error = "";
                            } else {
                                state.new_registration_date.error = "Please provide a valid registration date.";
                            }
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const { data } = useQuery(["fetch-two-scheme-document", appId], () => fetcher(`/fetch-two-scheme-document?id=${appId}`), {
        ...disableQuery,
        enabled: enQry > 0 ? true : apiHit ? true : false,
    });

    const handleUploadSuccess = () => {
        setEnQry(1);
        query.invalidateQueries("fetch-two-scheme-document", appId);
    };
    const handleDeleteSuccess = () => {
        setEnQry(2);
        query.invalidateQueries("fetch-two-scheme-document", appId);
    };
    const { mutate } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));

    const mergeTwoSchemeData = (e) => {
        e.preventDefault();
        setApiiHit(true);
        setMerging(true);
        if (!validator.validate()) return setMerging(false);

        const mergedata = validator.generalize();

        if (mergedata?.new_registration_date !== "" && data?.passbook === "") {
            toast.error("Please upload Scheme Passbook Document");
            setMerging(false);
        } else if (mergedata?.new_aadhaar !== "" && data?.aadhar === "") {
            toast.error("Please upload Aadhaar Document");
            setMerging(false);
        } else if (mergedata?.new_dob !== "" && data?.dob === "") {
            toast.error("Please upload DOB Document");
            setMerging(false);
        } else {
            mutate(
                { url: "/confirm-merging-two-scheme", body: mergedata },
                {
                    onSuccess(mergedata) {
                        setPhase2(false);
                        setPhase1(true);
                        setMerging(false);
                        toast.success("SUCCESSFULLY MERGED");
                        navigate("/tagging/two-scheme-list");
                    },
                    onError(error) {
                        toast.error(error.message);
                        setMerging(false);
                    },
                }
            );
        }
    };

    useEffect(() => {
        setApiiHit(true);
    }, [apiHit]);

    return (
        <>
            <div className="card datatable-box">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-sm table-hover">
                            <thead>
                                <tr className="table-active" align="center">
                                    <th scope="col">SL No.</th>
                                    <th scope="col">SSIN</th>
                                    <th scope="col">Registration Number</th>
                                    <th scope="col">Registration Date</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">DOB</th>
                                    <th scope="col">Aadhar</th>
                                    <th scope="col">Worker Type</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Scheme</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mergedata &&
                                    mergedata.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.ssin_no}</td>
                                                <td>{item.old_registration_number}</td>
                                                <td>{item.old_reg_date}</td>
                                                <td>{item.name}</td>
                                                <td>{item.old_date_of_birth}</td>
                                                <td>{item.old_aadhar}</td>
                                                <td>{item.ssin_no == "0" ? "-" : item.worker_type}</td>
                                                <td>{item.ssin_no == "0" ? "-" : <ApplicationStatus status={item.old_status} />}</td>
                                                <td>{item.scheme}</td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <form noValidate>
                    <div className="card-body">
                        <div className="row">
                            {checkFileUpload.aadhaar_file == 1 && (
                                <div className="col-md-4">
                                    <label htmlFor="new_aadhaar" className="form-label">
                                        Select Aadhaar {form.new_aadhaar.required && <span className="text-danger">*</span>}
                                    </label>

                                    <select name="new_aadhaar" id="new_aadhaar" className={`form-select ${form.new_aadhaar.error && "is-invalid"}`} onChange={(e) => handleChange({ name: "new_aadhaar", value: e.currentTarget.value })}>
                                        <option value="">Select One</option>
                                        {aadharArray.map((item) => (
                                            <option value={item} key={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>

                                    <label className="invalid-feedback" htmlFor="new_aadhaar">
                                        {form.new_aadhaar.error}
                                    </label>
                                </div>
                            )}
                            {checkFileUpload.reg_file == 1 && (
                                <div className="col-md-4">
                                    <label htmlFor="new_registration_date" className="form-label">
                                        Registration Date {form.new_registration_date.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="Registration Date"
                                        className={`form-control ${form.new_registration_date.error && "is-invalid"}`}
                                        type="date"
                                        value={form.new_registration_date.value}
                                        name="new_registration_date"
                                        id="new_registration_date"
                                        min={minDate}
                                        max={maxDate}
                                        onChange={(e) =>
                                            handleChange({
                                                name: "new_registration_date",
                                                value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                            })
                                        }
                                    />
                                    <div className="invalid-feedback">{form.new_registration_date.error}</div>
                                </div>
                            )}
                            {checkFileUpload.dob_file == 1 && (
                                <div className="col-md-4">
                                    <label className="form-label" htmlFor="new_dob">
                                        Date of Birth {form.new_dob.required && <span className="text-danger">*</span>}
                                    </label>
                                    <input
                                        placeholder="Date of Birth"
                                        className={`form-control ${form.new_dob.error && "is-invalid"}`}
                                        type="date"
                                        value={form.new_dob.value}
                                        name="new_dob"
                                        id="new_dob"
                                        onChange={(e) =>
                                            handleChange({
                                                name: "new_dob",
                                                value: moment(e.currentTarget.value).format("YYYY-MM-DD"),
                                            })
                                        }
                                    />
                                    <div className="invalid-feedback">{form.new_dob.error}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
                {/* {isLoading && <LoadingOverlay />} */}
                <div className="card-body">
                    <div className="row">
                        {checkFileUpload.aadhaar_file == 1 && (
                            <div className="col-md-4 mb-2">
                                <FPUploader
                                    fileURL={data?.aadhaar}
                                    title="Aadhaar"
                                    maxFileSize="50KB"
                                    description="Upload Document (Max size 50 KB, jpg or jpeg file only, Dimension 150 X 180)"
                                    acceptedFileTypes={["image/jpeg", "image/jpg"]}
                                    name="file"
                                    onUploadSuccessful={() => handleUploadSuccess()}
                                    onDeleteSuccessful={() => handleDeleteSuccess()}
                                    upload={`/upload-two-scheme-document?id=${appId}&type=documents-details&name=aadhaar`}
                                    required={form.new_aadhaar.value ? "true" : "false"}
                                />
                            </div>
                        )}
                        {checkFileUpload.reg_file == 1 && (
                            <div className="col-md-4 mb-2">
                                <FPUploader
                                    fileURL={data?.passbook}
                                    title="Scheme Passbook"
                                    maxFileSize="50KB"
                                    description="Upload Document (Max size 50 KB, jpg or jpeg file only, Dimension 150 X 70)"
                                    acceptedFileTypes={["image/jpeg", "image/jpg"]}
                                    name="file"
                                    onUploadSuccessful={() => handleUploadSuccess()}
                                    onDeleteSuccessful={() => handleDeleteSuccess()}
                                    upload={`/upload-two-scheme-document?id=${appId}&type=documents-details&name=passbook`}
                                    required={form.new_registration_date.value ? "true" : "false"}
                                />
                            </div>
                        )}
                        {checkFileUpload.dob_file == 1 && (
                            <div className="col-md-4 mb-2">
                                <FPUploader
                                    fileURL={data?.dob}
                                    title="DOB Document"
                                    maxFileSize="50KB"
                                    description="Upload Document (Max size 50 KB, jpg or jpeg file only, Dimension 150 X 70)"
                                    acceptedFileTypes={["image/jpeg", "image/jpg"]}
                                    name="file"
                                    onUploadSuccessful={() => handleUploadSuccess()}
                                    onDeleteSuccessful={() => handleDeleteSuccess()}
                                    upload={`/upload-two-scheme-document?id=${appId}&type=documents-details&name=dob`}
                                    required={form.new_dob.value ? "true" : "false"}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="card-footer" style={{ border: "none", backgroundColor: "transparent" }}>
                    <div className="d-grid d-md-flex justify-content-md">
                        <button type="submit" className="btn btn-success btn-sm" onClick={mergeTwoSchemeData}>
                            {merging ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : " CONFIRM MERGING"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TwoSchemeDocUpload;
