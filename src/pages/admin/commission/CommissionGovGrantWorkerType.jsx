import { useEffect } from "react";
import CommissionGovGrantCeoForm from "../../../features/commission/GovGrant/CommissionGovGrantCeoForm";
import CommissionGovGrantCfcaoForm from "../../../features/commission/GovGrant/CommissionGovGrantCfcaoForm";
import CommissionGovGrantCeoRelease from "../../../features/commission/GovGrant/CommissionGovGrantCeoRelease";
import CommissionGovGrantMemoList from "../../../features/commission/GovGrant/CommissionGovGrantMemoList";
import CommissionGovGrantAdviceList from "../../../features/commission/GovGrant/CommissionGovGrantAdviceList";
import { fetcher } from "../../../utils";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setPageAddress } from "../../../store/slices/headerTitleSlice";

const CommissionGovGrantWorkerType = ({ cuType }) => {
    const { data } = useQuery(["commission-worker-type"], () => fetcher(`/commission-worker-type`));

    const dispatch = useDispatch();
    let title = "";
    if (cuType == 4 || cuType == 5) title = "Government Grant";
    if (cuType == 41) title = "Generate Memo (Gov Grant)";
    if (cuType == 42) title = "Memo List (Gov Grant)";
    if (cuType == 32) title = "Advice List (Gov Grant)";
    useEffect(() => {
        dispatch(setPageAddress({ title: title, url: "" }));
    }, [cuType]);

    return (
        <>
            <div className="card datatable-box">
                <div className="card-body">
                    {data && (
                        <>
                            {cuType == 4 && <CommissionGovGrantCeoForm workerType={data.worker_type} />}
                            {cuType == 5 && <CommissionGovGrantCfcaoForm workerType={data.worker_type} />}
                            {cuType == 41 && <CommissionGovGrantCeoRelease workerType={data.worker_type} />}
                            {cuType == 42 && <CommissionGovGrantMemoList workerType={data.worker_type} />}
                            {cuType == 32 && <CommissionGovGrantAdviceList />}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CommissionGovGrantWorkerType;
