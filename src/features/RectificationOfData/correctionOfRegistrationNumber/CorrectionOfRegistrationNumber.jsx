/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Pending from "./Pending";
import Updated from "./Updated";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const CorrectionOfRegistrationNumber = () => {
    const [searchParams, setSearchParams] = useSearchParams(true);
    const searchParamsRemove = () => {
        setSearchParams("");
    };
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Registration Number Rectification (OW)", url: "" }));
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
                            <Tab eventKey="0" title="Pending List">
                                <Pending />
                            </Tab>
                            <Tab eventKey="1" title="Updated List">
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
