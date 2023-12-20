import React from "react";
import moment from "moment";
import { useValidate } from "../../../../../hooks";
import NomineeDetails from "../common/NomineeDetails";
import CertifiedDetails from "../common/CertifiedDetails";
import PaymentDetails from "../common/PaymentDetails";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher, updater } from "../../../../../utils";
import { useSearchParams } from "react-router-dom";
import OtherDetails from "./OtherDetails";
import LoadingOverlay from "../../../../../components/LoadingOverlay";

const TW = ({ handleEmpSubmit }) => {
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const application_id = searchParams.get("application_id");

    const { isFetching, data: dataTW } = useQuery(["caf-registration-preview", "additional-details-tw", application_id], () => fetcher(`/caf-registration-preview?id=${application_id}&step_name=additional-details-tw`));

    const [form, validator] = useValidate(
        {
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

            //employee other details
            name_of_worker: { value: "", validate: "required" },
            nature_of_vechicle: { value: "", validate: "required" },
            nature_of_duties: { value: "", validate: "required" },
        },
        dataTW,
        true
    );

    const handleAdd = (evt) => {};
    const handleChange = (evt) => {
        validator.validOnChange(evt, (value, name, setState) => {
            switch (name) {
                case "dob":
                    setState((state) => {
                        if (value) {
                            let currentDate = moment().format("YYYY-MM-DD");
                            if (state.dob.value > currentDate) {
                                state.dob.error = "Please provide a valid Date of Birth";
                            }
                            state.age.value = moment().diff(value, "years", false);
                            state.age.error = null;
                        } else state.age.value = null;

                        return { ...state };
                    });

                    break;
                case "age":
                    setState((state) => {
                        if (value > 120) {
                            state.dob.error = "Please provide a valid Date of Birth";
                        } else if (value < 0) {
                            state.dob.error = "Please provide a valid Date of Birth";
                        }
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

        if (!validator.validate()) return;
        if (application_id) {
            const data = validator.generalize();
            mutate(
                { url: `/caf-registration?id=${application_id}&type=additional-details-tw`, body: data },
                {
                    onSuccess(data, variables, context) {
                        query.removeQueries(["caf-registration-preview", "additional-details-tw", application_id], {
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
            {isFetching && <LoadingOverlay />}
            <form onSubmit={handleAdd} noValidate autoComplete="off">
                <OtherDetails form={form} handleChange={handleChange} />
                <NomineeDetails form={form} handleChange={handleChange} />
                <CertifiedDetails form={form} handleChange={handleChange} />
                <PaymentDetails form={form} handleChange={handleChange} />
                <div className="d-grid d-md-flex justify-content-md-end">
                    <button className="btn btn-success" type="submit" disabled={isLoading} onClick={handleSubmit}>
                        {isLoading ? "Loading... " : "Save Draft & Proceed"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default TW;
