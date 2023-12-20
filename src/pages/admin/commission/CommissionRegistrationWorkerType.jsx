import { useEffect } from "react";
import CommissionRegistrationCeoForm from "../../../features/commission/Registration/CommissionRegistrationCeoForm";
import CommissionRegistrationCfcaoForm from "../../../features/commission/Registration/CommissionRegistrationCfcaoForm";
import CommissionRegistrationCeoRelease from "../../../features/commission/Registration/CommissionRegistrationCeoRelease";
import CommissionRegistrationMemoList from "../../../features/commission/Registration/CommissionRegistrationMemoList";
import CommissionRegistrationAdviceList from "../../../features/commission/Registration/CommissionRegistrationAdviceList";
import { fetcher } from "../../../utils";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const CommissionRegistrationWorkerType = ({ cuType }) => {
    const { data } = useQuery(["commission-worker-type"], () => fetcher(`/commission-worker-type`));

    const dispatch = useDispatch();
    let title = "";
    if (cuType == 4 || cuType == 5) title = "Pending Commission Pay";
    if (cuType == 41) title = "Generate Memo (Registration)";
    if (cuType == 42) title = "Memo List (Registration)";
    if (cuType == 32) title = "Advice List (Registration)";
    useEffect(() => {
        dispatch(setPageAddress({ title: title, url: "" }));
    }, [cuType]);

    return (
        <>
            <div className="card datatable-box">
                <div className="card-body">
                    {data && (
                        <>
                            {cuType == 4 && <CommissionRegistrationCeoForm workerType={data.worker_type} />}
                            {cuType == 5 && <CommissionRegistrationCfcaoForm workerType={data.worker_type} />}
                            {cuType == 41 && <CommissionRegistrationCeoRelease workerType={data.worker_type} />}
                            {cuType == 42 && <CommissionRegistrationMemoList workerType={data.worker_type} />}
                            {cuType == 32 && <CommissionRegistrationAdviceList />}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CommissionRegistrationWorkerType;
