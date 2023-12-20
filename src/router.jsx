import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layout/admin/AdminLayout";
import HomeLayout from "./layout/HomeLayout";
import About from "./pages/About";
import ApplicationList from "./pages/admin/ApplicationList";
import ApprovedBeneficiaryList from "./pages/admin/ApprovedBeneficiary/ApprovedBeneficiaryList";
import BacklogDataDetails from "./pages/admin/BacklogData/BacklogDataDetails";
import BacklogDataList from "./pages/admin/BacklogData/BacklogDataList";
import BeneficiaryViewDetails from "./pages/admin/ApprovedBeneficiary/BeneficiaryViewDetails";
import CAFRegistrationV2 from "./pages/admin/CAFV2/CAFRegistration";
import CAFUpdation from "./pages/admin/CAF/CAFUpdation";
import CAFUpdationEDist from "./features/eDistrictDetails/EDistrictEntry";
import CAFUpdationRegistration from "./pages/admin/CAF/CAFUpdationRegistration";
import Dashboard from "./pages/admin/Dashboard";
import Registration from "./pages/admin/CAF/Registration";
import UserDetails from "./pages/admin/UserDetails";
import UserUpdate from "./pages/admin/UserUpdate";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import AuthProvider from "./provider/AuthProvider";
import SearchBeneficiary from "./pages/admin/BenSearch/SearchBeneficiary";
import ChangedRequest from "./pages/admin/ChangedRequest/ChangedRequest";
import CommissionRegistration from "./pages/admin/Commission/CommissionRegistration";
import CommissionGovGrant from "./pages/admin/Commission/CommissionGovGrant";
import CommissionGovGrantWorkerType from "./pages/admin/Commission/CommissionGovGrantWorkerType";
import ChangedRequestList from "./pages/admin/ChangedRequest/ChangedRequestList";
import Form1Upload from "./features/registration/Form1Upload";
import FormUpload from "./features/registrationV2/FormUpload";
import OfflineClaimList from "./pages/admin/OfflineClaim/OfflineClaimList";
import OfflineClaimEntry from "./pages/admin/OfflineClaim/OfflineClaimEntry";
import SearchAllBeneficiary from "./pages/admin/BenSearch/SearchAllBeneficiary";
import PayInSlipEntry from "./features/form4/PayInSlipEntry";
import BeneficiaryNameEntry from "./features/form4/BeneficiaryNameEntry";
import PayInSlipList from "./features/form4/PayInSlipList";
import Form4Entry from "./features/form4/Form4Entry";
import CommissionRegistrationWorkerType from "./pages/admin/Commission/CommissionRegistrationWorkerType";
import CorrectionOfRegistrationNumber from "./features/RectificationOfData/correctionOfRegistrationNumber/CorrectionOfRegistrationNumber";
import DocumentsForm from "./features/changedRequest/changedRequestForms/sloEnds/DocumentsForm";
import FinalReviewPage from "./features/changedRequest/changedRequestForms/sloEnds/FinalReviewPage";
import ProfilePage from "./pages/admin/ProfilePage";
import CorrectionOfRegistrationDate from "./features/RectificationOfData/correctionOfRegistrationDate/CorrectionOfRegistrationDate";
import CafNomineeUpdation from "./pages/admin/CAF/CafNomineeUpdation";
import NdfRegistration from "./pages/admin/CAF/NdfRegistration";

/******************************************* Bmssy Claim ***************************************************/
import ClaimEntry from "./pages/admin/BmssyClaims/ClaimEntry";
import ClaimDocumentsEntry from "./pages/admin/BmssyClaims/ClaimDocumentsEntry";
import ClaimDetailsPage from "./pages/admin/BmssyClaims/ClaimDetailsPage";
import ClaimFormV from "./pages/admin/BmssyClaims/ClaimFormV";
import ClaimList from "./pages/admin/BmssyClaims/ClaimList";
import DeathClaimBacklogData from "./pages/admin/BmssyClaims/DeathClaimBacklogData";
import ClaimEdit from "./pages/admin/BmssyClaims/ClaimEdit";
import FundRequestList from "./features/bmssyClaims/claimList/ALC/FundRequestList";
import PfCafByBeneficiaryDocuments from "./features/bmssyClaims/pf/CAF/SLO/PfCafByBeneficiaryDocuments";
import PfCafDetailsPage from "./features/bmssyClaims/pf/CAF/SLO/PfCafDetailsPage";
import PfCafEditByBeneficiary from "./features/bmssyClaims/pf/CAF/SLO/PfCafEditByBeneficiary";
import ImwPfCafDetails from "./features/bmssyClaims/pf/CAF/IMW/ImwPfCafDetails";
/******************************************* Bmssy Claim ***************************************************/

