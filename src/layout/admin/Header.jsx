import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../store/slices/userSlice";
import userImg from "../../../public/assets/user.jpg";

import useDeviceDetector, { isMobile } from "../../hooks/DeviceDetector";
import { useEffect, useState } from "react";
import ChangePassword from "../../components/ChangePassword";

const Header = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.user);
    const pageTitle = useSelector((state) => state.pageAddress);
    const deviceType = useDeviceDetector();
    const isMobileDevice = isMobile(deviceType);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (userData.updatePassword && !show) {
            setShow(true);
        }
    }, [userData, show]);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dashboard pt-0">
                <div className="col-md-8" id="headerTitle">
                    <h1>{pageTitle.subTitle ? pageTitle.subTitle : pageTitle.title}</h1>
                    <nav className="breadcrumb mb-0">
                        <Link className="breadcrumb-item" to="/dashboard" style={{ textDecoration: "none" }}>
                            <span className="badge rounded-pill text-bg-light  text-capitalize">
                                {" "}
                                <i className="fa-solid fa-house-chimney" style={{ color: "#001848" }}></i> Home
                            </span>
                        </Link>
                        {pageTitle.url ? (
                            <Link className="breadcrumb-item" to={pageTitle.url} style={{ textDecoration: "none" }}>
                                <span className="breadcrumb-item">
                                    <span className="badge rounded-pill text-bg-light  text-capitalize">
                                        <i className="fa-regular fa-folder"></i> {pageTitle.title}
                                    </span>
                                </span>
                            </Link>
                        ) : (
                            <span className="breadcrumb-item">
                                <span className="badge rounded-pill text-bg-light  text-capitalize">
                                    <i className="fa-solid fa-fire"></i> {pageTitle.title}
                                </span>
                            </span>
                        )}
                        {pageTitle.subTitle && (
                            <span className="breadcrumb-item">
                                <span className="badge rounded-pill text-bg-light  text-capitalize">
                                    <i className="fa-solid fa-fire"></i> {pageTitle.subTitle}
                                </span>
                            </span>
                        )}
                    </nav>
                </div>

                <ul className="navbar-nav ms-auto">
                    <li className="nav-item dropdown header-user">
                        <Link className="nav-link" to="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <div className="float-left img-profile rounded-circle">{userData && userData.profilePic ? <img src={userData.profilePic} alt="" /> : <img className="img-profile rounded-circle" src={userImg} alt="" />}</div>
                            {!isMobileDevice && (
                                <div className="float-right">
                                    <div className="text-gray-600 small">
                                        <strong>{userData.name}</strong>
                                    </div>
                                    <div className="text-gray-600 small">
                                        {userData.role} ({userData.profile})
                                    </div>
                                </div>
                            )}
                        </Link>
                        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown" style={{ position: "absolute" }}>
                            {isMobileDevice && (
                                <div>
                                    <div className="bg-sidebar">
                                        <div className="user-role">
                                            {userData.name}
                                            <br />
                                            {userData.role}({userData.profile} )
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Link className="dropdown-item" to={"/profile/" + userData.role}>
                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i> Profile
                            </Link>

                            <Link className="dropdown-item" to="#" onClick={handleShow}>
                                <i className="fas fa-key fa-sm fa-fw mr-2 text-gray-400"></i> Change Password
                            </Link>
                            <div className="dropdown-divider"></div>
                            <Link
                                className="dropdown-item"
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(logout());
                                }}
                            >
                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i> Logout
                            </Link>
                        </div>
                    </li>
                </ul>
            </nav>

            <ChangePassword show={show} setShow={setShow} forceUpdate={userData.updatePassword} />
        </>
    );
};

export default Header;
