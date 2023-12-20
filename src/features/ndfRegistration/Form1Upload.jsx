import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import FPUploader from "../../components/FPUploader";
import { downloadFile } from "../../utils";

const Form1Upload = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const DownloadPassbook = async (applicationID) => {
        setLoading(true);
        await downloadFile(`/form1-download-pdf/${applicationID}`, "form-1.pdf");
        setLoading(false);
    };
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Form1 Upload</h5>
                </div>
                <div className="card-body" style={{ position: "relative", overflow: "hidden" }}>
                    <div className="row g-3">
                        <div className="col-md-6" style={{ textAlign: "center", margin: "auto" }}>
                            <label className="p-2">
                                <b>Download Your Form1 PDF</b>
                            </label>
                            <button type="submit" className="btn btn-success" onClick={() => DownloadPassbook(id)} disabled={loading}>
                                Download
                            </button>
                        </div>
                        <div className="col-md-6">
                            <FPUploader
                                title="Form1 Upload"
                                description="Upload Document first page and last page (Max size 450 KB, pdf file only)"
                                acceptedFileTypes={["application/pdf"]}
                                name="file"
                                onUploadSuccessful={() => navigate("/my-application-list")}
                                upload={`/caf-registration?id=${id}&type=documents-details&name=Form1`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Form1Upload;
