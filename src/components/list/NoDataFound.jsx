import React from "react";
import noDataFound from "../../../public/assets/no_data.png";

const NoDataFound = () => {
    const noData = {
        color: "#001848",
        marginTop: "7px",
    };
    return (
        <>
            <div className="text-center">
                <div className="row" style={{ width: "100%" }}>
                    <div className="col-md-12">
                        <img src={noDataFound} alt="" style={{ height: "100%", width: "10%" }} />
                    </div>
                    <div className="col-md-12" style={noData}>
                        <i className="fa-regular fa-face-sad-tear"></i> <span>NO DATA FOUND!</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NoDataFound;
