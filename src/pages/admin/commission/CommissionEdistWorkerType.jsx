import { useEffect } from "react";
import { fetcher } from "../../../utils";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import CommissionEdistCeoForm from "../../../features/commission/CW_TW/CommissionEdistCeoForm";
import CommissionEdistCfcaoForm from "../../../features/commission/CW_TW/CommissionEdistCfcaoForm";
import CommissionEdistCeoRelease from "../../../features/commission/CW_TW/CommissionEdistCeoRelease";
import CommissionEdistMemoList from "../../../features/commission/CW_TW/CommissionEdistMemoList";
import CommissionEdistAdviceList from "../../../features/commission/CW_TW/CommissionEdistAdviceList";

const CommissionEdistWorkerType = ({ cuType }) => {
    const { data } = useQuery(["commission-worker-type"], () => fetcher(`/commission-worker-type`));

    const dispatch = useDispatch();
    let title = "";
    if (cuType == 4 || cuType == 5) title = "Pending Commission Pay (BOCW & WBTWSSS)";
    if (cuType == 41) title = "Generate Memo (BOCW & WBTWSSS)";
    if (cuType == 42) title = "Memo List (BOCW & WBTWSSS)";
    if (cuType == 32) title = "Advice List (BOCW & WBTWSSS)";
    useEffect(() => {
        dispatch(setPageAddress({ title: title, url: "" }));
    }, [cuType]);

    return (
        <>
            <div className="card datatable-box">
                <div className="card-body">
                    {data && (
                        <>
                            {cuType == 4 && <CommissionEdistCeoForm workerType={data.worker_type} />}
                            {cuType == 5 && <CommissionEdistCfcaoForm workerType={data.worker_type} />}
                            {cuType == 41 && <CommissionEdistCeoRelease workerType={data.worker_type} />}
                            {cuType == 42 && <CommissionEdistMemoList workerType={data.worker_type} />}
                            {cuType == 32 && <CommissionEdistAdviceList />}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CommissionEdistWorkerType;