import ImwApplicationList from "./pages/admin/IMWApplicationList/ImwApplicationList";
import WorkerTypeCorrectionList from "./pages/admin/RectificationOfData/WorkerType/WorkerTypeCorrectionList";
// import WorkerTypeCorrectionBySSIN from "./pages/admin/RectificationOfData/WorkerType/WorkerTypeCorrectionBySSIN";
import PageNotFound from "./components/PageNotFound";
import ImwCrDetailsView from "./features/changedRequest/changedRequestForms/IMW/ImwCrDetailsView";
import DsCAFInfoList from "./pages/admin/DuareSarkar/CAF/DsCAFInfoList";
import AddlcList from "./pages/admin/UsersManagement/AddlcList";
import JlcList from "./pages/admin/UsersManagement/JlcList";
import DlcList from "./pages/admin/UsersManagement/DlcList";
import AlcList from "./pages/admin/UsersManagement/AlcList";
import ImwList from "./pages/admin/UsersManagement/ImwList";
import BeneficiaryList from "./pages/admin/UsersManagement/BeneficiaryList";
import ServiceProviderList from "./pages/admin/UsersManagement/ServiceProviderList";
//
import CountWiseReport from "./pages/admin/SystemAdminReports/CountWiseReport";
import AdminCafDsList from "./pages/admin/DuareSarkar/CAF/superAdmin/AdminCafDsList";
import SummaryReport from "./pages/admin/SystemAdminReports/SummaryReport";
import CorrectionOfRegistrationDateForCwTw from "./features/RectificationOfData/correctionOfRegistrationDateForCwTw/CorrectionOfRegistrationDateForCwTw";
import DsCafEntry from "./pages/admin/DuareSarkar/CAF/DsCafEntry";
import PayIngSlip from "./pages/admin/FormFourSsy/PayIngSlip";
import OfflineClaimReport from "./pages/admin/OfflineClaim/OfflineClaimReport";
import OtherBeneficiaryList from "./pages/admin/OtherBeneficiaryList";
import PfCalculator from "./pages/admin/BmssyClaims/PfCalculator";
import UserManual from "./pages/admin/UserManual";
import OfficeProfilePage from "./pages/admin/OfficeProfilePage";
import AlcAdviceList from "./features/bmssyClaims/claimList/ALC/adviceList/AlcAdviceList";
import AddUser from "./pages/admin/AlcUserManagement/AddUser";
import AlcCafDsList from "./pages/admin/DuareSarkar/CAF/ALC/AlcCafDsList";
import DsSummaryReport from "./pages/admin/DuareSarkar/CAF/DsSummaryReport";
import AlcServiceProviderList from "./pages/admin/AlcUserManagement/AlcServiceProviderList";
import AlcSloCaList from "./pages/admin/AlcUserManagement/AlcSloCaList";
import GenerateAdvice from "./features/bmssyClaims/claimList/ALC/adviceList/GenerateAdvice";
import BackLogDataReport from "./pages/admin/SystemAdminReports/BackLogDataReport";
import MisReport from "./features/bmssyClaims/claimList/ALC/MisReport";
import CkcoList from "./pages/admin/UsersManagement/CkcoList";
import DsSummaryReportPF from "./pages/admin/DuareSarkar/PF/DsSummaryReportPF";
import DsBlockwiseReport from "./pages/admin/DuareSarkar/PF/DsBlockwiseReport";
import ListPF from "./pages/admin/DuareSarkar/PF/ListPF";
import SearchPF from "./pages/admin/DuareSarkar/PF/SearchPF";
import SampleExcelUpload from "./pages/admin/SampleExcelUpload";
// import AadharRectificationList from "./pages/admin/RectificationOfData/Aadhar/AadharRectificationList";
import PassbookChangeCollectedArn from "./pages/admin/Passbook/PassbookChangeCollectedArn";
import SearchPFPassbook from "./pages/admin/Passbook/SearchPFPassbook";
import PassbookEntry from "./pages/admin/Passbook/PassbookEntry";
import ListPFSP from "./pages/admin/DuareSarkar/PF/ListPFSP";
import PassbookList from "./pages/admin/Passbook/PassbookList";
import CAFNomineeRegistration from "./pages/admin/CAF/NDFNominee/CAFNomineeRegistration";
import AccountStatementOld from "./pages/admin/FormFourSsy/AccountStatementOld";
import PassbookListSP from "./pages/admin/Passbook/PassbookListSP";
import PassbookDateManage from "./pages/admin/Passbook/PassbookDateManage";
import DsReportPF from "./pages/admin/DuareSarkar/PF/DsReportPF";
import RoleRestriction from "./pages/admin/RoleRestriction";
import CorrectionOfAddressRectification from "./features/RectificationOfData/correctionOfAddress/CorrectionOfAddressRectification";
import VerhoffFailedAadhaarImw from "./features/RectificationOfData/VerhoffFailedAadhaar/VerhoffFailedAadhaarImw";
import VerhoffFailedAadhaarSlo from "./features/RectificationOfData/VerhoffFailedAadhaar/VerhoffFailedAadhaarSlo";
import AadhaarCorrectionImw from "./features/RectificationOfData/AadhaarCorrection/AadharCorrectionByImw";
import AadhaarCorrectionAdmin from "./features/RectificationOfData/AadhaarCorrection/AadharCorrectionByAdmin";
import ALCRejectedList from "./features/alcRejectedList/ALCRejectedList";
import BeneficiarySearchByCms from "./features/benCorrectionByCms/BeneficiarySearchByCms";
// import FormBenBasicDetailsCorrection from "./features/benCorrectionByCms/FormBenBasicDetailsCorrection";
import CmsCorrectionTab from "./features/benCorrectionByCms/CmsCorrectionTab";
import { SameScheme } from "./pages/admin/Tagging/SameScheme";
import TwoScheme from "./pages/admin/Tagging/TwoScheme";
import TwoSchemeList from "./features/tagging/TwoSchemeList";
import OfflineClaimMisReport from "./pages/admin/OfflineClaim/OfflineClaimMisReport";
import TwForm1 from "./pages/e-District-froms/TwForm1";
import MergedList from "./features/tagging/MergedList";
import FormIVBackList from "./pages/admin/FormIV/FormIVBackList";
import PayIngSlipBmssy from "./pages/admin/FormFourBMSSY/PayIngSlipBmssy";
import PanAadhaarLinkedList from "./pages/admin/AlcUserManagement/PanAadhaarLinkedList";
import Form4PendingList from "./features/form4/IMW/Form4PendingList";
import Form4FinalPreview from "./features/form4/IMW/Form4FinalPreview";
import CommissionEdist from "./pages/admin/Commission/CommissionEdist";
import CommissionEdistWorkerType from "./pages/admin/Commission/CommissionEdistWorkerType";
import AdminCafDsDistrictWiseReport from "./pages/admin/DuareSarkar/CAF/superAdmin/AdminCafDsDistrictWiseReport";
import RenewalEDistrict from "./features/renewalEDistrict";
import CommissionClaim from "./pages/admin/commission/CommissionClaim";
import CommissionClaimWorkerType from "./pages/admin/commission/CommissionClaimWorkerType";
import RenewEDistrict from "./pages/admin/RenewEDistrict/SLO";
import RenewalList from "./features/renewalEDistrict/RenewalList";

