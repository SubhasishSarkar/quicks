import React, { useContext } from "react";
import CwEmployerDetails from "./CwEmployerDetails";
import { useValidate } from "../../../../../hooks";
import { toast } from "react-toastify";
import CertifiedDetails from "../common/CertifiedDetails";
import NomineeDetails from "../common/NomineeDetails";
import PaymentDetails from "../common/PaymentDetails";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, updater } from "../../../../../utils";
import { useSearchParams } from "react-router-dom";
import LoadingOverlay from "../../../../../components/LoadingOverlay";
import moment from "moment";
import RegistrationContext from "../../../Context";
const CW = ({ handleEmpSubmit }) => {
    const { basicDetails } = useContext(RegistrationContext);
    const query = useQueryClient();

    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");

    const { isFetching, data: dataCW } = useQuery(["caf-registration-preview", "additional-details-cw", application_id], () => fetcher(`/caf-registration-preview?id=${application_id}&step_name=additional-details-cw`));

    // console.log("dataCW",dataCW)
    const [form, validator] = useValidate(
        {
            //employee details
            empList: { value: [], validate: "required" },

            //nominee
            nominee_name: { value: "", validate: "onlyAlphabets|required", error: null },
            relationship: { value: "", validate: "required", error: null },
            gender: { value: "", validate: "required", error: null },
            dob: { value: "", validate: "required", error: null },
            age: { value: "", validate: "required", error: null },
            nominee_address: { value: "", validate: "required", error: null },

            //certified
            certified_by_edist: { value: "", validate: "required" },
            designation_edistrict: { value: "", validate: "required" },

            //Payment details
            receipt_no: { value: "", validate: "required" },
            book_no: { value: "", validate: "required" },
            file_location: { value: "", validate: "required" },
        },
        dataCW,
        true
    );
    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            // eslint-disable-next-line default-case
            switch (name) {
                case "empList":
                    setState((state) => {
                        return { ...state };
                    });
                    break;
            }
        });
    };

    const { mutate, isLoading } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const handleSubmit = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!validator.validate()) return toast.error("please fill");

        if (basicDetails?.cat_worker_type === "cw") {
            const totalExperience = form?.empList?.value.reduce((acc, item) => {
                const diff = moment(item.end_date).diff(moment(item.start_date), "days");
                return acc + diff;
            }, 0);

            if (totalExperience < 90) {
                toast.error("Total work experience should be more than 89 days");
                return;
            }
        }

        if (application_id) {
            const data = validator.generalize();
            mutate(
                { url: `/caf-registration?id=${application_id}&type=additional-details-cw`, body: data },
                {
                    onSuccess(data, variables, context) {
                        query.removeQueries(["caf-registration-preview", "additional-details-cw", application_id], {
                            exact: true,
                        });
                        toast.success(data.message);
                        handleEmpSubmit();
                    },
                    onError(error, variables, context) {
                        toast.error(error.message);
                        validator.setError(error.errors);
                    },
                }
            );
        }
    };
    return (
        <>
            <>
                {isFetching && <LoadingOverlay />}
                <div>
                    <div name="empList" id="empList" className={`${form.empList.error && "is-invalid"}`}>
                        <CwEmployerDetails handleChangeEmp={handleChange} data={form.empList.value} />
                    </div>
                    <div className="invalid-feedback">Please enter employer deatils.</div>
                </div>
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <CertifiedDetails form={form} handleChange={handleChange} />
                    <NomineeDetails form={form} handleChange={handleChange} />
                    <PaymentDetails form={form} handleChange={handleChange} />
                    <div className="d-grid d-md-flex justify-content-md-end">
                        <button className="btn btn-success" type="submit" disabled={isLoading} onClick={handleSubmit}>
                            {isLoading ? "Loading... " : "Save Draft & Proceed"}
                        </button>
                    </div>
                </form>
            </>
        </>
    );
};

export default CW;
