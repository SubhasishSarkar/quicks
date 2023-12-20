import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { Tab, Tabs } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import FormIVBankListWorkerTypeWise from "../../../features/form4/formIVBank/FormIVBankListWorkerTypeWise";

const FormIVBackList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageAddress({ title: "Form IV Participating Bank List", url: "" }));
    }, [dispatch]);

    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const handleTabChange = (e) => {
        setSearchParams("type=" + e);
    };

    return (
        <>
            <div className="card-nav-tabs">
                <Tabs defaultActiveKey="ow" onSelect={(e) => handleTabChange(e)}>
                    <Tab eventKey="ow" title="WBUSWWB (OW)">
                        <FormIVBankListWorkerTypeWise type="ow" />
                    </Tab>
                    <Tab eventKey="cw" title="WBB&OCWWB (CW)">
                        <FormIVBankListWorkerTypeWise type="cw" />
                    </Tab>
                    <Tab eventKey="tw" title="WBSSSB (TW)">
                        <FormIVBankListWorkerTypeWise type="tw" />
                    </Tab>
                </Tabs>
            </div>
        </>
    );
};

export default FormIVBackList;
