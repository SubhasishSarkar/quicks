import React from "react";

const DesignationSelect = ({ ...rest }) => {
    return (
        <>
            <select aria-label="Default select example" {...rest}>
                <option value="">Select One</option>
                {[
                    { value: "MP", label: "MP" },
                    { value: "MLA", label: "MLA" },
                    { value: "Sabhadhipati of Zilla Parishad", label: "Sabhadhipati of Zilla Parishad" },
                    { value: "Mayor of Municipal Corporation", label: "Mayor of Municipal Corporation" },
                    { value: "Chairman of Borough Committee", label: "Chairman of Borough Committee" },
                    { value: "Sabhapati or Member of Panchayat Samity", label: "Sabhapati or Member of Panchayat Samity" },
                    { value: "Pradhan of Gram Panchayat", label: "Pradhan of Gram Panchayat" },
                    { value: "Chairman of Municipality", label: "Chairman of Municipality" },
                    { value: "Vice-Chairman of Municipality", label: "Vice-Chairman of Municipality" },
                    { value: "Councillor of Municipality or Municipal Corporation", label: "Councillor of Municipality or Municipal Corporation" },
                    { value: "Commissioner of Municipality or Corporation Area", label: "Commissioner of Municipality or Corporation Area" },
                    { value: "Member of GTA", label: "Member of GTA" },
                    { value: "Administrator of Local Bodies or GTA", label: "Administrator of Local Bodies or GTA" },
                    { value: "Nodal officer of Concerned Department", label: "Nodal officer of Concerned Department" },
                    { value: "Employer", label: "Employer" },
                ].map((item, index) => (
                    <option value={item?.value} key={index}>
                        {item?.label}
                    </option>
                ))}
            </select>
        </>
    );
};

export default DesignationSelect;
