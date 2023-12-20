import React, { useState } from "react";
import { downloadExistingFile } from "../../utils";
import axios from "axios";
import { toast } from "react-toastify";

const SampleExcelUpload = () => {
    const downloadSampleExcel = () => {
        downloadExistingFile("/download-sample-excel", "download-sample-excel.xlsx");
    };

    const [pic, setPic] = useState();
    const showFile = (e) => {
        setPic(e.target.files[0]);
    };

    const uploadProfilePic = () => {
        const token = localStorage.getItem("bmssy_token");
        const formData = new FormData();
        formData.append("excelFile", pic);
        axios
            .post(process.env.APP_BASE_API + "/insert-data-from-excel", formData, {
                headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
            })
            .catch(function (error) {
                toast.error(error.response.data.message);
            })
            .then((res) => {});
    };

    return (
        <>
            <div className="row">
                <div className="col-md-3">
                    <label htmlFor="formFile" className="form-label">
                        Download our sample excel
                    </label>
                    <button type="button" className="btn btn-primary mb-3" onClick={downloadSampleExcel}>
                        Download Excel
                    </button>
                </div>
                <div className="col-md-4">
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">
                            Upload Excel
                        </label>

                        <input
                            className="form-control"
                            id="file-upload"
                            type="file"
                            onChange={(e) => {
                                showFile(e);
                            }}
                        />
                        <button type="Submit" className="btn btn-primary btn-sm" onClick={uploadProfilePic}>
                            Upload Excel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SampleExcelUpload;
