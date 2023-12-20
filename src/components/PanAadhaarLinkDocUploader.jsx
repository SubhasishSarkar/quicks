import React from "react";
import FPUploader from "./FPUploader";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const PanAadhaarLinkDocUploader = () => {
    const query = useQueryClient();
    const [searchParams] = useSearchParams();
    const applicationId = searchParams.get("application_id");
    const handleUploadSuccess = (path, docType) => {
        // query.setQueriesData(["caf-registration-preview", "documents-details", applicationId], (state) => ({ ...state, [docType]: path }));
    };
    // const handleDeleteSuccess = (docType) => {
    //     query.setQueriesData(["caf-registration-preview", "documents-details", applicationId], (state) => {
    //         const newState = { ...state };
    //         delete newState[docType];
    //         return { ...newState };
    //     });
    // };

    // useEffect(() => {
    //     return () => {
    //         query.removeQueries(["eDistrict-payment-reciept-upload", applicationId], {
    //             exact: true,
    //         });
    //     };
    // }, [applicationId, query]);

    return (
        <>
            <div className="card" style={{ border: "none" }}>
                <div className="card-body">
                    <FPUploader
                        // fileURL={data?.receipt ? `${process.env.APP_BASE}${data?.receipt}` : ""}
                        title="Upload your PAN and Aadhaar link document"
                        maxFileSize="50KB"
                        description="Upload Document (Max size 50 KB, jpg or jpeg file only, Dimension 150 X 180)"
                        acceptedFileTypes={["image/jpeg", "image/jpg"]}
                        name="file"
                        // onUploadSuccessful={(res) => handleUploadSuccess(res.path, "receipt")}
                        // onDeleteSuccessful={() => handleDeleteSuccess("receipt")}
                        upload={`/pan-aadhaar-link-doc-upload?name=panAadhaar`}
                        required="true"
                    />
                </div>
            </div>
        </>
    );
};

export default PanAadhaarLinkDocUploader;
