import React, { useEffect, useState } from "react";
import { useValidate } from "../../hooks";
import AadhaarNumberForm from "./changedRequestForms/sloEnds/AadhaarNumberForm";
import NameAndDobForm from "./changedRequestForms/sloEnds/NameAndDobForm";
import MaritalStatusForm from "./changedRequestForms/sloEnds/MaritalStatusForm";
import PermanentAddressForm from "./changedRequestForms/sloEnds/PermanentAddressForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher, updater } from "../../utils";
import { disableQuery } from "../../data";
import PresentAddressForm from "./changedRequestForms/sloEnds/PresentAddressForm";
import BankForm from "./changedRequestForms/sloEnds/BankForm";
import NomineeForm from "./changedRequestForms/sloEnds/NomineeForm";
import NomineeAddEditModal from "./changedRequestForms/sloEnds/NomineeAddEditModal";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/list/LoadingSpinner";
import ErrorAlert from "../../components/list/ErrorAlert";
import DependentForm from "./changedRequestForms/sloEnds/DependentForm";
import DependentAddEditModal from "./changedRequestForms/sloEnds/DependentAddEditModal";
import { useNavigate } from "react-router";
import moment from "moment";

const ChangedRequestEntry = ({ arrData, verhoffData }) => {
    let crFields = "";
    let arrCrFields = "";
    let detailsId = "";
    let applicationId = "";
    if (verhoffData) {
        crFields = verhoffData?.crFields;
        arrCrFields = crFields && crFields.split(",");
        detailsId = verhoffData?.detailId;
        applicationId = verhoffData?.appId;
    } else {
        crFields = arrData?.crFields;
        arrCrFields = crFields && crFields.split(",");
        detailsId = arrData?.detailsId;
        applicationId = arrData?.appId;
    }

    const { data, isFetching, error } = useQuery(["changed-request-beneficiary-details", applicationId], () => fetcher(`/changed-request-beneficiary-details?applicationId=${applicationId}`), {
        ...disableQuery,
        enabled: applicationId ? true : false,
    });

    const [form, validator] = useValidate(
        {
            name: { value: "", validate: arrCrFields.includes("name_and_DOB") ? "required" : "" },
            dob: { value: "", validate: arrCrFields.includes("name_and_DOB") ? "required" : "" },
            aadhaar: { value: "", validate: arrCrFields.includes("aadhar_number") ? "required|number|length:12" : "" },
            maritalStatus: { value: "", validate: arrCrFields.includes("marital_status") ? "required" : "" },
            husName: { value: "", validate: arrCrFields.includes("marital_status") ? "required" : "" },
            gender: { value: "", validate: arrCrFields.includes("marital_status") ? "required" : "" },

            district: { value: "", validate: arrCrFields.includes("permanent_address") ? "required" : "" },
            subdivision: { value: "", validate: arrCrFields.includes("permanent_address") ? "required" : "" },
            block: { value: "", validate: arrCrFields.includes("permanent_address") ? "required" : "" },
            blockType: { value: "", validate: arrCrFields.includes("permanent_address") ? "required" : "" },
            gpWard: { value: "", validate: arrCrFields.includes("permanent_address") ? "required" : "" },
            pincode: { value: "", validate: arrCrFields.includes("permanent_address") ? "required" : "" },
            postOffice: { value: "", validate: arrCrFields.includes("permanent_address") ? "required" : "" },
            policeStation: { value: "", validate: arrCrFields.includes("permanent_address") ? "required" : "" },
            hvsr: { value: "", validate: arrCrFields.includes("permanent_address") ? "required" : "" },

            presentDistrict: { value: "", validate: arrCrFields.includes("present_address") ? "required" : "" },
            presentSubdivision: { value: "", validate: arrCrFields.includes("present_address") ? "required" : "" },
            presentBlock: { value: "", validate: arrCrFields.includes("present_address") ? "required" : "" },
            presentBlockType: { value: "", validate: arrCrFields.includes("present_address") ? "required" : "" },
            presentGpWard: { value: "", validate: arrCrFields.includes("present_address") ? "required" : "" },
            presentPincode: { value: "", validate: arrCrFields.includes("present_address") ? "required" : "" },
            presentPostOffice: { value: "", validate: arrCrFields.includes("present_address") ? "required" : "" },
            presentPoliceStation: { value: "", validate: arrCrFields.includes("present_address") ? "required" : "" },
            presentHvsr: { value: "", validate: arrCrFields.includes("present_address") ? "required" : "" },

            ifsc: { value: "", validate: arrCrFields.includes("bank_details") ? "required" : "" },
            bnkName: { value: "", validate: arrCrFields.includes("bank_details") ? "required" : "" },
            bnkBranch: { value: "", validate: arrCrFields.includes("bank_details") ? "required" : "" },
            bnkLocation: { value: "", validate: arrCrFields.includes("bank_details") ? "required" : "" },
            bnkDistrict: { value: "", validate: arrCrFields.includes("bank_details") ? "required" : "" },
            bnkAccNo: { value: "", validate: arrCrFields.includes("bank_details") ? "required|number" : "" },

            detailsId: { value: detailsId, validate: "" },
            fields: { value: arrCrFields, validate: "" },
            applicationId: { value: applicationId, validate: "" },
        },
        data?.data,
        true
    );

    const handleChange = (evt) => {
        // validator.validOnChange(evt);

        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "maritalStatus":
                    setState((state) => {
                        if (value === "Married" && form.gender === "Female") {
                            state.husName.required = true;
                            state.husName.validate = "required";
                            state.husName.error = null;
                        } else {
                            state.husName.required = false;
                            state.husName.validate = "";
                            state.husName.error = null;
                            state.husName.value = "";
                        }
                        return { ...state };
                    });
                    break;

                case "dob":
                    setState((state) => {
                        const dob = moment(value);
                        const today = moment();
                        const age = today.diff(dob, "years");

                        if (age >= 18 && age <= 70) {
                            state.dob.required = false;
                            state.dob.validate = "";
                            state.dob.error = null;
                        } else {
                            state.dob.required = true;
                            state.dob.validate = "required";
                            state.dob.error = "Age should be under 18-70 years.";
                        }
                        return { ...state };
                    });
                    break;
            }
        });
    };

    useEffect(() => {
        if (form.pincode.value === "0") {
            validator.setState((state) => {
                state.pincode.value = "";
                state.postOffice.value = "";
                return { ...state };
            });
        }
        if (form.presentPincode.value === "0") {
            validator.setState((state) => {
                state.presentPincode.value = "";
                state.presentPostOffice.value = "";
                return { ...state };
            });
        }
        if (form.maritalStatus.value === "Married" && form.gender.value.trim() === "Female" && form.husName.required !== true) {
            validator.setState((state) => {
                state.husName.required = true;
                state.husName.validate = "required";
                state.husName.error = null;
                return { ...state };
            });
        }
    }, [form]);

    const { mutate: aadharAlgo, isLoading: aadharAlgoLoading } = useMutation((aadhaar) => fetcher(`/check-aadhaar-algorithm-with-duplicate?aadhaar=${aadhaar}&applicationId=${applicationId}&aadharCheckFor='cr'`), {
        enabled: arrCrFields.includes("aadhar_number") ? true : false,
    });
    const handleBlur = (e) => {
        if (e.split("").length === 12) {
            aadharAlgo(e, {
                onSuccess(data, variables, context) {
                    validator.setState((state) => {
                        state.aadhaar.success = data.message;
                        state.aadhaar.error = null;
                        return {
                            ...state,
                        };
                    });
                },
                onError(error, variables, context) {
                    validator.setState((state) => {
                        state.aadhaar.success = null;
                        state.aadhaar.error = error.message;
                        return {
                            ...state,
                        };
                    });
                },
            });
        }
    };

    const { data: previousNomineeData } = useQuery(["previous-nominee-list", applicationId], () => fetcher(`/previous-nominee-list?id=${applicationId}`), { enabled: arrCrFields.includes("nominee_details") ? true : false });

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const formData = validator.generalize();
        if (formData.fields.includes("nominee_details") && parseInt(previousNomineeData[0]?.shareCount) != 100) {
            toast.error("Nominee share should be 100 percent");
        } else {
            mutate(
                { url: `/insert-changed-request-entry`, body: formData },
                {
                    onSuccess(data, variables, context) {
                        toast.success(data.msg);
                        const fields = data.fields;
                        if (fields.includes("aadhar_number") || fields.includes("name_and_DOB") || fields.includes("permanent_address") || fields.includes("bank_details") || fields.includes("nominee_details")) {
                            navigate(`/change-request/documents/${data.crId}`);
                        } else {
                            navigate(`/change-request/final-review/${data.crId}`);
                        }
                    },
                    onError(error, variables, context) {
                        toast.error(error.message);
                        validator.setError(error.errors);
                    },
                }
            );
        }
    };

    const [loading, setLoading] = useState(true);

    //Nominee modal related data set
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [modalData, setModalData] = useState();
    const nomineeParentCallBack = (cb) => {
        setModalData(cb);
        setShow(true);
    };

    //Dependent modal related data set
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const [modalData1, setModalData1] = useState();
    const dependentParentCallBack = (cb) => {
        setLoading(true);
        setModalData1(cb);
        setShow1(true);
    };

    useEffect(() => {
        if (modalData1) {
            setLoading(false);
        }
    }, [modalData1]);

    return (
        <>
            <div className="card datatable-box mb-4">
                {isFetching && <LoadingSpinner />}
                {error && <ErrorAlert error={error} />}
                {data && (
                    <form noValidate onSubmit={handleSubmit}>
                        <div className="card-body">
                            {data && (
                                <div className="row" style={{ padding: "5px" }}>
                                    {arrCrFields.includes("name_and_DOB") && <NameAndDobForm form={form} handleChange={handleChange} />}
                                    {arrCrFields.includes("aadhar_number") && <AadhaarNumberForm form={form} handleChange={handleChange} handleBlur={handleBlur} aadharAlgoLoading={aadharAlgoLoading} />}
                                    {arrCrFields.includes("marital_status") && <MaritalStatusForm form={form} handleChange={handleChange} />}
                                    {arrCrFields.includes("permanent_address") && <PermanentAddressForm form={form} handleChange={handleChange} />}
                                    {arrCrFields.includes("present_address") && <PresentAddressForm form={form} handleChange={handleChange} />}
                                    {arrCrFields.includes("bank_details") && <BankForm form={form} validator={validator} handleChange={handleChange} />}
                                    {arrCrFields.includes("nominee_details") && <NomineeForm applicationId={applicationId} nomineeParentCallBack={nomineeParentCallBack} />}
                                    {arrCrFields.includes("Dependency_details") && <DependentForm applicationId={applicationId} dependentParentCallBack={dependentParentCallBack} />}
                                </div>
                            )}
                        </div>
                        <div className="card-footer">
                            <div className="form-group">
                                <div className="d-grid d-md-flex justify-content-md-end">
                                    <button className="btn btn-success btn-sm" type="submit" disabled={isLoading || aadharAlgoLoading}>
                                        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Go Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            {arrCrFields.includes("nominee_details") && <NomineeAddEditModal show={show} handleClose={handleClose} modalData={modalData} />}
            {arrCrFields.includes("Dependency_details") && !loading && <DependentAddEditModal show={show1} handleClose={handleClose1} modalData={modalData1} />}
        </>
    );
};

export default ChangedRequestEntry;
