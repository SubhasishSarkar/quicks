import React, { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import ControlledIMWApplicationListFilter from "../../IMWApplicationList/IMWApplicationListFilter";
import TableList from "../../../components/table/TableList";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher } from "../../../utils";

const tabObj = {
    updated: "1",
    pending: "0",
};

const VerhoffFailedAadhaarSlo = () => {
    const [searchParams, setSearchParams] = useSearchParams(true);
    const navigate = useNavigate();

    const handleLimit = (val) => {
        searchParams.set("limit", val);
        setSearchParams(searchParams);
    };

    const { isFetching, data, error, isLoading } = useQuery(["/invalid_verhoff_failed_aadhaar_slo", searchParams.toString()], () => fetcher(`/invalid_verhoff_failed_aadhaar_slo?${searchParams.toString()}`));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageAddress({ title: "Invalid Aadhaar Rectification", url: "" }));
    }, []);

    const { mutate: goToChangeRequest, isLoading: goToChangeRequestLoading } = useMutation((searchQuery) => fetcher("/changed-request-select-option?" + searchQuery));

    const handleClickEdit = (appId) => {
        const crFields = ["aadhar_number"];
        const urlSearchParams = `application_id=${appId}&crOption=${crFields}`;
        goToChangeRequest(urlSearchParams.toString(), {
            onSuccess(data, variables, context) {
                navigate(`/change-request/entry?applicationId=${data?.appId}&detailsId=${data?.detailsId}&cr_fields=${data?.crFields}`);
            },
            onError(error, variables, context) {
                toast.error(error.message);
            },
        });
    };

    const columnsPending = [
        {
            field: 0,
            headerName: "SL No.",
        },
        {
            field: "ben_name",
            headerName: "Beneficiary Name",
        },
        {
            field: "ssin_no",
            headerName: "SSIN",
        },
        {
            field: "aadhar",
            headerName: "Aadhaar",
        },
        {
            field: 1,
            headerName: "Action",
            renderHeader: (props) => {
                return (
                    <>
                        {props.button === "click" ? (
                            <button className="btn btn-sm btn-warning" onClick={() => handleClickEdit(props.application_id)} disabled={goToChangeRequestLoading}>
                                {goToChangeRequestLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <i className="fa-solid fa-location-arrow"></i>} Go to change request
                            </button>
                        ) : (
                            <button className="btn btn-light btn-sm" disabled>
                                Under Process <i className="fa-solid fa-ellipsis fa-beat-fade"></i>
                            </button>
                        )}
                    </>
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
            field: "ben_name",
            headerName: "Beneficiary Name",
        },
        {
            field: "ssin_no",
            headerName: "SSIN",
        },
        {
            field: "aadhar",
            headerName: "Old Aadhaar",
        },
        {
            field: "updated_aadhar",
            headerName: "Updated Aadhaar",
        },
    ];

    return (
        <>
            <ControlledIMWApplicationListFilter isFetching={isFetching} isLoading={isLoading} />
            <div className="card-nav-tabs pt-2">
                <Tabs
                    defaultActiveKey={tabObj[searchParams.get("type") ?? "0"]}
                    onSelect={(val) => {
                        if (val == 0) {
                            searchParams.set("type", "pending");
                        } else if (val == 1) {
                            searchParams.set("type", "updated");
                        }
                        setSearchParams(searchParams);
                        // setTabValue(val);
                    }}
                    id="uncontrolled-tab-example"
                >
                    <Tab eventKey="0" title="Pending">
                        <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columnsPending} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                    </Tab>
                    <Tab eventKey="1" title="Updated">
                        <TableList data={data} isLoading={isLoading || isFetching} error={error} tableHeader={columnsUpdated} handlePagination={handleLimit} pageLimit={searchParams.get("limit")} />
                    </Tab>
                </Tabs>
            </div>
        </>
    );
};

export default VerhoffFailedAadhaarSlo;