const router = createBrowserRouter(
    [
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "*",
            element: <PageNotFound />,
        },

        

        {
            element: <AuthProvider />,
            children: [
                {
                    element: <RoleRestriction />,
                    children: [
                        {
                            element: <AdminLayout />,
                            children: [
                                {
                                    path: "/dashboard",
                                    element: <Dashboard />,
                                },
                                // {
                                //     path: "/user-manual",
                                //     element: <UserManual />,
                                // },
                                // {
                                //     path: "/registration",
                                //     element: <Registration />,
                                // },
                                // {
                                //     path: "/user-details/:id",
                                //     element: <UserDetails />,
                                // },
                                // {
                                //     path: "/user-update/:id",
                                //     element: <UserUpdate />,
                                // },
                                // {
                                //     path: "/sample-upload-excel",
                                //     element: <SampleExcelUpload />,
                                // },
                                // {
                                //     path: "/caf",
                                //     children: [
                                //         {
                                //             index: true,
                                //             element: <CAFUpdationRegistration />,
                                //         },
                                //         {
                                //             path: "registration",
                                //             element: <CAFRegistration />,
                                //         },
                                //         {
                                //             path: "updation",
                                //             element: <CAFUpdation />,
                                //         },
                                //         {
                                //             path: "form1upload/:id",
                                //             element: <Form1Upload />,
                                //         },
                                //         {
                                //             path: "nominee-update",
                                //             element: <CafNomineeUpdation />,
                                //         },
                                //         {
                                //             path: "ndf-registration",
                                //             element: <NdfRegistration />,
                                //         },
                                //         {
                                //             path: "ndfnominee-registration",
                                //             element: <CAFNomineeRegistration />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/caf",
                                //     children: [
                                //         {
                                //             index: true,
                                //             element: <CAFUpdationRegistration />,
                                //         },
                                //         {
                                //             path: "registration",
                                //             element: <CAFRegistrationV2 />,
                                //         },
                                //         {
                                //             path: "updation",
                                //             element: <CAFUpdation />,
                                //         },
                                //         {
                                //             path: "formupload/:id",
                                //             element: <FormUpload />,
                                //         },
                                //         {
                                //             path: "nominee-update",
                                //             element: <CafNomineeUpdation />,
                                //         },
                                //         {
                                //             path: "ndf-registration",
                                //             element: <NdfRegistration />,
                                //         },
                                //         {
                                //             path: "ndfnominee-registration",
                                //             element: <CAFNomineeRegistration />,
                                //         },
                                //         {
                                //             path: "form1upload/:id",
                                //             element: <Form1Upload />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/edistrict-renew",
                                //     children: [
                                //         {
                                //             index: true,
                                //             element: <RenewEDistrict />,
                                //         },
                                //         {
                                //             path: "list",
                                //             element: <RenewalList />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/my-application-list",
                                //     element: <ApplicationList />,
                                // },
                                // {
                                //     path: "/ppu-service",
                                //     element: <PassbookEntry />,
                                // },
                                // {
                                //     path: "ppu-passbook-list",
                                //     element: <PassbookList />,
                                // },

                                // {
                                //     path: "/Commission",
                                //     children: [
                                //         {
                                //             path: "monthly-payment-slo",
                                //             element: <CommissionRegistration cuType="1" />,
                                //         },
                                //         {
                                //             path: "monthly-payment-alc",
                                //             element: <CommissionRegistration cuType="3" />,
                                //         },
                                //         {
                                //             path: "monthly-payment-ceo",
                                //             element: <CommissionRegistrationWorkerType cuType="4" />,
                                //         },
                                //         {
                                //             path: "monthly-payment-cfcao",
                                //             element: <CommissionRegistrationWorkerType cuType="5" />,
                                //         },
                                //         {
                                //             path: "fund-release-list",
                                //             element: <CommissionRegistrationWorkerType cuType="41" />,
                                //         },
                                //         {
                                //             path: "view-memo-list",
                                //             element: <CommissionRegistrationWorkerType cuType="42" />,
                                //         },
                                //         {
                                //             path: "generate-advice-alc",
                                //             element: <CommissionRegistration cuType="31" />,
                                //         },
                                //         {
                                //             path: "view-advice-list-alc",
                                //             element: <CommissionRegistrationWorkerType cuType="32" />,
                                //         },
                                //         {
                                //             path: "ds-monthly-payment-slo",
                                //             element: <CommissionGovGrant cuType="1" />,
                                //         },
                                //         {
                                //             path: "ds-monthly-payment-inspector",
                                //             element: <CommissionGovGrant cuType="2" />,
                                //         },
                                //         {
                                //             path: "ds-monthly-payment-alc",
                                //             element: <CommissionGovGrant cuType="3" />,
                                //         },
                                //         {
                                //             path: "ds-monthly-payment-ceo",
                                //             element: <CommissionGovGrantWorkerType cuType="4" />,
                                //         },
                                //         {
                                //             path: "ds-monthly-payment-cfcao",
                                //             element: <CommissionGovGrantWorkerType cuType="5" />,
                                //         },
                                //         {
                                //             path: "ds-fund-release-list",
                                //             element: <CommissionGovGrantWorkerType cuType="41" />,
                                //         },
                                //         {
                                //             path: "ds-view-memo-list",
                                //             element: <CommissionGovGrantWorkerType cuType="42" />,
                                //         },
                                //         {
                                //             path: "ds-generate-advice-alc",
                                //             element: <CommissionGovGrant cuType="31" />,
                                //         },
                                //         {
                                //             path: "ds-view-advice-list-alc",
                                //             element: <CommissionGovGrantWorkerType cuType="32" />,
                                //         },
                                //         {
                                //             path: "edist-monthly-payment-slo",
                                //             element: <CommissionEdist cuType="1" />,
                                //         },
                                //         {
                                //             path: "edist-monthly-payment-alc",
                                //             element: <CommissionEdist cuType="3" />,
                                //         },
                                //         {
                                //             path: "edist-monthly-payment-ceo",
                                //             element: <CommissionEdistWorkerType cuType="4" />,
                                //         },
                                //         {
                                //             path: "edist-monthly-payment-cfcao",
                                //             element: <CommissionEdistWorkerType cuType="5" />,
                                //         },
                                //         {
                                //             path: "edist-fund-release-list",
                                //             element: <CommissionEdistWorkerType cuType="41" />,
                                //         },
                                //         {
                                //             path: "edist-view-memo-list",
                                //             element: <CommissionEdistWorkerType cuType="42" />,
                                //         },
                                //         {
                                //             path: "edist-generate-advice-alc",
                                //             element: <CommissionEdist cuType="31" />,
                                //         },
                                //         {
                                //             path: "edist-view-advice-list-alc",
                                //             element: <CommissionEdistWorkerType cuType="32" />,
                                //         },
                                //         {
                                //             path: "claim-monthly-payment-slo",
                                //             element: <CommissionClaim cuType="1" />,
                                //         },
                                //         {
                                //             path: "claim-monthly-payment-alc",
                                //             element: <CommissionClaim cuType="3" />,
                                //         },
                                //         {
                                //             path: "claim-generate-advice-alc",
                                //             element: <CommissionClaim cuType="31" />,
                                //         },
                                //         {
                                //             path: "claim-monthly-payment-ceo",
                                //             element: <CommissionClaimWorkerType cuType="4" />,
                                //         },
                                //         {
                                //             path: "claim-monthly-payment-cfcao",
                                //             element: <CommissionClaimWorkerType cuType="5" />,
                                //         },
                                //         {
                                //             path: "claim-fund-release-list",
                                //             element: <CommissionClaimWorkerType cuType="41" />,
                                //         },
                                //         {
                                //             path: "claim-view-memo-list",
                                //             element: <CommissionClaimWorkerType cuType="42" />,
                                //         },
                                //         {
                                //             path: "claim-view-advice-list-alc",
                                //             element: <CommissionClaimWorkerType cuType="32" />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/beneficiary-approved-list/:type",
                                //     element: <ApprovedBeneficiaryList />,
                                // },

                                // {
                                //     path: "/beneficiary-details/:id/:type",
                                //     element: <BeneficiaryViewDetails />,
                                // },
                                // {
                                //     path: "/back-log-data-list",
                                //     element: <BacklogDataList />,
                                // },

                                // {
                                //     path: "pf-list",
                                //     element: <ListPF />,
                                // },
                                // {
                                //     path: "/back-log-data-details/:id",
                                //     element: <BacklogDataDetails />,
                                // },
                                // {
                                //     path: "/search-beneficiary",
                                //     children: [
                                //         {
                                //             path: "ndf",
                                //             element: <SearchBeneficiary />,
                                //         },
                                //         {
                                //             path: "all",
                                //             element: <SearchAllBeneficiary />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/claim",
                                //     children: [
                                //         {
                                //             path: "entry",
                                //             element: <ClaimEntry />,
                                //         },
                                //         {
                                //             path: "documents/:id",
                                //             element: <ClaimDocumentsEntry />,
                                //         },
                                //         {
                                //             path: "details/:id",
                                //             element: <ClaimDetailsPage />,
                                //         },
                                //         {
                                //             path: "edit/:id",
                                //             element: <ClaimEdit />,
                                //         },
                                //         {
                                //             path: "form-V/:id",
                                //             element: <ClaimFormV />,
                                //         },
                                //         {
                                //             path: "list",
                                //             element: <ClaimList />,
                                //         },
                                //         {
                                //             path: "death-claim-backlog-data",
                                //             element: <DeathClaimBacklogData />,
                                //         },
                                //         {
                                //             path: "fund-request-list",
                                //             element: <FundRequestList />,
                                //         },
                                //         {
                                //             path: "advice-generate",
                                //             element: <GenerateAdvice />,
                                //         },
                                //         {
                                //             path: "advice-list",
                                //             element: <AlcAdviceList />,
                                //         },
                                //         {
                                //             path: "mis-report",
                                //             element: <MisReport />,
                                //         },
                                //         {
                                //             path: "pf-caf-documents/:id",
                                //             element: <PfCafByBeneficiaryDocuments />,
                                //         },
                                //         {
                                //             path: "pf-caf-details/:id",
                                //             element: <PfCafDetailsPage />,
                                //         },
                                //         {
                                //             path: "pf-caf-edit/:id",
                                //             element: <PfCafEditByBeneficiary />,
                                //         },
                                //         {
                                //             path: "Imw-pf-caf-details/:id",
                                //             element: <ImwPfCafDetails />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/change-request",
                                //     children: [
                                //         {
                                //             path: "list",
                                //             element: <ChangedRequestList />,
                                //         },
                                //         {
                                //             path: "entry",
                                //             element: <ChangedRequest />,
                                //         },
                                //         {
                                //             path: "documents/:id",
                                //             element: <DocumentsForm />,
                                //         },
                                //         {
                                //             path: "final-review/:id",
                                //             element: <FinalReviewPage />,
                                //         },
                                //         {
                                //             path: "imw-view-details/:id",
                                //             element: <ImwCrDetailsView />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/offline-claim",
                                //     children: [
                                //         {
                                //             path: "list",
                                //             element: <OfflineClaimList />,
                                //         },
                                //         {
                                //             path: "entry",
                                //             element: <OfflineClaimEntry />,
                                //         },
                                //         {
                                //             path: "report",
                                //             element: <OfflineClaimReport />,
                                //         },
                                //         {
                                //             path: "mis-report",
                                //             element: <OfflineClaimMisReport />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/tagging",
                                //     children: [
                                //         {
                                //             path: "same-scheme-ow",
                                //             element: <SameScheme />,
                                //         },
                                //         {
                                //             path: "two-scheme",
                                //             element: <TwoScheme />,
                                //         },
                                //         {
                                //             path: "two-scheme-list",
                                //             element: <TwoSchemeList />,
                                //         },
                                //         {
                                //             path: "merged-list",
                                //             element: <MergedList />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/pf-passbook",
                                //     children: [
                                //         {
                                //             path: "ppu-change-collected-arn",
                                //             element: <PassbookChangeCollectedArn />,
                                //         },
                                //         {
                                //             path: "ppu-search-passbook",
                                //             element: <SearchPFPassbook />,
                                //         },
                                //         {
                                //             path: "ppu-service",
                                //             element: <PassbookEntry />,
                                //         },
                                //         {
                                //             path: "ppu-passbook-list",
                                //             element: <PassbookList />,
                                //         },
                                //         {
                                //             path: "ppu-passbook-list-sp",
                                //             element: <PassbookListSP />,
                                //         },
                                //         {
                                //             path: "ppu-date-management",
                                //             element: <PassbookDateManage />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/duare-sarkar",
                                //     children: [
                                //         {
                                //             path: "summary-report-pf",
                                //             element: <DsSummaryReportPF />,
                                //         },
                                //         {
                                //             path: "search-passbook-pf",
                                //             element: <SearchPF />,
                                //         },
                                //         {
                                //             path: "ds-blockwise-report",
                                //             element: <DsBlockwiseReport />,
                                //         },
                                //         {
                                //             path: "ds-report-pf",
                                //             element: <DsReportPF />,
                                //         },
                                //         {
                                //             path: "pf-list",
                                //             element: <ListPF />,
                                //         },
                                //         {
                                //             path: "duare-pf-list",
                                //             element: <ListPFSP />,
                                //         },
                                //         {
                                //             path: "caf-list",
                                //             element: <DsCAFInfoList />,
                                //         },
                                //         {
                                //             path: "caf-entry",
                                //             element: <DsCafEntry />,
                                //         },
                                //         {
                                //             path: "admin-caf-list",
                                //             element: <AdminCafDsList />,
                                //         },
                                //         {
                                //             path: "alc-caf-list",
                                //             element: <AlcCafDsList />,
                                //         },
                                //         {
                                //             path: "district-wise-report",
                                //             element: <AdminCafDsDistrictWiseReport />,
                                //         },
                                //         {
                                //             path: "summary-report",
                                //             element: <DsSummaryReport />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/form4",
                                //     children: [
                                //         {
                                //             path: "pay-in-slip-entry",
                                //             element: <PayInSlipEntry />,
                                //         },
                                //         {
                                //             path: "pay-in-slip-entry/:id",
                                //             element: <PayInSlipEntry />,
                                //         },
                                //         {
                                //             path: "pay-in-slip-list",
                                //             element: <PayInSlipList />,
                                //         },
                                //         {
                                //             path: "form-four-entry/:id",
                                //             element: <Form4Entry />,
                                //         },
                                //         {
                                //             path: "beneficiary-name-entry",
                                //             element: <BeneficiaryNameEntry />,
                                //         },
                                //         //-------  For Form4 Approval by IMW --------//
                                //         {
                                //             path: "imw-pay-in-slip-list",
                                //             element: <Form4PendingList />,
                                //         },
                                //         {
                                //             path: "view-pay-in-slip-final-preview/:id",
                                //             element: <Form4FinalPreview />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/application-list/:type",
                                //     element: <ImwApplicationList gpFilterAddOn={true} />,
                                // },
                                // {
                                //     path: "/rectification",
                                //     children: [
                                //         {
                                //             path: "registration-number",
                                //             element: <CorrectionOfRegistrationNumber />,
                                //         },
                                //         {
                                //             path: "registration-date",
                                //             element: <CorrectionOfRegistrationDate />,
                                //         },
                                //         {
                                //             path: "registration-date-cw-tw",
                                //             element: <CorrectionOfRegistrationDateForCwTw />,
                                //         },
                                //         {
                                //             path: "worker-type",
                                //             element: <WorkerTypeCorrectionList />,
                                //         },
                                //         // {
                                //         //     path: "worker-type-by-ssin",
                                //         //     element: <WorkerTypeCorrectionBySSIN />,
                                //         // },
                                //         // {
                                //         //     path: "aadhar",
                                //         //     element: <AadharRectificationList />,
                                //         // },
                                //         {
                                //             path: "address-rectification",
                                //             element: <CorrectionOfAddressRectification />,
                                //         },
                                //         {
                                //             path: "verhoff-failed-aadhaar-rectification-list",
                                //             element: <VerhoffFailedAadhaarImw />,
                                //         },
                                //         {
                                //             path: "verhoff-failed-aadhaar-rectification",
                                //             element: <VerhoffFailedAadhaarSlo />,
                                //         },
                                //         {
                                //             path: "aadhar-correction-imw",
                                //             element: <AadhaarCorrectionImw />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/profile/:roleName",
                                //     element: <ProfilePage />,
                                // },
                                // {
                                //     path: "/office-profile",
                                //     element: <OfficeProfilePage />,
                                // },
                                // {
                                //     path: "/users-management",
                                //     children: [
                                //         {
                                //             path: "addlc-list",
                                //             element: <AddlcList />,
                                //         },
                                //         {
                                //             path: "jlc-list",
                                //             element: <JlcList />,
                                //         },
                                //         {
                                //             path: "dlc-list",
                                //             element: <DlcList />,
                                //         },
                                //         {
                                //             path: "alc-list",
                                //             element: <AlcList />,
                                //         },
                                //         {
                                //             path: "imw-list",
                                //             element: <ImwList />,
                                //         },
                                //         {
                                //             path: "service-provider-list",
                                //             element: <ServiceProviderList />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/admin-report",
                                //     children: [
                                //         {
                                //             path: "count-wise-report",
                                //             element: <CountWiseReport />,
                                //         },
                                //         {
                                //             path: "summary-report",
                                //             element: <SummaryReport />,
                                //         },
                                //         {
                                //             path: "back-log-data-report",
                                //             element: <BackLogDataReport />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/admin-beneficiary-list",
                                //     element: <BeneficiaryList />,
                                // },
                                // {
                                //     path: "/beneficiary-list",
                                //     element: <OtherBeneficiaryList />,
                                // },
                                // {
                                //     path: "/ssy-paying-slip",
                                //     element: <PayIngSlip />,
                                // },
                                // {
                                //     path: "/bmssy-paying-slip",
                                //     element: <PayIngSlipBmssy />,
                                // },
                                // {
                                //     path: "/pfcalculator",
                                //     element: <PfCalculator />,
                                // },
                                // {
                                //     path: "alc-list",
                                //     element: <AlcList />,
                                // },
                                // {
                                //     path: "imw-list",
                                //     element: <ImwList />,
                                // },
                                // {
                                //     path: "service-provider-list",
                                //     element: <ServiceProviderList />,
                                // },
                                // {
                                //     path: "/alc-user-management",
                                //     children: [
                                //         {
                                //             path: "pan-aadhaar-linked-list",
                                //             element: <PanAadhaarLinkedList />,
                                //         },
                                //         {
                                //             path: "add-user",
                                //             element: <AddUser />,
                                //         },
                                //         {
                                //             path: "posting-area",
                                //             element: <AlcServiceProviderList type="1" typename="Posting Area" />,
                                //         },
                                //         {
                                //             path: "alc-serviceprovider-list",
                                //             element: <AlcServiceProviderList type="2" typename="Service Provider list" />,
                                //         },
                                //         {
                                //             path: "slo-ca-list",
                                //             element: <AlcSloCaList />,
                                //         },
                                //         {
                                //             path: "imw-list",
                                //             element: <ImwList />,
                                //         },
                                //         {
                                //             path: "ckco-list",
                                //             element: <CkcoList />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/admin-report",
                                //     children: [
                                //         {
                                //             path: "count-wise-report",
                                //             element: <CountWiseReport />,
                                //         },
                                //         {
                                //             path: "summary-report",
                                //             element: <SummaryReport />,
                                //         },
                                //         {
                                //             path: "back-log-data-report",
                                //             element: <BackLogDataReport />,
                                //         },
                                //     ],
                                // },
                                // {
                                //     path: "/admin-beneficiary-list",
                                //     element: <BeneficiaryList />,
                                // },
                                // {
                                //     path: "/beneficiary-list",
                                //     element: <OtherBeneficiaryList />,
                                // },
                                // // {
                                // //     path: "/ssy-paying-slip",
                                // //     element: <PayIngSlip />,
                                // // },
                                // {
                                //     path: "/ssy-account-statement",
                                //     element: <AccountStatementOld />,
                                // },
                                // {
                                //     path: "/pfcalculator",
                                //     element: <PfCalculator />,
                                // },
                                // {
                                //     path: "/rejected-list",
                                //     element: <ALCRejectedList />,
                                // },
                                // {
                                //     path: "/cms",
                                //     children: [
                                //         {
                                //             path: "search-beneficiary",
                                //             element: <BeneficiarySearchByCms />,
                                //         },
                                //         {
                                //             path: "form-ben-details-correction-cms/:id",
                                //             element: <CmsCorrectionTab />,
                                //         },
                                //         // {
                                //         //     path: "form-ben-details-correction-cms/:id",
                                //         //     element: <FormBenBasicDetailsCorrection />,
                                //         // }
                                //     ],
                                // },
                                // {
                                //     path: "/formIV-bank-list",
                                //     element: <FormIVBackList />,
                                // },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    { basename: "/v2" }
);

export default router;
