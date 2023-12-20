import React from "react";
import { NavLink } from "react-router-dom";
import InfoOverlay from "../../components/InfoOverlay";
import AllWorkerCount from "./AllWorkerCount";

const SloDashboard = () => {
    const quickAccess = [
        {
            name: "New Registration",
            link: "/caf",
            icon: "fa-regular fa-id-card",
        },
        {
            name: "Add New Claim",
            link: "/claim/entry",
            icon: "fa-solid fa-user-shield",
        },
        {
            name: "Add Changed Request",
            link: "/change-request/entry",
            icon: "fa-solid fa-code-pull-request",
        },
        {
            name: "Search Beneficiary",
            link: "/search-beneficiary/ndf",
            icon: "fa-brands fa-searchengin",
        },
        {
            name: "PF Passbook Search",
            link: "/pf-passbook/ppu-search-passbook",
            icon: "fa-solid fa-book",
        },
        {
            name: "BMSSY Approved List",
            link: "/beneficiary-approved-list/bmssy",
            icon: "fa-solid fa-list",
        },
        {
            name: "SSY Approved List",
            link: "/beneficiary-approved-list/ssy",
            icon: "fa-solid fa-list",
        },
        {
            name: "E-District Update",
            link: "/e-district",
            icon: "fa-regular fa-id-card",
        },
        {
            name: "DS-PF Passbook Search",
            link: "/duare-sarkar/search-passbook-pf",
            icon: "fa-solid fa-receipt",
        },
    ];

    return (
        <>
            <AllWorkerCount />
            <div className="card shadow border-0" style={{ background: "#0996eb2e" }}>
                <div className="card-header text-primary border-0 fw-semibold" style={{ background: "#0996eb2e" }}>
                    Quick Access <InfoOverlay info={"All of this options are for quick access. Click any of this button and system will be auto redirecting on this particular page."} />
                </div>
                <div className="card-body">
                    <div className="text-center">
                        <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
                            {quickAccess.map((item, index) => {
                                return (
                                    <div className="col" key={index}>
                                        <NavLink to={item.link} style={{ textDecoration: "none", color: "#111" }}>
                                            <div className="p-2 border bg-primary bg-opacity-75 shadow text-light rounded  border-0">
                                                <i className={item.icon}></i> {item.name}
                                            </div>
                                        </NavLink>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SloDashboard;
