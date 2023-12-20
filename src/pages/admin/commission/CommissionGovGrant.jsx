import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import CommissionGovGrantForm from "../../../features/commission/GovGrant/CommissionGovGrantForm";
import CommissionGovGrantInspectorForm from "../../../features/commission/GovGrant/CommissionGovGrantInspectorForm";
import CommissionGovGrantAlcForm from "../../../features/commission/GovGrant/CommissionGovGrantAlcForm";
import CommissionGovGrantGenerateAdvice from "../../../features/commission/GovGrant/CommissionGovGrantGenerateAdvice";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const CommissionGovGrant = ({ cuType }) => {
    const [active, setActive] = useState(0);
    const workerType = ["Other Worker", "Construction Worker", "Transport Worker"];

    const dispatch = useDispatch();
    let title = "";
    if (cuType == 1) title = "Commission Government Grant";
    if (cuType == 2) title = "Claim Of Service Provider";
    if (cuType == 3) title = "Government Grant";
    if (cuType == 31) title = "Generate Advice (Gov Grant)";
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
                                                {cuType == 1 && <CommissionGovGrantForm workerType={i} />}
                                                {cuType == 2 && <CommissionGovGrantInspectorForm workerType={i} />}
                                                {cuType == 3 && <CommissionGovGrantAlcForm workerType={i} />}
                                                {cuType == 31 && <CommissionGovGrantGenerateAdvice workerType={i} />}
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

export default CommissionGovGrant;
