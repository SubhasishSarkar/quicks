import { useState } from "react";
import WestBengalMap from "../../components/WestBengalMap";
// import AdminClaimAmountChart from "../../components/charts/SystemAdmin/AdminClaimAmountChart";
// import AdminClaimChart from "../../components/charts/SystemAdmin/AdminClaimChart";
// import AdminRectificationChart from "../../components/charts/SystemAdmin/AdminRectificationChart";
// import AdminRegCountChart from "../../components/charts/SystemAdmin/AdminRegCountChart";

import { district as districtData } from "../../data";
import WestBengalMapWiseData from "../../components/charts/SystemAdmin/WestBengalMapWiseData";

const SystemAdminDashboard = () => {
    const [districtName, setDistrictName] = useState("");
    const [districtId, setDistrictId] = useState(0);

    return (
        <>
            <div className="map-row">
                <WestBengalMap districtData={districtData} setDistrictName={setDistrictName} setDistrictId={setDistrictId} districtId={districtId} />
                <div className="map-right-colmn">
                    <WestBengalMapWiseData districtId={districtId} districtName={districtName} setDistrictId={setDistrictId} />
                </div>
            </div>

            {/* <div className="d-flex justify-content-md-between row-cols-2 gap-2">
                <AdminClaimChart />

                <AdminClaimAmountChart />
            </div>
            <div className="d-flex justify-content-md-between row-cols-2 gap-2">
                <AdminRegCountChart />

                <AdminRectificationChart />
            </div> */}
        </>
    );
};

export default SystemAdminDashboard;
