import React, { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import WorkerTypeBasedFundList from "./funRequestList/WorkerTypeBasedFundList";
import FundRequestListSearchById from "./funRequestList/FundRequestListSearchById";
import { useSearchParams } from "react-router-dom";

const FundRequestList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Fund Request List", url: "" }));
    }, []);

    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const clearSearchParams = (e) => {
        setSearchParams("type=" + e);
    };

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card-nav-tabs mb-4">
                        <Tabs
                            defaultActiveKey="ow"
                            onSelect={(e) => {
                                clearSearchParams(e);
                            }}
                        >
                            <Tab eventKey="ow" title="Other Worker">
                                <FundRequestListSearchById />
                                <WorkerTypeBasedFundList type="ow" />
                            </Tab>
                            <Tab eventKey="cw" title="Construction Worker">
                                <FundRequestListSearchById />
                                <WorkerTypeBasedFundList type="cw" />
                            </Tab>
                            <Tab eventKey="tw" title="Transport Worker">
                                <FundRequestListSearchById />
                                <WorkerTypeBasedFundList type="tw" />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FundRequestList;
