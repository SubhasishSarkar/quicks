import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import noFile from "../../../public/assets/no_documents.png";

const PanAadhaar = ({ data, handleChange }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [file, setFile] = useState();
    const [pic, setPic] = useState();
    const showFile = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
        setPic(e.target.files[0]);
    };
    const customFileUpload = {
        cursor: "pointer",
        border: "none",
    };

    const query = useQueryClient();
    const uploadProfilePic = () => {
        const token = localStorage.getItem("quicks_token");
        const formData = new FormData();
        formData.append("panAadhaarLinkedDoc", pic);
        axios
            .post(process.env.APP_BASE_API + "/pan-aadhaar-link-doc-upload", formData, {
                headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
            })
            .catch(function (error) {
                toast.error(error.response.data.message);
                setFile();
                query.refetchQueries("get-profile-page-data");
            })
            .then((res) => {
                if (res.status === 200) {
                    handleChange({ name: "pan_aadhaar_linked_doc", value: res.data.path });
                    toast.success(res.data.message);
                    setFile();
                    query.refetchQueries("get-profile-page-data");
                }
            });
    };

    const deleteProfilePicture = async () => {
        const token = localStorage.getItem("quicks_token");
        axios
            .delete(process.env.APP_BASE_API + "/pan-aadhaar-link-doc-upload", {
                headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
            })
            .catch(function (error) {
                toast.error(error.response.data.message);
                setFile();
                query.invalidateQueries("get-profile-page-data");
            })
            .then((res) => {
                if (res.status === 200) {
                    handleChange({ name: "pan_aadhaar_linked_doc", value: "" });
                    toast.success(res.data.message);
                    setFile();
                    query.refetchQueries("get-profile-page-data");
                }
            });
    };

    return (
        <>
            <div className="card datatable-box p-0" style={{ width: "fitContent" }}>
                <div className="card-header " style={{ background: "#fff", color: "black", border: "none", fontSize: "14px" }}>
                    <label htmlFor="">
                        {/* Pan Aadhaar Linked Document <span className="text-danger">*</span> */}
                        Note: Click Update after uploading or deleting the document
                    </label>
                </div>
                <div className="card-body p-0">
                    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        {!isHovered ? (
                            <div className="d-flex justify-content-md-center">
                                <img src={file ? file : data?.pan_aadhaar_linked_doc ? process.env.APP_BASE_V2 + data?.pan_aadhaar_linked_doc : noFile} alt="" width={100} />

                                <input
                                    id="file-upload"
                                    type="file"
                                    style={{ opacity: 0, display: "none", width: "auto" }}
                                    accept="image/jpeg"
                                    onChange={(e) => {
                                        showFile(e);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="d-flex justify-content-md-center">
                                <img src={file ? file : data?.pan_aadhaar_linked_doc ? process.env.APP_BASE_V2 + data?.pan_aadhaar_linked_doc : noFile} alt="" style={{ opacity: data?.pan_aadhaar_linked_doc ? "40%" : "" }} width={100} />
                                {data?.pan_aadhaar_linked_doc && (
                                    <button
                                        type="button"
                                        style={{ position: "absolute", top: "50px", bottom: "50px", left: "47%", cursor: "pointer", fontSize: "17px", background: "transparent", border: "none", color: "red" }}
                                        onClick={() => deleteProfilePicture()}
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="card-footer border-0 bg-transparent d-flex justify-content-md-start">
                    <div className="d-md-flex justify-content-md-center gap-3">
                        <button type="button" className="btn btn-sm p-0" title="Upload New">
                            <label htmlFor="file-upload" style={customFileUpload} className={!file ? "text-primary" : ""}>
                                <i className="fa-regular fa-image"></i> Choose
                            </label>
                        </button>
                        <button type="button" className={!file ? "btn btn-sm p-0" : "btn btn-sm p-0"} title="Save" style={customFileUpload} onClick={uploadProfilePic} disabled={!file}>
                            <label className={file && "text-success"} style={customFileUpload}>
                                <i className="fa-solid fa-arrow-up-from-bracket"></i> Upload
                            </label>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PanAadhaar;
