import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { Tab, Tabs } from "react-bootstrap";
import CommissionEdistForm from "../../../features/commission/CW_TW/CommissionEdistForm";
import CommissionEdistAlcForm from "../../../features/commission/CW_TW/CommissionEdistAlcForm";
import CommissionEdistGenerateAdvice from "../../../features/commission/CW_TW/CommissionEdistGenerateAdvice";

const CommissionEdist = ({ cuType }) => {
    const [active, setActive] = useState(0);
    const workerType = ["WBBOCW", "WBBTWSSS"];

    const dispatch = useDispatch();
    let title = "";
    if (cuType == 1) title = "Commission For WBBOCW & WBTWSSS";
    if (cuType == 3) title = "Pending Commission Pay (WBBOCW & WBTWSSS)";
    if (cuType == 31) title = "Generate Advice (WBBOCW & WBTWSSS)";
    useEffect(() => {
        dispatch(setPageAddress({ title: title, url: "" }));
    }, [cuType]);

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card-nav-tabs mb-4">
                        <Tabs
                            defaultActiveKey="0"
                            activeKey={active}
                            onSelect={(k) => {
                                setActive(k);
                            }}
                            id="uncontrolled-tab-example"
                        >
                            {workerType.map((item, i) => {
                                return (
                                    <Tab eventKey={i} title={item} key={i}>
                                        {active == i && (
                                            <>
                                                {cuType == 1 && <CommissionEdistForm workerType={i} workerTypeArray={workerType} />}
                                                {cuType == 3 && <CommissionEdistAlcForm workerType={i} />}
                                                {cuType == 31 && <CommissionEdistGenerateAdvice workerType={i} />}
                                            </>
                                        )}
                                    </Tab>
                                );
                            })}
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommissionEdist;
