import React, { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Pending from "./Pending";
import Updated from "./Updated";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const CorrectionOfRegistrationNumber = () => {
    //only setter function
    const setSearchParams = useSearchParams(true)[1];
    const searchParamsRemove = () => {
        setSearchParams("");
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Registration Date Rectification (OW)", url: "" }));
    }, []);

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card-nav-tabs mb-4">
                        <Tabs
                            defaultActiveKey="0"
                            onSelect={() => {
                                searchParamsRemove();
                            }}
                            id="uncontrolled-tab-example"
                        >
                            <Tab eventKey="0" title="Pending">
                                <Pending />
                            </Tab>
                            <Tab eventKey="1" title="Updated">
                                <Updated />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CorrectionOfRegistrationNumber;
