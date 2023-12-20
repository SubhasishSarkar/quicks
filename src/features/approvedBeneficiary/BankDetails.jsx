import React from "react";

const BankDetails = ({ arrData }) => {
    const arrBankData = arrData?.bankDetails;

    return (
        <>
            <div className="card mb-3 text-bg-light border-info" style={{ marginTop: "8px" }}>
                <div className="card-body">
                    <div className="ben_details_section mb-1" style={{ fontWeight: "500" }}>
                        <span>
                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Bank Account Number :</b> {arrBankData ? arrBankData?.bank_account_no : ""}
                        </span>
                        <span>
                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Bank IFSC :</b> {arrBankData ? arrBankData?.bank_ifsc_code : ""}
                        </span>
                        <span>
                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Bank Name :</b> {arrBankData ? arrBankData?.bank_name : ""}
                        </span>
                        <span>
                            <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Branch Name :</b> {arrBankData ? arrBankData?.bank_branch_name : ""}
                        </span>
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                        <i className="fa-solid fa-circle-dot label_pointer"></i> <b> Location :</b> {arrBankData ? arrBankData?.bank_location : ""}
                    </span>
                </div>
            </div>
        </>
    );
};

export default BankDetails;
