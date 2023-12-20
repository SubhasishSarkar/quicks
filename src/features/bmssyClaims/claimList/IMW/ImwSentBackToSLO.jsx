import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import Pagination from "../../../../components/Pagination";
import { fetcher, searchParamsToObject } from "../../../../utils";
import ClaimForBadge from "../ClaimForBadge";
import CurrentStatus from "../CurrentStatus";
import { useValidate } from "../../../../hooks";
import ClaimSearchFilter from "../ClaimSearchFilter";
import NoDataFound from "../../../../components/list/NoDataFound";

const ImwSentBackToSLO = () => {
    const type = "Sent Back To SLO";
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
    const checkChronological = (id) => {
        navigate("/claim/details/" + id);
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
                                        <th>Claim Ref No.</th>
                                        <th>Beneficiary Name</th>
                                        <th>Nominee Name</th>
                                        <th>SSIN</th>
                                        <th>Registration Number</th>
                                        <th>Worker Type</th>
                                        <th>Claim For</th>
                                        <th>Current Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td style={wrapStyle}>{data?.from + index}</td>
                                                <td style={wrapStyle}>{item.id}</td>
                                                <td style={wrapStyle}>{item.name}</td>
                                                <td style={wrapStyle}>{item.nominee_name}</td>
                                                <td>{item.ssin_number}</td>
                                                <td>{item.reg_number}</td>
                                                <td style={wrapStyle}>{item.worker_type}</td>
                                                <td>
                                                    <ClaimForBadge claimFor={item.claim_for} benefitName={item.benefit_name} />
                                                </td>
                                                <td style={wrapStyle}>
                                                    <CurrentStatus claimStatus={item.submit_status} />
                                                </td>
                                                <td style={wrapStyle}>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => {
                                                            checkChronological(item.enc_claim_id);
                                                        }}
                                                    >
                                                        View
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

export default ImwSentBackToSLO;
