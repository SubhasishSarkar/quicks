import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../../../utils";
import ActionModalPage from "../../ActionModalPage";
import TableList from "../../../../components/table/TableList";
import ControlledIMWApplicationListFilter from "../../../IMWApplicationList/IMWApplicationListFilter";

const ConstructionList = () => {
    const type = "cw";
    const [searchParams, setSearchParams] = useSearchParams({ type });
    const { error, data,isLoading, isFetching } = useQuery(["wrong-worker-type-list", searchParams.toString()], () => fetcher(`/wrong-worker-type-list?${searchParams.toString()}`));
    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setLoading();
    };
    const [encId, setEncId] = useState();
    const [isActive, setIsActive] = useState();
    const [ssin, setSsin] = useState();
    const [benName, setBenName] = useState();
    const [loading, setLoading] = useState();
    const [worker, setWorker] = useState();

    const showModal = (id, isActive, SSIN, name, workerType) => {
        setShow(true);
        setEncId(id);
        setIsActive(isActive);
        setSsin(SSIN);
        setBenName(name);
        setLoading(id);
        setWorker(workerType);
    };

    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "ssin_no",
            headerName: "SSIN",
        },
        {
            field: "registration_no",
            headerName: "Registration No",
        },
        {
            field: "registration_date",
            headerName: "Registration Date",
        },
        {
            field: "block_mun_name",
            headerName: "Block",
        },
        {
            field: "gp_ward_name",
            headerName: "Gp/Ward",
        },
        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button
                        className="btn btn-sm btn-success"
                        style={{ textDecoration: "none", color: "#fff" }}
                        onClick={() => showModal(props.enc_application_id, props.is_active, props.ssin_no, props.full_name, props.cat_worker_type)}
                        disabled={loading === props.enc_application_id ? true : false}
                    >
                        {loading === props.enc_application_id && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Rectify
                    </button>
                );
            },
        },
    ];

    const searchOptions = [
        {'value':'ssin_no','name':'SSIN'},
        { 'value':'registration_no','name':'Registration No.'}
    ]

    return (
        <>
            <ControlledIMWApplicationListFilter isFetching={isFetching} isLoading={isLoading} searchOptions = {searchOptions}/>
            <TableList data={data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
            <ActionModalPage show={show} encId={encId} isActive={isActive} ssin={ssin} benName={benName} workerType={worker} actionTabType="workerType" handleClose={handleClose} />
        </>
    );
};

export default ConstructionList;
