import React, { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../../store/slices/headerTitleSlice";
import WorkerTypeBasedAdviceList from "./WorkerTypeBasedAdviceList";

const AlcAdviceList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Advice List", url: "" }));
    }, []);

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card-nav-tabs mb-4">
                        <Tabs defaultActiveKey="1">
                            <Tab eventKey="1" title="Other Worker">
                                <WorkerTypeBasedAdviceList type="ow" />
                            </Tab>
                            <Tab eventKey="2" title="Construction Worker">
                                <WorkerTypeBasedAdviceList type="cw" />
                            </Tab>
                            <Tab eventKey="3" title="Transport Worker">
                                <WorkerTypeBasedAdviceList type="tw" />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlcAdviceList;
