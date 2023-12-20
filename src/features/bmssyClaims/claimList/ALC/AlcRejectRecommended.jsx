import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetcher, searchParamsToObject } from "../../../../utils";
import ClaimForBadge from "../ClaimForBadge";
import ClaimSearchFilter from "../ClaimSearchFilter";
import { useValidate } from "../../../../hooks";
import TableList from "../../../../components/table/TableList";
import ConfirmationModal from "../../../../components/ConfirmationModal";

const AlcRejectRecommended = () => {
    const type = "Recommended to Rejection";
    const [searchParams, setSearchParams] = useSearchParams({ type });
    const { error, data, isFetching, isLoading } = useQuery(["get-claim-list", searchParams.toString()], () => fetcher(`/get-claim-list?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };
    const navigate = useNavigate();
    //For Confirm modal section
    const [openConfirm, setOpenConfirm] = useState(false);
    const [confirmId, setConfirmId] = useState();

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
    const { mutate } = useMutation((id) => fetcher(`/check-chronological-order?id=${id}&status='10'`));

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

    const handleConfirm = () => {
        navigate("/claim/details/" + confirmId);
    };

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "id",
            headerName: "Claim Reference No.",
        },
        {
            field: "name",
            headerName: "Beneficiary Name",
        },
        {
            field: "ssin_number",
            headerName: "SSIN",
        },
        {
            field: "reg_number",
            headerName: "Registration Number",
        },
        {
            field: 1,
            headerName: "Claim For",
            renderHeader: (props) => {
                return <ClaimForBadge claimFor={props.claim_for} benefitName={props.benefit_name} />;
            },
        },

        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button
                        disabled={loading === props.enc_claim_id ? true : false}
                        className="btn btn-sm btn-success"
                        onClick={() => {
                            checkChronological(props.enc_claim_id);
                        }}
                    >
                        {loading === props.enc_claim_id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "View"}
                    </button>
                );
            },
        },
    ];

    return (
        <>
            <ClaimSearchFilter handleSubmit={handleSubmit} form={form} handleChange={handleChange} validator={validator} />
            <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
            {openConfirm && <ConfirmationModal handleConfirm={handleConfirm} handleClose={setOpenConfirm} title="You are breaking chronological order. Do you want to continue?" />}
        </>
    );
};

export default AlcRejectRecommended;
