import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import useDeviceDetector, { isMobile } from "../../hooks/DeviceDetector";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const links = [
    {
        link: "/dashboard",
        label: "Dashboard",
        icon: "fa-solid fa-house-chimney",
        access: ["*"],
    },
    {
        link: "/user-manual",
        label: "SOP/User Manual",
        icon: "fa-solid fa-glasses",
        access: ["ALC"],
    },
    // {
    //     link: "/sample",
    //     label: "Sample",
    //     icon: "fa-solid fa-house-chimney",
    //     access: ["SUPER ADMIN"],
    // },
    {
        link: "/alc-user-management",
        label: "User Management",
        icon: "fa-solid  fa-users-gear",
        access: ["ALC"],
        links: [
            /* {
                link: "pan-aadhaar-linked-list",
                label: "Pan Aadhaar Linked List",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },*/
            {
                link: "add-user",
                label: "Add User",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "posting-area",
                label: "Posting Area",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "alc-serviceprovider-list",
                label: "Info Modification",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "slo-ca-list",
                label: "SLO/CA List",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "imw-list",
                label: "Inspector List",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "ckco-list",
                label: "CKCO List",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
        ],
    },
    {
        link: "/caf",
        label: "Beneficiary Registration",
        icon: "fa-regular fa-id-card",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    // {
    //     link: "/caf",
    //     label: "Beneficiary Registration V2",
    //     icon: "fa-regular fa-id-card",
    //     access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    // },

    {
        link: "/application-list",
        label: "Application List",
        icon: "fa-solid fa-list-check",
        access: ["inspector"],
        links: [
            {
                link: "pending",
                label: "Pending",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
            {
                link: "approved",
                label: "Approved",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
            {
                link: "back-for-rectification",
                label: "Back For Rectification",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
            {
                link: "reject",
                label: "Reject",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
            {
                link: "ssyApprovedList",
                label: "Approved in SSY Portal",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
        ],
    },
    {
        link: "/my-application-list",
        label: "My Application List",
        icon: "fa-solid fa-list-check",
        access: ["SLO", "CA", "DEO", "inspector", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/beneficiary-approved-list",
        label: "Approved Beneficiary",
        icon: "fa-solid fa-user-shield",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
        links: [
            {
                link: "bmssy",
                label: "BMSSY Approved",
                icon: "fa-solid fa-circle",
                access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "ssy",
                label: "SSY Approved",
                icon: "fa-solid fa-circle",
                access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
        ],
    },
    {
        link: "/back-log-data-list",
        label: "Backlog Data",
        icon: "fa-solid fa-database",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/search-beneficiary/ndf",
        label: "Search Beneficiary",
        icon: "fa-brands fa-searchengin",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/beneficiary-list",
        label: "Beneficiary List",
        icon: "fa-regular fa-address-book",
        access: ["ALC"],
    },
    {
        link: "/search-beneficiary",
        label: "Search Beneficiary",
        icon: "fa-brands fa-searchengin",
        access: ["SUPER ADMIN"],
        links: [
            {
                link: "ndf",
                label: "Search Beneficiary (NDF)",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN"],
            },
            {
                link: "all",
                label: "Search Beneficiary (ALL)",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN"],
            },
        ],
    },
    {
        link: "/claim",
        label: "Claim",
        icon: "fa-solid fa-user-shield",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "ceo_cw", "ceo_tw", "ceo_ow", "cfco_ow", "cfco_cw", "cfco_tw", "collectingagent", "otherserviceprovider", "CKCO"],
        links: [
            {
                link: "list",
                label: "List",
                icon: "fa-solid fa-circle",
                access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "ceo_cw", "ceo_tw", "ceo_ow", "cfco_ow", "cfco_cw", "cfco_tw", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "entry",
                label: "Entry",
                icon: "fa-solid fa-circle",
                access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "death-claim-backlog-data",
                label: "Death Backlog Data",
                icon: "fa-solid fa-circle",
                access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "fund-request-list",
                label: "Fund Request List",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "advice-generate",
                label: "Generate Advice",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "advice-list",
                label: "Advice List",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "mis-report",
                label: "MIS Report",
                icon: "fa-solid fa-circle",
                access: ["ALC", "inspector"],
            },
        ],
    },
    {
        link: "/change-request",
        label: "Changed Request",
        icon: "fa-solid fa-code-pull-request",
        access: ["SLO", "CA", "DEO", "inspector", "collectingagent", "otherserviceprovider", "CKCO"],
        links: [
            {
                link: "list",
                label: "List",
                icon: "fa-solid fa-circle",
                access: ["SLO", "CA", "DEO", "inspector", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "entry",
                label: "New Entry",
                icon: "fa-solid fa-circle",
                access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
        ],
    },
    {
        link: "/offline-claim",
        label: "Offline Claim",
        icon: "fa-solid fa-plane-circle-exclamation",
        access: ["inspector", "ALC", "SUPER ADMIN"],
        links: [
            {
                link: "list",
                label: "List",
                icon: "fa-solid fa-circle",
                access: ["inspector", "ALC", "SUPER ADMIN"],
            },
            {
                link: "entry",
                label: "New Entry",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
            {
                link: "report",
                label: "Report",
                icon: "fa-solid fa-circle",
                access: ["ALC", "SUPER ADMIN"],
            },
            {
                link: "mis-report",
                label: "MIS Report",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN"],
            },
        ],
    },
    {
        link: "/pf-passbook",
        label: "PF Passbook Updation",
        icon: "fa-solid fa-receipt",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO", "SUPER ADMIN", "inspector", "ALC"],
        links: [
            {
                link: "ppu-service",
                label: "PF Passbook Entry",
                icon: "fa-solid fa-book",
                access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "ppu-change-collected-arn",
                label: "ARN-Beneficiary",
                subLabel: "(Tagging Change)",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
            {
                link: "ppu-search-passbook",
                label: "Search",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN", "inspector", "ALC", "SLO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "ppu-passbook-list",
                label: "List",
                icon: "fa-solid fa-circle",
                access: ["inspector", "SUPER ADMIN", "ALC"],
            },
            {
                link: "ppu-passbook-list-sp",
                label: "List",
                icon: "fa-solid fa-circle",
                access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "ppu-date-management",
                label: "Date Management",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN"],
            },
        ],
    },
    {
        link: "/duare-sarkar",
        label: "Duare Sarkar",
        icon: "fa-solid fa-building-columns ",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO", "SUPER ADMIN", "inspector", "ALC", "DLC"],
        links: [
            {
                link: "ds-blockwise-report",
                label: "Blockwise Report",
                subLabel: "(DS 8)",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN", "ALC"],
            },
            {
                link: "ds-report-pf",
                label: "Report",
                subLabel: "(PF)",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN", "DLC"],
            },
            {
                link: "pf-list",
                label: "List",
                subLabel: "(PF)",
                icon: "fa-solid fa-circle",
                access: ["inspector", "SUPER ADMIN", "ALC"],
            },
            {
                link: "duare-pf-list",
                label: "List",
                subLabel: "(PF)",
                icon: "fa-solid fa-circle",
                access: ["collectingagent", "otherserviceprovider", "CKCO", "SLO"],
            },
            {
                link: "summary-report-pf",
                label: "Summary Report",
                subLabel: "(PF)",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN", "ALC", "inspector"],
            },
            {
                link: "search-passbook-pf",
                label: "Search Passbook",
                subLabel: "(PF)",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN", "inspector", "ALC", "SLO", "collectingagent", "otherserviceprovider", "CKCO"],
            },

            {
                link: "caf-list",
                label: "CAF List",
                subLabel: "(DS INFO)",
                icon: "fa-solid fa-circle",
                access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "caf-entry",
                label: "CAF Entry",
                subLabel: "(DS INFO)",
                icon: "fa-solid fa-circle",
                access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "admin-caf-list",
                label: "List",
                subLabel: "(CAF)",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN"],
            },
            {
                link: "alc-caf-list",
                label: "List",
                subLabel: "(CAF)",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "summary-report",
                label: "Summary Report",
                subLabel: "(CAF)",
                icon: "fa-solid fa-circle",
                access: ["ALC", "SUPER ADMIN"],
            },
            {
                link: "district-wise-report",
                label: "District Wise Report",
                subLabel: "(CAF)",
                icon: "fa-solid fa-circle",
                access: ["ALC", "SUPER ADMIN"],
            },
        ],
    },
    {
        link: "/commission",
        label: "Commission",
        icon: "fa-solid fa-wallet",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
        links: [
            {
                link: "monthly-payment-slo",
                label: "Registration (BMSSY)",
                icon: "fa-solid fa-circle",
                access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "ds-monthly-payment-slo",
                label: "Govt Grant",
                icon: "fa-solid fa-circle",
                access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "edist-monthly-payment-slo",
                label: "BOCW & WBTWSSS",
                icon: "fa-solid fa-circle",
                access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "claim-monthly-payment-slo",
                label: "Claim",
                icon: "fa-solid fa-circle",
                access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
        ],
    },
    {
        link: "/commission",
        label: "Commission",
        subLabel: "(Registration)",
        icon: "fa-solid fa-wallet",
        access: ["ALC", "ceo_ow", "ceo_cw", "ceo_tw", "cfco_ow", "cfco_cw", "cfco_tw"],
        links: [
            {
                link: "monthly-payment-alc",
                label: "Pending Commission Pay",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "monthly-payment-ceo",
                label: "Pending Commission Pay",
                icon: "fa-solid fa-circle",
                access: ["ceo_ow", "ceo_cw", "ceo_tw"],
            },
            {
                link: "monthly-payment-cfcao",
                label: "Pending Commission Pay",
                icon: "fa-solid fa-circle",
                access: ["cfco_ow", "cfco_cw", "cfco_tw"],
            },
            {
                link: "fund-release-list",
                label: "Fund Release List",
                icon: "fa-solid fa-circle",
                access: ["ceo_ow", "ceo_cw", "ceo_tw"],
            },
            {
                link: "view-memo-list",
                label: "Memo List",
                icon: "fa-solid fa-circle",
                access: ["ceo_ow", "ceo_cw", "ceo_tw"],
            },
            {
                link: "generate-advice-alc",
                label: "Generate Advice",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "view-advice-list-alc",
                label: "View Advice List",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
        ],
    },
    {
        link: "/commission",
        label: "Commission",
        subLabel: "(Govt Grant)",
        icon: "fa-solid fa-wallet",
        access: ["inspector", "ALC", "ceo_ow", "ceo_cw", "ceo_tw", "cfco_ow", "cfco_cw", "cfco_tw"],
        links: [
            {
                link: "ds-monthly-payment-inspector",
                label: "Claim of Service Provider",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
            {
                link: "ds-monthly-payment-alc",
                label: "Government Grant",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "ds-monthly-payment-ceo",
                label: "Government Grant",
                icon: "fa-solid fa-circle",
                access: ["ceo_ow", "ceo_cw", "ceo_tw"],
            },
            {
                link: "ds-monthly-payment-cfcao",
                label: "Government Grant",
                icon: "fa-solid fa-circle",
                access: ["cfco_ow", "cfco_cw", "cfco_tw"],
            },
            {
                link: "ds-fund-release-list",
                label: "Fund Release List",
                icon: "fa-solid fa-circle",
                access: ["ceo_ow", "ceo_cw", "ceo_tw"],
            },
            {
                link: "ds-view-memo-list",
                label: "Memo List",
                icon: "fa-solid fa-circle",
                access: ["ceo_ow", "ceo_cw", "ceo_tw"],
            },
            {
                link: "ds-generate-advice-alc",
                label: "Generate Advice",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "ds-view-advice-list-alc",
                label: "View Advice List",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
        ],
    },
    {
        link: "/commission",
        label: "Commission",
        subLabel: "(Bocw,Twsss)",
        icon: "fa-solid fa-wallet",
        //access: ["ALC", "ceo_ow", "ceo_cw", "ceo_tw", "cfco_ow", "cfco_cw", "cfco_tw"],
        access: ["ALC", "ceo_ow", "ceo_cw", "ceo_tw", "cfco_ow", "cfco_cw", "cfco_tw"],
        links: [
            {
                link: "edist-monthly-payment-alc",
                label: "Pending Commission Pay",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "edist-monthly-payment-ceo",
                label: "Pending Commission Pay",
                icon: "fa-solid fa-circle",
                access: ["ceo_ow", "ceo_cw", "ceo_tw"],
            },
            {
                link: "edist-monthly-payment-cfcao",
                label: "Pending Commission Pay",
                icon: "fa-solid fa-circle",
                access: ["cfco_ow", "cfco_cw", "cfco_tw"],
            },
            {
                link: "edist-fund-release-list",
                label: "Fund Release List",
                icon: "fa-solid fa-circle",
                access: ["ceo_ow", "ceo_cw", "ceo_tw"],
            },
            {
                link: "edist-view-memo-list",
                label: "Memo List",
                icon: "fa-solid fa-circle",
                access: ["ceo_ow", "ceo_cw", "ceo_tw"],
            },
            {
                link: "edist-generate-advice-alc",
                label: "Generate Advice",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "edist-view-advice-list-alc",
                label: "View Advice List",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
        ],
    },
    {
        link: "/commission",
        label: "Commission",
        subLabel: "(Claim)",
        icon: "fa-solid fa-wallet",
        access: ["ALC", "ceo_ow", "ceo_cw", "ceo_tw", "cfco_ow", "cfco_cw", "cfco_tw"],
        links: [
            {
                link: "claim-monthly-payment-alc",
                label: "Pending Commission Pay",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "claim-monthly-payment-ceo",
                label: "Pending Commission Pay",
                icon: "fa-solid fa-circle",
                access: ["ceo_ow", "ceo_cw", "ceo_tw"],
            },
            {
                link: "claim-monthly-payment-cfcao",
                label: "Pending Commission Pay",
                icon: "fa-solid fa-circle",
                access: ["cfco_ow", "cfco_cw", "cfco_tw"],
            },
            {
                link: "claim-fund-release-list",
                label: "Fund Release List",
                icon: "fa-solid fa-circle",
                access: ["ceo_ow", "ceo_cw", "ceo_tw"],
            },
            {
                link: "claim-view-memo-list",
                label: "Memo List",
                icon: "fa-solid fa-circle",
                access: ["ceo_ow", "ceo_cw", "ceo_tw"],
            },
            {
                link: "claim-generate-advice-alc",
                label: "Generate Advice",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
            {
                link: "claim-view-advice-list-alc",
                label: "View Advice List",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
        ],
    },
    {
        link: "/rectification",
        label: "Rectification of data",
        icon: "fa-solid fa-sliders",
        access: ["inspector", "SLO", "content management"],
        links: [
            {
                link: "registration-number",
                label: "Registration Number",
                subLabel: "(OW)",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
            {
                link: "registration-date",
                label: "Registration Date",
                subLabel: "(OW)",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
            {
                link: "registration-date-cw-tw",
                label: "Registration Date",
                subLabel: "(CW & TW)",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
            {
                link: "worker-type",
                label: "Worker Type",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
            // {
            //     link: "worker-type-by-ssin",
            //     label: "Worker Type By SSIN",
            //     icon: "fa-solid fa-circle",
            //     access: ["inspector"],
            // },
            // {
            //     link: "aadhar",
            //     label: "Aadhaar",
            //     icon: "fa-solid fa-circle",
            //     access: ["inspector"],
            // },
            {
                link: "address-rectification",
                label: "Address",
                icon: "fa-solid fa-circle",
                access: ["inspector"],
            },
            // {
            //     link: "verhoff-failed-aadhaar-rectification-list",
            //     label: "Invalid Aadhaar",
            //     icon: "fa-solid fa-circle",
            //     access: ["inspector"],
            // },
            {
                link: "verhoff-failed-aadhaar-rectification",
                label: "Aadhaar Rectification",
                icon: "fa-solid fa-circle",
                access: ["SLO", "collectingagent", "otherserviceprovider"],
            },
            {
                link: "aadhar-correction-imw",
                label: "Aadhaar Correction",
                icon: "fa-solid fa-circle",
                access: ["inspector", "content management"],
            },
        ],
    },

    {
        link: "/form4/imw-pay-in-slip-list",
        label: "Form-IV",
        icon: "fa-solid fa-users",
        access: ["inspector"],
    },
    {
        link: "/users-management",
        label: "Users Management",
        icon: "fa-solid fa-users",
        access: ["SUPER ADMIN", "DLC"],
        links: [
            {
                link: "addlc-list",
                label: "ADDLC List",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN"],
            },
            {
                link: "jlc-list",
                label: "JLC List",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN"],
            },
            {
                link: "dlc-list",
                label: "DLC List",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN"],
            },
            {
                link: "alc-list",
                label: "ALC List",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN", "DLC"],
            },
            {
                link: "imw-list",
                label: "IMW List",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN"],
            },
            {
                link: "service-provider-list",
                label: "Service Provider List",
                icon: "fa-solid fa-circle",
                access: ["DLC", "SUPER ADMIN"],
            },
        ],
    },

    {
        link: "/admin-beneficiary-list",
        label: "Beneficiary List",
        icon: "fa-solid fa-user-shield",
        access: ["SUPER ADMIN"],
    },
    {
        link: "/edistrict-renew",
        label: "Renew E-District",
        icon: "fa-regular fa-id-card",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO", "ALC", "inspector"],
        links: [
            {
                link: "",
                label: "Renew",
                icon: "fa-regular fa-id-card",
                access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
            },
            {
                link: "list",
                label: "List",
                icon: "fa-regular fa-id-card",
                access: ["ALC", "inspector"],
            },
        ],
    },
    {
        link: "",
        label: "SSY Payinslip",
        icon: "fa-solid fa-file-invoice-dollar",
        access: ["inspector", "SUPER ADMIN", "ALC", "DLC"],
        links: [
            {
                link: "ssy-paying-slip",
                label: "Payinslip Details",
                icon: "fa-solid fa-circle",
                access: ["inspector", "SUPER ADMIN", "ALC", "DLC"],
            },
            {
                link: "ssy-account-statement",
                label: "Account Statement",
                icon: "fa-solid  fa-circle",
                access: ["inspector", "SUPER ADMIN", "ALC", "DLC"],
            },
        ],
    },

    {
        link: "",
        label: "BMSSY Payinslip",
        icon: "fa-solid fa-file-invoice-dollar",
        access: ["inspector", "SUPER ADMIN", "ALC", "DLC"],
        links: [
            {
                link: "/bmssy-paying-slip",
                label: "Payinslip Details",
                icon: "fa-solid fa-circle",
                access: ["inspector", "SUPER ADMIN", "ALC", "DLC"],
            },
        ],
    },

    {
        link: "/tagging",
        label: "Tagging",
        icon: "fa-solid fa-tags",
        access: ["inspector", "SUPER ADMIN"],
        links: [
            {
                link: "same-scheme-ow",
                label: "Same Scheme (ow)",
                icon: "fa-solid fa-circle",
                access: ["inspector", "SUPER ADMIN"],
            },
            {
                link: "merged-list",
                label: "Merged List",
                icon: "fa-solid  fa-circle",
                access: ["inspector"],
            },
            // {
            //     link: "two-scheme",
            //     label: "Two Scheme",
            //     icon: "fa-solid  fa-circle",
            //     access: ["inspector", "SUPER ADMIN"],
            // },
            // {
            //     link: "two-scheme-list",
            //     label: "Two Scheme List",
            //     icon: "fa-solid  fa-circle",
            //     access: ["inspector", "SUPER ADMIN"],
            // },
        ],
    },

    {
        link: "/pfcalculator",
        label: "PF Calculator",
        icon: "fa-solid  fa-calculator",
        access: ["inspector", "ALC", "SUPER ADMIN"],
    },
    {
        link: "/admin-report",
        label: "Reports Download",
        icon: "fa-solid fa-file-arrow-down",
        access: ["SUPER ADMIN", "ALC"],
        links: [
            {
                link: "count-wise-report",
                label: "Count Wise Report",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN"],
            },
            {
                link: "summary-report",
                label: "Summary Report",
                icon: "fa-solid fa-circle",
                access: ["SUPER ADMIN", "ALC"],
            },
            {
                link: "back-log-data-report",
                label: "Back Log Data",
                subLabel: "(CAF Not Updated)",
                icon: "fa-solid fa-circle",
                access: ["ALC"],
            },
        ],
    },
    {
        link: "rejected-list",
        label: "Rejected List",
        icon: "fa-solid fa-ban",
        access: ["ALC"],
    },
    {
        link: "/cms",
        label: "Search Beneficiary",
        icon: "fa-solid fa-file-invoice-dollar",
        access: ["content management"],
        links: [
            {
                link: "search-beneficiary",
                label: "Search Beneficiary",
                icon: "fa-solid  fa-circle",
                access: ["content management"],
            },
        ],
    },
    {
        link: "formIV-bank-list",
        label: "Bank List",
        icon: "fa-solid fa-building-columns",
        access: ["ALC"],
    },
];

const SideBar = ({ isOpen: isOpenMobile, handleIsOpen: handleIsOpenMobile }) => {
    const [toggle, setToggle] = useState();
    const deviceType = useDeviceDetector();
    const isMobileDevice = isMobile(deviceType);

    const toggleClass = () => {
        toggle ? setToggle(false) : setToggle(true);
    };
    const user = useSelector((state) => state.user.user);
    const [show, setShow] = useState(-1);

    useEffect(() => {
        const concernedElement = document.getElementById("sidebar");
        const handleOutsideClick = (e) => {
            if (!concernedElement.contains(e.target)) {
                if (isOpenMobile) {
                    handleIsOpenMobile();
                }
            }
        };

        if (isMobileDevice && isOpenMobile) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isMobileDevice, isOpenMobile]);

    const getClassNames = () => {
        if (isMobileDevice && isOpenMobile) return "sidebar_mobile_active scroll--main";
        else if (isMobileDevice && !isOpenMobile) return "sidebar_mobile";
        else if (!isMobileDevice && toggle) return "sidebar_desktop scroll--main active";
        else if (!isMobileDevice && !toggle) return "sidebar_desktop scroll--main";
    };

    return (
        <div className="sidebar_wrapper" style={isMobileDevice ? { position: "absolute" } : { position: "relative" }}>
            {deviceType && (
                <nav
                    id="sidebar"
                    className={getClassNames()}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <div className="sidebar-header bmssy-logo">
                           
                            <div className="">
                                <div>
                                    <NavLink to="/dashboard" style={{ textDecoration: "none" }}>
                                        <h1 style={{ color: "#d7e3dc" }}>QUICKS</h1>
                                    </NavLink>
                                </div>
                                <div>
                                   
                                        <p className="lh-1 font-monospace text-muted" style={{ fontSize: "11px", display: "flex", cursor: "pointer" }}>
                                            ADMIN PANEL
                                        </p>
                                </div>
                            </div>
                        </div>

                        <ul className="list-unstyled components">
                            {links
                                .filter((item) => item.access.includes("*") || item.access.includes(user.role))
                                .map((item, index) => {
                                    if (item.links) {
                                        return toggle ? (
                                            <MenuDropDown item={item} setShow={setShow} show={show} index={index} role={user.role} key={index} tooltip />
                                        ) : (
                                            <MenuDropDown item={item} setShow={setShow} show={show} index={index} role={user.role} key={index} />
                                        );
                                    } else {
                                        return toggle ? (
                                            <li key={index}>
                                                <OverlayTrigger placement="bottom" overlay={<Tooltip>{item.label}</Tooltip>}>
                                                    <NavLink to={item.link}>
                                                        {item.icon && <i className={item.icon}></i>}
                                                        <span>
                                                            {item.label} <span style={{ fontSize: "12px", color: "#afdb99" }}>{item.subLabel}</span>
                                                        </span>
                                                    </NavLink>
                                                </OverlayTrigger>
                                            </li>
                                        ) : (
                                            <li key={index}>
                                                <NavLink to={item.link}>
                                                    {item.icon && <i className={item.icon}></i>}
                                                    <span>
                                                        {item.label} <span style={{ fontSize: "12px", color: "#afdb99" }}>{item.subLabel}</span>
                                                    </span>
                                                </NavLink>
                                            </li>
                                        );
                                    }
                                })}
                        </ul>
                    </div>
                    {deviceType === "Desktop" && (
                        <div
                            className=" "
                            style={{
                                display: "flex",
                                justifyContent: "end",
                            }}
                        >
                           

                            <button
                                type="button"
                                id="sidebarCollapse"
                                className="toggle_menu toggle-menu-custom"
                                onClick={() => toggleClass()}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "30px",
                                    width: "30px",
                                    color: "rgb(0, 24, 72)",
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                }}
                            >
                                <i className="fa-solid fa-circle-chevron-left "></i>
                                <i className="fa-solid fa-circle-chevron-right"></i>
                                {/* <i className="fas fa-align-left text-dark"></i>
                                <i className="fa-solid fa-xmark"></i> */}
                            </button>
                        </div>
                    )}
                </nav>
            )}
            <div id="overlay_sidebar" style={isOpenMobile ? { display: "block" } : { display: "none" }}></div>
        </div>
    );
};

export default SideBar;

const MenuDropDown = ({ item, setShow, show, index, role, tooltip, ...rest }) => {
    return (
        <>
            <li {...rest}>
                {tooltip ? (
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>{item.label}</Tooltip>}>
                        <a
                            href={item.link}
                            onClick={(e) => {
                                e.preventDefault();
                                setShow((s) => {
                                    if (s == index) return -1;
                                    else return index;
                                });
                            }}
                            className="d-flex align-item-center justify-content-between"
                        >
                            <div>
                                {item.icon && <i className={item.icon}></i>}
                                <span>
                                    {item.label} <span style={{ fontSize: "10px", color: "#afdb99" }}>{item.subLabel}</span>
                                </span>
                            </div>
                            {show == index ? <i className="fa-solid fa-sort-down"></i> : <i className="fa-solid fa-sort-down fa-rotate-270"></i>}
                        </a>
                    </OverlayTrigger>
                ) : (
                    <a
                        href={item.link}
                        onClick={(e) => {
                            e.preventDefault();
                            setShow((s) => {
                                if (s == index) return -1;
                                else return index;
                            });
                        }}
                        className="d-flex align-item-center justify-content-between"
                    >
                        <div>
                            {item.icon && <i className={item.icon}></i>}
                            <span>
                                {item.label} <span style={{ fontSize: "10px", color: "#afdb99" }}>{item.subLabel}</span>
                            </span>
                        </div>
                        {show == index ? <i className="fa-solid fa-sort-down"></i> : <i className="fa-solid fa-sort-down fa-rotate-270"></i>}
                    </a>
                )}

                {show == index && (
                    <ul className="list-unstyled show sub-menu">
                        {item.links
                            .filter((item) => item.access.includes("*") || item.access.includes(role))
                            .map((subItem, index) => (
                                <li key={index} className="my-1">
                                    {tooltip ? (
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip>{subItem.label}</Tooltip>}>
                                            <NavLink to={item.link + "/" + subItem.link}>
                                                <span>{subItem.label}</span> <span style={{ fontSize: "10px", color: "#afdb99" }}>{subItem.subLabel}</span>
                                            </NavLink>
                                        </OverlayTrigger>
                                    ) : (
                                        <NavLink to={item.link + "/" + subItem.link}>
                                            <span>{subItem.label}</span> <span style={{ fontSize: "10px", color: "#afdb99" }}>{subItem.subLabel}</span>
                                        </NavLink>
                                    )}
                                </li>
                            ))}
                    </ul>
                )}
            </li>
        </>
    );
};
