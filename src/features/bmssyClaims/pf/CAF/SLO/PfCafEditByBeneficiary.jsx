import React from "react";
import { useSelector } from "react-redux";
import { useValidate } from "../../../../../hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher, updater } from "../../../../../utils";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import PfCafWorkerType from "./PfCafWorkerType";
import PfCafBasicDetails from "./PfCafBasicDetails";
import PfCafPresentAddress from "./PfCafPresentAddress";
import PfCafBankDetails from "./PfCafBankDetails";
import ErrorAlert from "../../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../../components/list/LoadingSpinner";
import moment from "moment";

const PfCafEditByBeneficiary = () => {
    const { id } = useParams();
    const { error, data, isFetching } = useQuery(["get-pf-caf-claim-details", id], () => fetcher(`/get-pf-caf-claim-details?id=${id}`), { enabled: id ? true : false });

    const user = useSelector((state) => state.user.user);

    const [form, validator] = useValidate(
        {
            blkTblId: { value: "", validate: "" },
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
                        if (state.gender.value == "Female" && (value == "Married" || value == "Widow" || value == "Divorcee")) {
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
        if (!validator.validate()) return;
        const formData = validator.generalize();
        mutate(
            { url: `/pf-caf-claim-entry`, body: formData },
            {
                onSuccess(data, variables, context) {
                    toast.success("CAF successfully Updated.");
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
            <div className="card datatable-box shadow mb-4">
                <div className="card-header py-3">
                    <h5 className="m-0 font-weight-bold text-white">BMSSY CAF Entry For PF Claim</h5>
                </div>
                <div className="card-body">
                    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                        <PfCafWorkerType form={form} handleChange={handleChange} />
                        <PfCafBasicDetails form={form} handleChange={handleChange} validator={validator} isBackLog={data?.ssin ? true : false} />
                        <PfCafPresentAddress form={form} handleChange={handleChange} />
                        <PfCafBankDetails form={form} handleChange={handleChange} validator={validator} />
                        <div className="col-md-12">
                            <div className="form-group">
                                <div className="d-grid mt-2 d-md-flex justify-content-md-end">
                                    <button className="btn btn-success" type="submit" disabled={isLoading}>
                                        {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Update And Go Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PfCafEditByBeneficiary;
