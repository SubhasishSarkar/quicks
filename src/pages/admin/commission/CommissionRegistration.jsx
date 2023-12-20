import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import CommissionRegistrationForm from "../../../features/commission/Registration/CommissionRegistrationForm";
import CommissionRegistrationAlcForm from "../../../features/commission/Registration/CommissionRegistrationAlcForm";
import CommissionRegistrationGenerateAdvice from "../../../features/commission/Registration/CommissionRegistrationGenerateAdvice";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import { useDispatch } from "react-redux";

const CommissionRegistration = ({ cuType }) => {
    const [active, setActive] = useState(0);
    const workerType = ["Other Worker", "Construction Worker", "Transport Worker"];

    const dispatch = useDispatch();
    let title = "";
    if (cuType == 1) title = "Commission For Registration";
    if (cuType == 3) title = "Pending Commission Pay (Registration)";
    if (cuType == 31) title = "Generate Advice (Registration)";
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
                                                {cuType == 1 && <CommissionRegistrationForm workerType={i} />}
                                                {cuType == 3 && <CommissionRegistrationAlcForm workerType={i} />}
                                                {cuType == 31 && <CommissionRegistrationGenerateAdvice workerType={i} />}
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

export default CommissionRegistration;
