import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import DefaultProfilePicture from "../../../public/assets/DefaultProfilePicture.png";
import { useDispatch } from "react-redux";
import { profile } from "../../store/slices/userSlice";

const ProfilePicture = ({ data }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [file, setFile] = useState();
    const [pic, setPic] = useState();
    const dispatch = useDispatch();
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
        formData.append("profilePic", pic);
        axios
            .post(process.env.APP_BASE_API + "/upload-profile-picture", formData, {
                headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
            })
            .catch(function (error) {
                toast.error(error.response.data.message);
                setFile();
                query.invalidateQueries("get-profile-page-data");
            })
            .then((res) => {
                if (res.status === 200) {
                    dispatch(profile(res.data.user));
                    toast.success(res.data.message);
                    setFile();
                    query.invalidateQueries("get-profile-page-data");
                }
            });
    };

    const deleteProfilePicture = async () => {
        const token = localStorage.getItem("quicks_token");
        axios
            .get(process.env.APP_BASE_API + "/delete-profile-picture", {
                headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
            })
            .catch(function (error) {
                toast.error(error.response.data.message);
                setFile();
                query.invalidateQueries("get-profile-page-data");
            })
            .then((res) => {
                if (res.status === 200) {
                    dispatch(profile(res.data.user));
                    toast.success(res.data.message);
                    setFile();
                    query.invalidateQueries("get-profile-page-data");
                }
            });
    };

    return (
        <>
            <div className="card datatable-box" style={{ height: "100%" }}>
                <div className="card-header" style={{ background: "#fff", color: "black", border: "none" }}>
                    Profile Picture
                </div>
                <div className="card-body">
                    <div className="d-md-flex justify-content-md-center img-profile rounded-circle" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        {!isHovered ? (
                            <>
                                <img src={file ? file : data?.profile_pic ? process.env.APP_BASE + "/" + data?.profile_pic : DefaultProfilePicture} alt="" />

                                <input
                                    id="file-upload"
                                    type="file"
                                    style={{ opacity: 0, display: "none" }}
                                    accept="image/jpeg"
                                    onChange={(e) => {
                                        showFile(e);
                                    }}
                                />
                            </>
                        ) : (
                            <div className="d-flex justify-content-md-center  rounded-circle">
                                <img src={file ? file : data?.profile_pic ? process.env.APP_BASE + "/" + data?.profile_pic : DefaultProfilePicture} alt="" style={{ opacity: data?.profile_pic && "40%" }} />
                                {data?.profile_pic && (
                                    <button type="button" style={{ position: "absolute", top: "100px", cursor: "pointer", fontSize: "19px", background: "transparent", border: "none", color: "red" }} onClick={() => deleteProfilePicture()}>
                                        <i className="fa-solid fa-trash-can"></i>
                                        <span style={{ fontSize: "12px", display: "block", fontWeight: "500" }}>Delete</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="card-footer border-0 bg-transparent">
                    <div className="d-md-flex justify-content-md-center gap-3">
                        <button type="button" className="btn btn-sm p-0" title="Upload New">
                            <label htmlFor="file-upload" style={customFileUpload} className={!file && "text-primary"}>
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

export default ProfilePicture;
