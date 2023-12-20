import { useEffect } from "react";
import { fetcher } from "../../../utils";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";
import CommissionClaimCeoForm from "../../../features/commission/Claim/CommissionClaimCeoForm";
import CommissionClaimCfcaoForm from "../../../features/commission/Claim/CommissionClaimCfcaoForm";
import CommissionClaimCeoRelease from "../../../features/commission/Claim/CommissionClaimCeoRelease";
import CommissionClaimMemoList from "../../../features/commission/Claim/CommissionClaimMemoList";
import CommissionClaimAdviceList from "../../../features/commission/Claim/CommissionClaimAdviceList";

const CommissionClaimWorkerType = ({ cuType }) => {
    const { data } = useQuery(["commission-worker-type"], () => fetcher(`/commission-worker-type`));

    const dispatch = useDispatch();
    let title = "";
    if (cuType == 4 || cuType == 5) title = "Pending Commission Pay (Claim)";
    if (cuType == 41) title = "Generate Memo (Claim)";
    if (cuType == 42) title = "Memo List (Claim)";
    if (cuType == 32) title = "Advice List (Claim)";
    useEffect(() => {
        dispatch(setPageAddress({ title: title, url: "" }));
    }, [cuType]);

    return (
        <>
            <div className="card datatable-box">
                <div className="card-body">
                    {data && (
                        <>
                            {cuType == 4 && <CommissionClaimCeoForm workerType={data.worker_type} />}
                            {cuType == 5 && <CommissionClaimCfcaoForm workerType={data.worker_type} />}
                            {cuType == 41 && <CommissionClaimCeoRelease workerType={data.worker_type} />}
                            {cuType == 42 && <CommissionClaimMemoList workerType={data.worker_type} />}
                            {cuType == 32 && <CommissionClaimAdviceList />}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CommissionClaimWorkerType;
