import React, { useEffect, useState } from "react";
import ContributionMonthChecked from "../../components/form/ContributionMonthChecked";
// import { downloadFile } from "../../utils";

const Sample = () => {
    const [months, setMonths] = useState([
        { label: "APR", value: 4, amount: 20, disabled: true, checked: true },
        { label: "MAY", value: 5, amount: 20, disabled: false, checked: false },
        { label: "JUN", value: 6, amount: 20, disabled: false, checked: false },
        { label: "JUL", value: 7, amount: 20, disabled: false, checked: false },
        { label: "AUG", value: 8, amount: 20, disabled: false, checked: false },
        { label: "SEP", value: 9, amount: 20, disabled: false, checked: false },
        { label: "OCT", value: 10, amount: 20, disabled: false, checked: false },
        { label: "NOV", value: 11, amount: 20, disabled: true, checked: true },
        { label: "DEC", value: 12, amount: 20, disabled: true, checked: true },
        { label: "JAN", value: 1, amount: 20, disabled: false, checked: false },
        { label: "FEB", value: 2, amount: 20, disabled: false, checked: false },
        { label: "MAR", value: 3, amount: 20, disabled: false, checked: false },
    ]);
    return (
        <div className="container my-5">
            {/* <button
                className="btn-primary btn btn-sm"
                onClick={async () => {
                    try {
                        await downloadFile("/duare-sarkar-caf-report?date=2022-12-29 00:00:00", "Duare Sarkar (CAF) Update Report.xlsx");
                    } catch (error) {
                        console.error(error);
                    }
                }}
            >
                download
            </button> */}

            <ContributionMonthChecked
                value={months}
                onChange={(value) => {
                    setMonths(value);
                }}
            />
        </div>
    );
};

export default Sample;
