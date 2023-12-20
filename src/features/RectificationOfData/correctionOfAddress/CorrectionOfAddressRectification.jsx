import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils";
import TableList from "../../../components/table/TableList";
import ControlledIMWApplicationListFilter from "../../IMWApplicationList/IMWApplicationListFilter";
import ActionModalPage from "../ActionModalPage";
import { Tab, Tabs } from "react-bootstrap";

const tabObj = {
    updated: "1",
    pending: "0",
};

const CorrectionOfAddressRectification = () => {
    const [searchParams, setSearchParams] = useSearchParams(true);

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setEncId();
    };

    const [encId, setEncId] = useState();
    const [isActive, setIsActive] = useState();
    const [ssin, setSsin] = useState();
    const [benName, setBenName] = useState();

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const { isFetching, data, error, isLoading } = useQuery(["address_rectification", searchParams.toString()], () => fetcher(`/address_rectification?${searchParams.toString()}`));

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageAddress({ title: "Address Rectification", url: "" }));
    }, []);

    const handleClickEdit = (eidtData) => {
        const { ssin_no: ssin, is_active: isActive, enc_application_id: id, fullname: name } = eidtData;
        setEncId(id);
        setIsActive(isActive);
        setSsin(ssin);
        setBenName(name);
        setShow(true);
    };

    const columnsUpdated = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "fullname",
            headerName: "Beneficiary Name",
        },
        {
            field: "aadhar",
            headerName: "Aadhaar",
        },
        {
            field: "ssin_no",
            headerName: "SSIN",
        },
    ];
    const columnsPending = [
        ...columnsUpdated,
        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button className="btn btn-sm btn-success" onClick={() => handleClickEdit(props)} disabled={encId === props.enc_application_id ? true : false}>
                        {encId === props.enc_application_id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-retweet"></i>} Rectify
                    </button>
                );
            },
        },
    ];

    return (
        <>
           
            <div className="card-nav-tabs pt-2">
                <Tabs
                    defaultActiveKey={tabObj[searchParams.get("type") ?? "0"]}
                    onSelect={(val) => {
                        if (val == 0) {
                            searchParams.set("type", "pending");
                        } else if (val == 1) {
                            searchParams.set("type", "updated");
                        }
                        setSearchParams();
                    }}
                    id="uncontrolled-tab-example"
                >
                    <Tab eventKey="0" title="Pending">
                    <ControlledIMWApplicationListFilter isFetching={isFetching} isLoading={isLoading} />
                        <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columnsPending} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                        {show && <ActionModalPage show={show} encId={encId} isActive={isActive} ssin={ssin} benName={benName} actionTabType="addressRectification" handleClose={handleClose} />}
                    </Tab>
                    <Tab eventKey="1" title="Updated">
                    <ControlledIMWApplicationListFilter isFetching={isFetching} isLoading={isLoading} />
                        <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columnsUpdated} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                    </Tab>
                </Tabs>
            </div>
        </>
    );
};

export default CorrectionOfAddressRectification;
