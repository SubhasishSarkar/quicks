import { createContext, useState } from "react";

const RegistrationContext = createContext();
export const RegistrationProvider = ({ children }) => {
    const [basicDetails, setBasicDetails] = useState();
    const [workerType, setWorkerType] = useState();
    const [active, setActive] = useState(0);
    const [isDirty, setIsDirty] = useState(false);
    return (
        <RegistrationContext.Provider value={{ active: active, setActive: setActive, workerType: workerType, setWorkerType: setWorkerType, basicDetails: basicDetails, setBasicDetails: setBasicDetails, isDirty: isDirty, setIsDirty: setIsDirty }}>
            {children}
        </RegistrationContext.Provider>
    );
};

export default RegistrationContext;
