import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useParams } from "react-router";
import AccessDenied from "../../components/AccessDenied";
import { refresh } from "../../store/slices/userSlice";
const flatLinks = [
    { link: "/dashboard", access: ["*"] },
    { link: "/user-manual", access: ["ALC"] },
    { link: "/sample", access: ["SUPER ADMIN"] },
    { link: "/alc-user-management/add-user", access: ["ALC"] },
    { link: "/alc-user-management/posting-area", access: ["ALC"] },
    { link: "/alc-user-management/pan-aadhaar-linked-list", access: ["ALC"] },

    {
        link: "/alc-user-management/alc-serviceprovider-list",
        access: ["ALC"],
    },
    { link: "/alc-user-management/slo-ca-list", access: ["ALC"] },
    { link: "/alc-user-management/imw-list", access: ["ALC"] },
    { link: "/alc-user-management/ckco-list", access: ["ALC"] },
    {
        link: "/caf",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/caf",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/caf/registration",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/caf/updation",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/caf/form1upload/:id",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/caf/nominee-update",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/caf/ndf-registration",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/caf/ndfnominee-registration",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    { link: "/application-list/pending", access: ["inspector"] },
    { link: "/application-list/approved", access: ["inspector"] },
    {
        link: "/application-list/back-for-rectification",
        access: ["inspector"],
    },
    { link: "/application-list/reject", access: ["inspector"] },
    {
        link: "/application-list/ssyApprovedList",
        access: ["inspector"],
    },
    {
        link: "/my-application-list",
        access: ["SLO", "CA", "DEO", "inspector", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/beneficiary-approved-list/bmssy",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/beneficiary-approved-list/ssy",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/back-log-data-list",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/search-beneficiary/ndf",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "SUPER ADMIN", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    { link: "/search-beneficiary/all", access: ["SUPER ADMIN"] },
    { link: "/beneficiary-list", access: ["ALC"] },
    {
        link: "/claim",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "ceo_cw", "ceo_tw", "ceo_ow", "cfco_ow", "cfco_cw", "cfco_tw", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/claim/entry",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/claim/list",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "ceo_cw", "ceo_tw", "ceo_ow", "cfco_ow", "cfco_cw", "cfco_tw", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/claim/death-claim-backlog-data",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    { link: "/claim/fund-request-list", access: ["ALC"] },
    { link: "/claim/advice-generate", access: ["ALC"] },
    { link: "/claim/advice-list", access: ["ALC"] },
    { link: "/claim/mis-report", access: ["ALC", "inspector"] },
    {
        link: "/change-request",
        access: ["SLO", "CA", "DEO", "inspector", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/change-request/list",
        access: ["SLO", "CA", "DEO", "inspector", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/change-request/entry",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    { link: "/offline-claim/list", access: ["inspector", "ALC", "SUPER ADMIN"] },
    { link: "/offline-claim/entry", access: ["inspector"] },
    { link: "/offline-claim/report", access: ["ALC", "SUPER ADMIN"] },
    { link: "/offline-claim/mis-report", access: ["SUPER ADMIN"] },
    {
        link: "/pf-passbook/ppu-service",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/pf-passbook/ppu-change-collected-arn",
        access: ["inspector"],
    },
    {
        link: "/pf-passbook/ppu-search-passbook",
        access: ["SUPER ADMIN", "inspector", "ALC", "SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/pf-passbook/ppu-passbook-list",
        access: ["inspector", "SUPER ADMIN", "ALC"],
    },
    {
        link: "/duare-sarkar/ds-blockwise-report",
        access: ["SUPER ADMIN", "ALC"],
    },
    {
        link: "/duare-sarkar/pf-list",
        access: ["inspector", "SUPER ADMIN", "ALC"],
    },
    {
        link: "/duare-sarkar/duare-pf-list",
        access: ["collectingagent", "otherserviceprovider", "SLO", "CKCO"],
    },
    {
        link: "/duare-sarkar/summary-report-pf",
        access: ["SUPER ADMIN", "ALC", "inspector"],
    },
    {
        link: "/duare-sarkar/search-passbook-pf",
        access: ["SUPER ADMIN", "inspector", "ALC", "SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/duare-sarkar/caf-list",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/duare-sarkar/caf-entry",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    { link: "/duare-sarkar/admin-caf-list", access: ["SUPER ADMIN"] },
    { link: "/duare-sarkar/alc-caf-list", access: ["ALC"] },
    { link: "/duare-sarkar/summary-report", access: ["ALC", "SUPER ADMIN"] },
    {
        link: "/commission/monthly-payment-slo",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    { link: "/commission/monthly-payment-alc", access: ["ALC"] },
    {
        link: "/commission/monthly-payment-ceo",
        access: ["ceo_ow", "ceo_cw", "ceo_tw"],
    },
    {
        link: "/commission/monthly-payment-cfcao",
        access: ["cfco_ow", "cfco_cw", "cfco_tw"],
    },
    {
        link: "/commission/fund-release-list",
        access: ["ceo_ow", "ceo_cw", "ceo_tw"],
    },
    {
        link: "/commission/view-memo-list",
        access: ["ceo_ow", "ceo_cw", "ceo_tw"],
    },
    { link: "/commission/generate-advice-alc", access: ["ALC"] },
    { link: "/commission/view-advice-list-alc", access: ["ALC"] },
    {
        link: "/commission/ds-monthly-payment-inspector",
        access: ["inspector"],
    },
    { link: "/commission/ds-monthly-payment-alc", access: ["ALC"] },
    {
        link: "/commission/ds-monthly-payment-slo",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/commission/ds-monthly-payment-ceo",
        access: ["ceo_ow", "ceo_cw", "ceo_tw"],
    },
    {
        link: "/commission/ds-monthly-payment-cfcao",
        access: ["cfco_ow", "cfco_cw", "cfco_tw"],
    },
    {
        link: "/commission/ds-fund-release-list",
        access: ["ceo_ow", "ceo_cw", "ceo_tw"],
    },
    {
        link: "/commission/ds-view-memo-list",
        access: ["ceo_ow", "ceo_cw", "ceo_tw"],
    },
    { link: "/commission/ds-generate-advice-alc", access: ["ALC"] },
    { link: "/commission/ds-view-advice-list-alc", access: ["ALC"] },
    {
        link: "/rectification/registration-number",
        access: ["inspector"],
    },
    { link: "/rectification/registration-date", access: ["inspector"] },
    {
        link: "/rectification/registration-date-cw-tw",
        access: ["inspector"],
    },
    { link: "/rectification/worker-type", access: ["inspector"] },
    {
        link: "/rectification/worker-type-by-ssin",
        access: ["inspector"],
    },
    { link: "/rectification/aadhar", access: ["inspector"] },
    { link: "/address-rectification", access: ["inspector"] },
    { link: "/rectification/verhoff-failed-aadhaar-rectification-list", access: ["inspector"] },
    { link: "/rectification/verhoff-failed-aadhaar-rectification", access: ["SLO", "collectingagent", "otherserviceprovider"] },
    { link: "/rectification/aadhar-correction-imw", access: ["inspector", "content management"] },
    {
        link: "/form4",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/form4/pay-in-slip-entry",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/form4/pay-in-slip-list",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/form4/beneficiary-name-entry",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/form4/imw-pay-in-slip-list",
        access: ["inspector"],
    },
    {
        link: "/form4/view-pay-in-slip-final-preview/:id",
        access: ["inspector"],
    },

    { link: "/users-management/addlc-list", access: ["SUPER ADMIN"] },
    { link: "/users-management/jlc-list", access: ["SUPER ADMIN"] },
    { link: "/users-management/dlc-list", access: ["SUPER ADMIN"] },
    {
        link: "/users-management/alc-list",
        access: ["SUPER ADMIN", "DLC"],
    },
    { link: "/users-management/imw-list", access: ["SUPER ADMIN"] },
    {
        link: "/users-management/service-provider-list",
        access: ["DLC", "SUPER ADMIN"],
    },
    { link: "/admin-beneficiary-list", access: ["SUPER ADMIN"] },
    { link: "/ssy-paying-slip", access: ["ALC", "inspector"] },
    { link: "/pfcalculator", access: ["ALC", "inspector"] },
    {
        link: "/admin-report/count-wise-report",
        access: ["SUPER ADMIN"],
    },
    {
        link: "/admin-report/summary-report",
        access: ["SUPER ADMIN", "ALC"],
    },
    { link: "/admin-report/back-log-data-report", access: ["ALC"] },
    { link: "/sample-upload-excel", access: ["SUPER ADMIN"] },
    {
        link: "/ppu-service",
        access: ["SLO", "CA", "DEO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/claim/documents/:id",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "ceo_cw", "ceo_tw", "ceo_ow", "cfco_ow", "cfco_cw", "cfco_tw", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/claim/details/:id",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "ceo_cw", "ceo_tw", "ceo_ow", "cfco_ow", "cfco_cw", "cfco_tw", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/claim/edit/:id",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "ceo_cw", "ceo_tw", "ceo_ow", "cfco_ow", "cfco_cw", "cfco_tw", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/claim/form-V/:id",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "ceo_cw", "ceo_tw", "ceo_ow", "cfco_ow", "cfco_cw", "cfco_tw", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/claim/pf-caf-documents/:id",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "ceo_cw", "ceo_tw", "ceo_ow", "cfco_ow", "cfco_cw", "cfco_tw", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/claim/pf-caf-details/:id",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "ceo_cw", "ceo_tw", "ceo_ow", "cfco_ow", "cfco_cw", "cfco_tw", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/claim/pf-caf-edit/:id",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "ceo_cw", "ceo_tw", "ceo_ow", "cfco_ow", "cfco_cw", "cfco_tw", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/claim/Imw-pf-caf-details/:id",
        access: ["SLO", "CA", "DEO", "inspector", "ALC", "DLC", "ceo_cw", "ceo_tw", "ceo_ow", "cfco_ow", "cfco_cw", "cfco_tw", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/change-request/documents/:id",
        access: ["SLO", "CA", "DEO", "inspector", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/change-request/final-review/:id",
        access: ["SLO", "CA", "DEO", "inspector", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/change-request/imw-view-details/:id",
        access: ["SLO", "CA", "DEO", "inspector", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/form4/pay-in-slip-entry/:id",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },
    {
        link: "/form4/form-four-entry/:id",
        access: ["SLO", "collectingagent", "otherserviceprovider", "CKCO"],
    },

    {
        link: "/registration",
        access: ["SLO", "inspector", "collectingagent", "otherserviceprovider", "CKCO"],
    },

    { link: "/user-details/:id", access: ["ALC"] },
    { link: "/user-update/:id", access: ["ALC"] },
    { link: "/profile/:roleName", access: ["*"] },
    { link: "/office-profile", access: ["ALC"] },
    {
        link: "/beneficiary-details/:id/:type",
        access: ["SLO", "inspector", "collectingagent", "otherserviceprovider", "ALC", "SUPER ADMIN", "CKCO", "content management"],
    },
    {
        link: "/back-log-data-details/:id",
        access: ["SLO", "inspector", "collectingagent", "otherserviceprovider", "CKCO", "SUPER ADMIN"],
    },
    {
        link: "/rejected-list",
        access: ["ALC"],
    },
    {
        link: "/formIV-bank-list",
        access: ["ALC"],
    },
];

function RoleRestriction() {
    const { user } = useSelector((state) => state.user);
    const location = useLocation();
    let pathName = location.pathname;
    const param = useParams();
    const keys = Object.keys(param);
    const dispatch = useDispatch();

    const onFocus = () => {
        dispatch(refresh());
    };
    useEffect(() => {
        window.addEventListener("focus", onFocus);
        return () => {
            window.removeEventListener("focus", onFocus);
        };
    }, []);

    //replace path param value with param
    keys.forEach((key) => {
        pathName = pathName.replace(param[key], ":" + key);
    });

    const hasAccess = () => {
        let pathObj = flatLinks.find((item) => item.link === pathName);

        if (!pathObj) {
            //get base pathname obj
            let locList = pathName.split("/");
            locList.shift();
            const basePathname = `${"/" + locList[0]}`;
            pathObj = flatLinks.find((item) => item.link === basePathname);
        }
        if (!pathObj) return true;

        if (pathObj?.access?.includes(user.role) || pathObj?.access?.includes("*")) return true;
        return false;
    };
    if (hasAccess()) {
        return <Outlet />;
    } else {
        return <AccessDenied />;
    }
}

export default RoleRestriction;
