import React from "react";
import { useParams } from "react-router";
import ApproveList from "../../../features/IMWApplicationList/ApproveList";
import BackForCorrectionList from "../../../features/IMWApplicationList/BackForCorrectionList";
import PendingList from "../../../features/IMWApplicationList/PendingList";
import RejectList from "../../../features/IMWApplicationList/RejectList";
import SSYApprovedList from "../../../features/IMWApplicationList/SSYApprovedList";

const ImwApplicationList = ({ gpFilterAddOn }) => {
    const { type } = useParams();
    return (
        <>
            {type == "pending" && <PendingList gpFilterAddOn={gpFilterAddOn} />}
            {type == "approved" && <ApproveList gpFilterAddOn={gpFilterAddOn} />}
            {type == "back-for-rectification" && <BackForCorrectionList gpFilterAddOn={gpFilterAddOn} />}
            {type == "reject" && <RejectList gpFilterAddOn={gpFilterAddOn} />}
            {type == "ssyApprovedList" && <SSYApprovedList />}
        </>
    );
};

export default ImwApplicationList;
