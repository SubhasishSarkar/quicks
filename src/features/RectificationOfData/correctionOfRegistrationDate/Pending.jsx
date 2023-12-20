import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetcher } from "../../../utils";
import ActionModalPage from "../ActionModalPage";
import TableList from "../../../components/table/TableList";
import ControlledIMWApplicationListFilter from "../../IMWApplicationList/IMWApplicationListFilter";

const Pending = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [encId, setEncId] = useState();
    const [isActive, setIsActive] = useState();
    const [ssin, setSsin] = useState();
    const [benName, setBenName] = useState();
    const [registrationDate, setRegistrationDate] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState();

    const { isFetching, data,isLoading, error } = useQuery(["wrong-registration-date-list", searchParams.toString()], () => fetcher(`/wrong-registration-date-list?${searchParams.toString()}`));
    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const handleClose = () => {
        setShow(false);
        setLoading();
    };

    const clickHandler = (encId, isActive, ssin, registrationDate, name) => {
        setEncId(encId);
        setIsActive(isActive);
        setSsin(ssin);
        setBenName(name);
        setRegistrationDate(registrationDate);
        setShow(true);
        setLoading(encId);
    };
    const columns = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "full_name",
            headerName: "Beneficiary Name",
        },
        {
            field: "ssin_no",
            headerName: "SSIN",
        },
        {
            field: "registration_no",
            headerName: "Registration Number",
        },
        {
            field: "registration_date",
            headerName: "Registration Date",
        },
        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button className="btn btn-success btn-sm " onClick={() => clickHandler(props?.enc_application_id, props?.is_active, props?.ssin_no, props?.registration_date, props.full_name)}>
                        {loading === props?.enc_application_id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-retweet"></i>} Rectify
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
            <ControlledIMWApplicationListFilter  isFetching={isFetching} isLoading={isLoading} searchOptions = {searchOptions}/>
            <TableList data={data} isLoading={isFetching} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
            <ActionModalPage show={show} encId={encId} isActive={isActive} ssin={ssin} benName={benName} actionTabType="registrationDate" handleClose={handleClose} registrationDate={registrationDate} />
        </>
    );
};

export default Pending;
