import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetcher } from "../../../utils";
import { useSearchParams } from "react-router-dom";
import ActionModalPage from "../ActionModalPage";
import TableList from "../../../components/table/TableList";
import ControlledIMWApplicationListFilter from "../../IMWApplicationList/IMWApplicationListFilter";

const Pending = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [encId, setEncId] = useState();
    const [isActive, setIsActive] = useState();
    const [ssin, setSsin] = useState();
    const [benName, setBenName] = useState();
    const [registrationNo, setRegistrationNo] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState();

    const handleClose = () => {
        setShow(false);
        setLoading();
    };

    const { data, error, isFetching, isLoading } = useQuery(["get-erroneous-registration-number", searchParams.toString()], () => fetcher(`/get-erroneous-registration-number?${searchParams.toString()}`));

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const clickHandler = (id, isActive, SSIN, name, registrationNo) => {
        setLoading(id);
        setEncId(id);
        setIsActive(isActive);
        setSsin(SSIN);
        setBenName(name);
        setRegistrationNo(registrationNo);
        setShow(true);
    };

    // const [form, validator] = useValidate(
    //     {
    //         searchBy: { value: "", validate: "required" },
    //         searchVal: { value: "", validate: "required" },
    //     },
    //     searchParamsToObject(searchParams)
    // );

    // const handleChange = (evt) => {
    //     validator.validOnChange(evt);
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (!validator.validate()) return;
    //     const data = validator.generalize();
    //     Object.keys(data).forEach((key) => searchParams.set(key, data[key]));
    //     setSearchParams(searchParams);
    // };

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
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button
                        className="btn btn-success btn-sm"
                        style={{ fontSize: 14 }}
                        onClick={() => clickHandler(props?.enc_application_id, props.is_active, props.ssin_no, props.full_name, props?.registration_no)}
                        disabled={loading === props.enc_application_id ? true : false}
                    >
                        {loading === props.enc_application_id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-retweet"></i>} Rectify
                    </button>
                );
            },
        },
    ];

    const searchOptions = [
        { value: "ssin_no", name: "SSIN" },
        { value: "registration_no", name: "Registration No." },
    ];
    return (
        <>
            <ControlledIMWApplicationListFilter isFetching={isFetching} isLoading={isLoading} searchOptions={searchOptions} />
            <TableList data={data} isLoading={isLoading} error={error} tableHeader={columns} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
            <ActionModalPage show={show} encId={encId} isActive={isActive} ssin={ssin} benName={benName} actionTabType="registrationNo" handleClose={handleClose} registrationNo={registrationNo} />
        </>
    );
};

export default Pending;
