import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router";
import { updater } from "../../../utils";
import { toast } from "react-toastify";

function AadhaarCorrectionRejectButton({ application_id, aadhaar }) {
    console.log(aadhaar);
    const navigate = useNavigate();
    const { mutate } = useMutation(({ body, method, url }) => updater(url, { method: method || "POST", body: body }));
    const aadhaarRejectButton = async () => {
        mutate(
            { url: `/beneficiary_aadhaar-correction-submit?application_id=${application_id}` },
            {
                onSuccess(data) {
                    toast.success("Successfully Back to SLO");
                    navigate("/rectification/aadhar-correction-imw");
                },
                onError(error) {
                    toast.error(error.message);
                },
            }
        );
    };

    const backToSearchAadhaar = async () => {
        navigate("/rectification/aadhar-correction-imw");
    };

    return (
        <>
            <div className=" d-md-flex col-md-12 d-flex justify-content-md-center gap-3 py-xl-3">
                <button className="btn btn-primary btn-sm btn-primary " onClick={aadhaarRejectButton}>
                    Sent Back to CA / SLO
                </button>
                <button className="btn btn-primary btn-sm btn-danger" onClick={backToSearchAadhaar}>
                    Go Back to List
                </button>
            </div>
        </>
    );
}

export default AadhaarCorrectionRejectButton;
