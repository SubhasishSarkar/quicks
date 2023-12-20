import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import Pagination from "../../../../components/Pagination";
import { fetcher, searchParamsToObject } from "../../../../utils";
import ClaimForBadge from "../ClaimForBadge";
import CurrentStatus from "../CurrentStatus";
import ClaimSearchFilter from "../ClaimSearchFilter";
import { useValidate } from "../../../../hooks";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import NoDataFound from "../../../../components/list/NoDataFound";

const ImwClaimPending = () => {
    const type = "Pending";
    const [searchParams, setSearchParams] = useSearchParams({ type });
    const { error, data, isFetching } = useQuery(["get-claim-list", searchParams.toString()], () => fetcher(`/get-claim-list?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    //For Confirm modal section
    const [openConfirm, setOpenConfirm] = useState(false);
    const [confirmId, setConfirmId] = useState();
    const handleConfirm = () => {
        navigate("/claim/details/" + confirmId);
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

    const [loading, setLoading] = useState();

    const { mutate } = useMutation((id) => fetcher(`/check-chronological-order?id=${id}&status='1'`));
    const navigate = useNavigate();
    const checkChronological = (id) => {
        setLoading(id);
        setConfirmId(id);
        mutate(id, {
            onSuccess(data, variables, context) {
                if (data === true) {
                    setOpenConfirm(true);
                    setLoading();
                } else {
                    navigate("/claim/details/" + id);
                }
            },
            onError(error, variables, context) {
                toast.error(error.message);
                setLoading();
            },
        });
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
                                    <tr className="text-center">
                                        <th>SL No.</th>
                                        <th>Claim Ref No.</th>
                                        <th>Beneficiary</th>
                                        <th>Nominee</th>
                                        <th>SSIN</th>
                                        <th>Registration No</th>
                                        <th>Worker Type</th>
                                        <th>Claim For</th>
                                        <th>Status</th>
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
                                                <td style={wrapStyle}>{item.ssin_number}</td>
                                                <td>{item.reg_number}</td>
                                                <td style={wrapStyle}>{item.worker_type}</td>
                                                <td>
                                                    <ClaimForBadge claimFor={item.claim_for} benefitName={item.benefit_name} />
                                                </td>
                                                <td style={wrapStyle}>
                                                    <CurrentStatus claimStatus={item.submit_status} />
                                                </td>
                                                <td>
                                                    <button
                                                        disabled={loading === item.enc_claim_id ? true : false}
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => {
                                                            checkChronological(item.enc_claim_id);
                                                        }}
                                                    >
                                                        {loading === item.enc_claim_id && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} View
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

            {openConfirm && <ConfirmationModal handleConfirm={handleConfirm} handleClose={setOpenConfirm} title="You are breaking chronological order. Do you want to continue?" />}
        </>
    );
};

export default ImwClaimPending;
