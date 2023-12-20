import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import { fetcher, searchParamsToObject } from "../../../../utils";
import ClaimForBadge from "../ClaimForBadge";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import Pagination from "../../../../components/Pagination";
import { useSearchParams } from "react-router-dom";
import NoDataFound from "../../../../components/list/NoDataFound";
import ClaimSearchFilter from "../ClaimSearchFilter";
import { useValidate } from "../../../../hooks";

const AlcBackForRectification = () => {
    const type = "Back For Rectification";
    const [searchParams, setSearchParams] = useSearchParams({ type });
    const { error, data, isFetching } = useQuery(["get-claim-list", searchParams.toString()], () => fetcher(`/get-claim-list?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const [form, validator] = useValidate(
        {
            searchBy: { value: "", validate: "required" },
            searchVal: { value: "", validate: "required" },
        },
        searchParamsToObject(searchParams)
    );

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };
    const navigate = useNavigate();

    const [loading, setLoading] = useState();

    // const { mutate } = useMutation((id) => fetcher(`/check-chronological-order?id=${id}&status='8'`));

    // const checkChronological = (id) => {
    //     setLoading(id);
    //     mutate(id, {
    //         onSuccess(data, variables, context) {
    //             if (data === true) {
    //                 const status = window.confirm("You are breaking chronological order. Do you want to continue ?");
    //                 if (status) navigate("/claim/details/" + id);
    //                 setLoading();
    //             } else {
    //                 navigate("/claim/details/" + id);
    //             }
    //         },
    //         onError(error, variables, context) {
    //             toast.error(error.message);
    //             setLoading();
    //         },
    //     });
    // };
    const checkChronological = (id) => {
        setLoading(id);
        navigate("/claim/details/" + id);
    };
    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data &&
                (data?.data.length > 0 ? (
                    <>
                        <ClaimSearchFilter handleSubmit={handleSubmit} form={form} handleChange={handleChange} validator={validator} />
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm table-striped">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Claim Reference No.</th>
                                        <th>Beneficiary Name</th>
                                        <th>SSIN</th>
                                        <th>Registration Number</th>
                                        <th>Claim For</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{data?.from + index}</td>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.ssin_number}</td>
                                                <td>{item.reg_number === "null" ? "" : item.reg_number}</td>
                                                <td>
                                                    <ClaimForBadge claimFor={item.claim_for} benefitName={item.benefit_name} />
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => {
                                                            checkChronological(item.enc_claim_id);
                                                        }}
                                                    >
                                                        {loading === item.enc_claim_id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "View"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <NoDataFound />
                ))}
            <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
        </>
    );
};

export default AlcBackForRectification;
