import React, { useEffect, useState } from "react";

const FundClaimListSearchBySsin = ({ searchTerm, setSearchTerm, filteredData }) => {
    const [srhVal, setSrhVal] = useState();

    useEffect(() => {
        if (filteredData?.length === 0 || filteredData?.length <= 3) setSrhVal();
    }, [filteredData]);

    return (
        <div>
            <div className="row height d-flex justify-content-center align-items-center mb-2">
                <div className="col-md-6">
                    <div className="form" style={{ position: "relative" }}>
                        <input
                            className="form-control form-input"
                            placeholder="you can search by enter full ssin or last 3/4 digits of ssin"
                            type="text"
                            id="example-search-input"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setSrhVal(e.target.value);
                            }}
                        />
                        <div style={{ position: "absolute", right: "17px", top: "5px", padding: "2px", borderLeft: "1px solid #d1d5db" }}>
                            <span className="left-pan" style={{ paddingLeft: "7px" }}>
                                {srhVal ? (
                                    <>
                                        <span style={{ fontSize: "10px", position: "relative", bottom: "5px", right: "2px" }}>searching</span>
                                        <i className="fa-solid fa-ellipsis fa-fade"></i>
                                        {/* <i className="fa-solid fa-magnifying-glass fa-flip" style={{ paddingLeft: "10px" }}>
                                            <span>searching...</span>
                                        </i>{" "}
                                        <br /> */}
                                    </>
                                ) : (
                                    <i className="fa fa-search" style={{ paddingLeft: "10px" }}></i>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundClaimListSearchBySsin;
