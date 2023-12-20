import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import Pagination from "../../../../components/Pagination";
import { fetcher, searchParamsToObject } from "../../../../utils";
import ClaimForBadge from "../ClaimForBadge";
import NoDataFound from "../../../../components/list/NoDataFound";
import ClaimSearchFilter from "../ClaimSearchFilter";
import { useValidate } from "../../../../hooks";

const AlcRejectList = () => {
    const type = "Rejected";
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
                                                <td>{item.reg_number}</td>
                                                <td>
                                                    <ClaimForBadge claimFor={item.claim_for} benefitName={item.benefit_name} />
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-success">
                                                        <Link to={"/claim/details/" + item.enc_claim_id} style={{ textDecoration: "none", color: "#fff" }}>
                                                            View
                                                        </Link>
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

export default AlcRejectList;
