import React, { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import ConstructionList from "../../../../features/RectificationOfData/workerTypeRectification/listPages/ConstructionList";
import OtherWorkerList from "../../../../features/RectificationOfData/workerTypeRectification/listPages/OtherWorkerList";
import TransportWorkerList from "../../../../features/RectificationOfData/workerTypeRectification/listPages/TransportWorkerList";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";

const WorkerTypeCorrectionList = () => {
    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const clearSearchParams = () => {
        setSearchParams("");
    };
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Worker Type Rectification", url: "" }));
    }, []);
    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card-nav-tabs mb-4">
                        <Tabs
                            defaultActiveKey="0"
                            onSelect={() => {
                                clearSearchParams();
                            }}
                        >
                            <Tab eventKey="0" title="Other Worker">
                                <OtherWorkerList />
                            </Tab>
                            <Tab eventKey="1" title="Construction Worker">
                                <ConstructionList />
                            </Tab>
                            <Tab eventKey="2" title="Transport Worker">
                                <TransportWorkerList />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WorkerTypeCorrectionList;
