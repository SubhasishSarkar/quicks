import React, { useState } from "react";
import FPUploader from "../../../components/FPUploader";
import { downloadFile } from "../../../utils";
import { toast } from "react-toastify";

const FormUploader = ({ handleUpload, title, viewURL, uploadURL, downloadURL, downloadFileName,handleRemove}) => {
    const [loading, setLoading] = useState(false);

    const DownloadForm = async () => {
        setLoading(true);
        const doc = await downloadFile(downloadURL, downloadFileName);
        if (doc === false) toast.error("Unable to download pdf");
        setLoading(false);
    };

    // console.log(viewURL)

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">{title + " upload"} </h5>
                </div>
                <div className="card-body" style={{ position: "relative", overflow: "hidden" }}>
                    <div className="row g-3">
                        <div className="col-md-6" style={{ textAlign: "center", margin: "auto" }}>
                            <label className="p-2">
                                <b>{`Download Your ${title} PDF`}</b>
                            </label>
                            <button type="submit" className="btn btn-success" onClick={() => DownloadForm()} disabled={loading}>
                                Download
                            </button>
                        </div>
                        <div className="col-md-6">
                            <FPUploader
                                fileURL={viewURL ?? ''}
                                title={title + " Upload"}
                                maxFileSize="450KB"
                                description="Upload Document first page and last page (Max size 450 KB, pdf file only)"
                                acceptedFileTypes={["application/pdf"]}
                                name="file"
                                onUploadSuccessful={handleUpload}
                                onDeleteSuccessful={handleRemove}
                                upload={uploadURL}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormUploader;
