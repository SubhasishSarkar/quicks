import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorAlert from "../../../../components/list/ErrorAlert";
import LoadingSpinner from "../../../../components/list/LoadingSpinner";
import Pagination from "../../../../components/Pagination";
import { fetcher, searchParamsToObject } from "../../../../utils";
import ClaimForBadge from "../ClaimForBadge";
import NoDataFound from "../../../../components/list/NoDataFound";
import ClaimSearchFilter from "../ClaimSearchFilter";
import { useValidate } from "../../../../hooks";
import ConfirmationModal from "../../../../components/ConfirmationModal";

const AlcPendingList = () => {
    const type = "Pending";
    const [searchParams, setSearchParams] = useSearchParams({ type });
    const { error, data, isFetching } = useQuery(["get-claim-list", searchParams.toString()], () => fetcher(`/get-claim-list?${searchParams.toString()}`));
    const [loading, setLoading] = useState();
    const navigate = useNavigate();
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

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const handleChange = (evt) => {
        validator.validOnChange(evt);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validator.validate()) return;
        const data = validator.generalize();
        searchParams.set("page", 1);
        Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
        setSearchParams(searchParams);
    };

    const { mutate } = useMutation((id) => fetcher(`/check-chronological-order?id=${id}&status='2'`));

    const checkChronological = (id) => {
        setLoading(id);
        setConfirmId(id);
        mutate(id, {
            onSuccess(data, variables, context) {
                if (data === true) {
                    setOpenConfirm(true);
                    // const status = window.confirm("You are breaking chronological order. Do you want to continue ?");
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

    return (
        <>
            {isFetching && <LoadingSpinner />}
            {error && <ErrorAlert error={error} />}
            {data && (
                <>
                    <ClaimSearchFilter handleSubmit={handleSubmit} form={form} handleChange={handleChange} validator={validator} />
                    {data.data.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm  table-striped">
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
                                                <td>{item.reg_number != "null" ? item.reg_number : ""}</td>
                                                <td>
                                                    <ClaimForBadge claimFor={item.claim_for} benefitName={item.benefit_name} />
                                                </td>
                                                <td>
                                                    <button
                                                        disabled={loading === item.enc_claim_id ? true : false}
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
                    ) : (
                        <NoDataFound />
                    )}
                    <Pagination data={data} onLimitChange={handleLimit} limit={searchParams.get("limit")} />
                </>
            )}
            {openConfirm && <ConfirmationModal handleConfirm={handleConfirm} handleClose={setOpenConfirm} title="You are breaking chronological order. Do you want to continue?" />}
        </>
    );
};

export default AlcPendingList;
