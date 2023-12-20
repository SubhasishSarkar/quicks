import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../../store/slices/headerTitleSlice";
import { useSearchParams } from "react-router-dom";

import { Tab, Tabs } from "react-bootstrap";
import AadharRectificationPendingList from "../../../../features/RectificationOfData/AadharRectification/AadharRectificationPendingList";
import AadharRectificationSamePersonList from "../../../../features/RectificationOfData/AadharRectification/AadharRectificationSamePersonList";
import AadharRectificationDifferentPerson from "../../../../features/RectificationOfData/AadharRectification/AadharRectificationDifferentPerson";

const AadharRectificationList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageAddress({ title: "Aadhar Rectification", url: "" }));
    }, []);

    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const clearSearchParams = () => {
        setSearchParams("");
    };

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
                            <Tab eventKey="0" title="Pending List">
                                <AadharRectificationPendingList />
                            </Tab>
                            <Tab eventKey="1" title="Same Person">
                                <AadharRectificationSamePersonList />
                            </Tab>
                            <Tab eventKey="2" title="Different Person">
                                <AadharRectificationDifferentPerson />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AadharRectificationList;
