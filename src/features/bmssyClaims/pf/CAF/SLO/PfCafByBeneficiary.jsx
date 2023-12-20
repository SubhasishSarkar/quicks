import React from "react";
import { useValidate } from "../../../../../hooks";
import PfCafWorkerType from "./PfCafWorkerType";
import PfCafBasicDetails from "./PfCafBasicDetails";
import PfCafPresentAddress from "./PfCafPresentAddress";
import { useSelector } from "react-redux";
import PfCafBankDetails from "./PfCafBankDetails";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher, updater } from "../../../../../utils";
import { useNavigate } from "react-router";
import ErrorAlert from "../../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../../components/list/LoadingSpinner";
import { toast } from "react-toastify";
import moment from "moment";

const PfCafByBeneficiary = ({ isBackLog, ssin }) => {
    const { data, isFetching, error } = useQuery(["get-back-log-data-for-pf-caf", ssin], () => fetcher(`/get-back-log-data-for-pf-caf?ssin=${ssin}`), { enabled: isBackLog ? true : false });

    const user = useSelector((state) => state.user.user);

    const [form, validator] = useValidate(
        {
            blkTblId: { value: data?.blkTblId, validate: "" },
            pfCafId: { value: "", validate: "" },

            cat_worker_type: { value: "", validate: "required" },
            sub_cat_name: { value: "", validate: "" },
            worker_type: { value: "", validate: "required" },
            other_worker_name: { value: "", validate: "" },

            ssin: { value: "", validate: "" },
            regNo: { value: "", validate: "required" },
            regDate: { value: "", validate: "required" },
            name: { value: "", validate: "required" },
            fatherName: { value: "", validate: "required" },
            dob: { value: "", validate: "required" },
            mobile: { value: "", validate: "required|number|length:10" },
            aadhar: { value: "", validate: "required" },
            caste: { value: "", validate: "required" },
            religion: { value: "", validate: "required" },
            gender: { value: "", validate: "required" },
            maritalStatus: { value: "", validate: "required" },
            husbandName: { value: "", validate: "" },

            district: { value: user?.district, validate: "required" },
            subdivision: { value: user?.subDivision, validate: "required" },
            bmcType: { value: "", validate: "required" },
            block: { value: "", validate: "required" },
            gpWard: { value: "", validate: "required" },
            pinCode: { value: "", validate: "required" },
            postOffice: { value: "", validate: "required" },
            policeStation: { value: "", validate: "required" },
            hvsr: { value: "", validate: "required" },

            bank_ifsc: { value: "", validate: "required" },
            bank_name: { value: "", validate: "required" },
            bank_branch_name: { value: "", validate: "required" },
            bank_district_name: { value: "", validate: "required" },
            bank_location: { value: "", validate: "required" },
            bank_account_no: { value: "", validate: "required" },
        },
        data?.val,
        true
    );

    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "cat_worker_type":
                    setState((state) => {
                        if (value === "ow") {
                            state.sub_cat_name.required = true;
                            state.sub_cat_name.validate = "required";

                            state.worker_type.value = "";
                            state.worker_type.error = null;
                        } else {
                            state.sub_cat_name.required = false;
                            state.sub_cat_name.validate = "";
                            state.sub_cat_name.value = "";
                            state.sub_cat_name.error = null;

                            state.worker_type.value = "";
                            state.worker_type.error = null;
                        }
                        state.other_worker_name.required = false;
                        state.other_worker_name.validate = "";
                        state.other_worker_name.value = "";
                        state.other_worker_name.error = null;
                        return { ...state };
                    });
                    break;

                case "worker_type":
                    setState((state) => {
                        if (value == 11 || value == 7) {
                            state.other_worker_name.required = true;
                            state.other_worker_name.validate = "required";
                            state.other_worker_name.value = "";
                            state.other_worker_name.error = null;
                        } else {
                            state.other_worker_name.required = false;
                            state.other_worker_name.validate = "";
                            state.other_worker_name.value = "";
                            state.other_worker_name.error = null;
                        }
                        return { ...state };
                    });
                    break;

                case "regDate":
                    setState((state) => {
                        if (!moment(value).isBefore("2017-04-01", "day") && moment(value).isAfter("2001-01-01", "day")) {
                            state.regDate.required = true;
                            state.regDate.validate = "required";
                            state.regDate.value = "";
                            state.regDate.error = "Date must be between 01-01-2001 to 31-03-2017";
                        } else {
                            state.regDate.required = false;
                            state.regDate.validate = "";
                            state.regDate.error = null;
                        }
                        return { ...state };
                    });
                    break;

                case "dob":
                    setState((state) => {
                        if (moment().diff(value, "years") >= 18 && moment().diff(value, "years") <= 70) {
                            state.dob.required = false;
                            state.dob.validate = "";
                            state.dob.error = null;
                        } else {
                            state.dob.required = true;
                            state.dob.validate = "required";
                            state.dob.value = "";
                            state.dob.error = "Age should be under 18-70 years";
                        }
                        return { ...state };
                    });
                    break;

                case "maritalStatus":
                    setState((state) => {
                        if (state.gender.value === "Female" && value === "Married") {
                            state.husbandName.required = true;
                            state.husbandName.validate = "required";
                            state.husbandName.value = "";
                            state.husbandName.error = null;
                        } else {
                            state.husbandName.required = false;
                            state.husbandName.validate = "";
                            state.husbandName.value = "";
                            state.husbandName.error = null;
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
        // if (!validator.validate()) return;
        const formData = validator.generalize();
        mutate(
            { url: `/pf-caf-claim-entry`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success("CAF successfully submitted.");
                    navigate("/claim/pf-caf-documents/" + data.id);
                },
                onError(error, variables, context) {
                    toast.error(error.message);
                },
            }
        );
    };

    return (
        <>
            {error && <ErrorAlert error={error} />}
            {isFetching && <LoadingSpinner />}
            <div className="card datatable-box">
                <div className="card-header py-2">
                    <h5 className="m-0 font-weight-bold text-white">BMSSY CAF Entry For PF Claim</h5>
                </div>
                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="card-body">
                        <PfCafWorkerType form={form} handleChange={handleChange} />
                        <PfCafBasicDetails form={form} handleChange={handleChange} validator={validator} isBackLog={isBackLog} />
                        <PfCafPresentAddress form={form} handleChange={handleChange} />
                        <PfCafBankDetails form={form} handleChange={handleChange} validator={validator} />
                    </div>
                    <div className="card-footer">
                        <div className="form-group">
                            <div className="d-grid  d-md-flex justify-content-md-end">
                                <button className="btn btn-success btn-sm" type="submit" disabled={isLoading}>
                                    {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Save And Go Next
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default PfCafByBeneficiary;
