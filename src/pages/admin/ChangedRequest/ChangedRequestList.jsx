import React, { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DisbursedDataList from "../../../features/changedRequest/DisbursedDataList";
import IncompleteDataList from "../../../features/changedRequest/IncompleteDataList";
import PendingDataList from "../../../features/changedRequest/PendingDataList";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useSearchParams } from "react-router-dom";

const ChangedRequestList = () => {
    const user = useSelector((state) => state.user.user);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Changed Request List", url: "" }));
    }, []);

    const queryParameters = new URLSearchParams(window.location.search);
    const type = queryParameters.get("type");

    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const clearSearchParams = (e) => {
        setSearchParams("type=" + e);
    };

    return (
        <>
            <div className="card-nav-tabs">
                <div className="col-md-12">
                    <Tabs
                        onSelect={(e) => {
                            clearSearchParams(e);
                        }}
                        defaultActiveKey={user.role === "inspector" && type != "Disbursed" ? "Pending" : type ? type : "Incomplete"}
                    >
                        {(["SLO", "collectingagent", "otherserviceprovider"].includes(user.role) || user.role === "CA" || user.role === "DEO") && (
                            <Tab eventKey="Incomplete" title="Incomplete">
                                <IncompleteDataList />
                            </Tab>
                        )}
                        <Tab eventKey="Pending" title="Pending">
                            <PendingDataList />
                        </Tab>
                        <Tab eventKey="Disbursed" title="Disbursed">
                            <DisbursedDataList />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default ChangedRequestList;
