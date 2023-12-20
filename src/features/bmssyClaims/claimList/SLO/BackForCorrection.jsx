import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import Pagination from "../../../../components/Pagination";
import { fetcher, searchParamsToObject } from "../../../../utils";
import ClaimForBadge from "../ClaimForBadge";
import NoDataFound from "../../../../components/list/NoDataFound";
import { useValidate } from "../../../../hooks";
import ClaimSearchFilter from "../ClaimSearchFilter";

const BackForCorrection = () => {
    const type = "Back For Correction";
    const [searchParams, setSearchParams] = useSearchParams({ type });
    const { error, data, isFetching } = useQuery(["get-claim-list", searchParams.toString()], () => fetcher(`/get-claim-list?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };
    const remarkClass = {
        color: "rgb(243 18 18)",
        letterSpacing: ".5px",
        fontFamily: "monospace",
    };

    // Search Section
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

    const wrapStyle = {
        backgroundColor: "#fff",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
    };
    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data &&
                (data.data.length > 0 ? (
                    <>
                        <ClaimSearchFilter handleSubmit={handleSubmit} form={form} handleChange={handleChange} validator={validator} />
                        <div style={{ overflow: "auto" }} className="table-container table-responsive">
                            <table className="table table-bordered table-sm">
                                <thead>
                                    <tr>
                                        <th>SL No.</th>
                                        <th>Beneficiary Name</th>
                                        <th>SSIN</th>
                                        <th>Registration Number</th>
                                        <th>Claim For</th>
                                        <th>Application Date</th>
                                        <th>Remarks</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td style={wrapStyle}>{data?.from + index}</td>
                                                <td style={wrapStyle}>{item.beneficiary_name}</td>
                                                <td style={wrapStyle}>{item.ssin_no}</td>
                                                <td style={wrapStyle}>{item.registration_no}</td>
                                                <td style={wrapStyle}>
                                                    <ClaimForBadge claimFor={item.claim_for} benefitName={item.benefit_name} />
                                                </td>
                                                <td style={wrapStyle}>{item.application_date}</td>
                                                <td style={remarkClass}>{item.forward_note}</td>
                                                <td style={wrapStyle}>
                                                    <button className="btn btn-sm btn-success" style={{ marginRight: "5px" }}>
                                                        <Link to={"/claim/details/" + item.enc_claim_id} style={{ textDecoration: "none", color: "#fff" }}>
                                                            View
                                                        </Link>
                                                    </button>

                                                    <button className="btn btn-sm btn-success">
                                                        <Link to={"/claim/edit/" + item.enc_claim_id} style={{ textDecoration: "none", color: "#fff" }}>
                                                            Edit
                                                        </Link>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                    </>
                ) : (
                    <NoDataFound />
                ))}
        </>
    );
};

export default BackForCorrection;
