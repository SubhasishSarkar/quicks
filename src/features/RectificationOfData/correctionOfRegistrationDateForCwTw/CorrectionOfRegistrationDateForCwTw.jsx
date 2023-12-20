import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import TableList from "../../../components/table/TableList";
import ActionModalPage from "../ActionModalPage";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils";
import ControlledIMWApplicationListFilter from "../../IMWApplicationList/IMWApplicationListFilter";

const tabObj = {
    updated: "1",
    pending: "0",
};

const CorrectionOfRegistrationDateForCwTw = () => {
    const [searchParams, setSearchParams] = useSearchParams(true);

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setLoading();
    };

    const [encId, setEncId] = useState();
    const [isActive, setIsActive] = useState();
    const [ssin, setSsin] = useState();
    const [benName, setBenName] = useState();
    const [existRegDate, setExistRegDate] = useState();
    const [loading, setLoading] = useState(false);

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const { isFetching, data, error, isLoading } = useQuery(["/wrong-registration-date-list-cw-tw", searchParams.toString()], () => fetcher(`/wrong-registration-date-list-cw-tw?${searchParams.toString()}`));

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageAddress({ title: "Registration Date Rectification (CW/TW)", url: "" }));
    }, []);

    const handleClickEdit = (editData) => {
        setEncId(editData.enc_application_id);
        setIsActive(editData.is_active);
        setSsin(editData.ssin_no);
        setBenName(editData.full_name);
        setExistRegDate(editData.registration_date);
        setShow(true);
        setLoading(editData.enc_application_id);
    };

    const columnsPending = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "full_name",
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
        {
            field: "registration_date",
            headerName: "Registration Date",
        },
        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <button className="btn btn-sm btn-success" onClick={() => handleClickEdit(props)} disabled={loading === props.enc_application_id ? true : false}>
                        {loading === props.enc_application_id ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-retweet"></i>} Rectify
                    </button>
                );
            },
        },
    ];

    const columnsUpdated = [
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
            field: "old_registration_date",
            headerName: "Registration Date",
        },
        {
            field: "registration_date",
            headerName: "Updated Registration Date",
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
                        {show && <ActionModalPage show={show} encId={encId} isActive={isActive} ssin={ssin} benName={benName} actionTabType="registrationDateCwTw" registrationDate={existRegDate} handleClose={handleClose} />}
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

export default CorrectionOfRegistrationDateForCwTw;
