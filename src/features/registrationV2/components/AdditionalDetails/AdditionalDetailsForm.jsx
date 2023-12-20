import CW from "./CW";
import TW from "./TW";

const AdditionalDetailsForm = ({ workerType, handleEmpSubmit, application_id }) => {
    return (
        <>
            {workerType === "cw" && <CW application_id={application_id} handleEmpSubmit={handleEmpSubmit} />}
            {workerType === "tw" && <TW application_id={application_id} handleEmpSubmit={handleEmpSubmit} />}
        </>
    );
};

export default AdditionalDetailsForm;
