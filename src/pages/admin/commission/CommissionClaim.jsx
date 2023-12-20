import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useDispatch } from "react-redux";
import CommissionClaimForm from "../../../features/commission/Claim/CommissionClaimForm";
import CommissionClaimAlcForm from "../../../features/commission/Claim/CommissionClaimAlcForm";
import CommissionClaimGenerateAdvice from "../../../features/commission/Claim/CommissionClaimGenerateAdvice";

const CommissionClaim = ({ cuType }) => {
    const [active, setActive] = useState(0);
    const workerType = ["Other Worker", "Construction Worker", "Transport Worker"];

    const dispatch = useDispatch();
    let title = "";
    if (cuType == 1) title = "Commission For Claim";
    if (cuType == 3) title = "Pending Commission Pay (Claim)";
    if (cuType == 31) title = "Generate Advice (Claim)";
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
                                                {cuType == 1 && <CommissionClaimForm workerType={i} />}
                                                {cuType == 3 && <CommissionClaimAlcForm workerType={i} />}
                                                {cuType == 31 && <CommissionClaimGenerateAdvice workerType={i} />}
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

export default CommissionClaim;
