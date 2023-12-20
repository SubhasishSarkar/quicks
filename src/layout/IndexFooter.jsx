import React from "react";
import { Link } from "react-router-dom";
import ssy_nic_logo from "/assets/ssy_nic_logo.png";
import app_icon from "/assets/app_icon.png";
import child_labor from "/assets/child_labor.jpg";

const IndexFooter = () => {
    return (
        <footer className="footer">
            <div className="container wow fadeIn py-3">
                <div className="row align-items-center">
                    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-12">
                        <div className="d-flex flex-column align-items-md-start justify-content-sm-center">
                            <Link to="http://www.nic.in/" target="_blank" rel="noreferrer">
                                <img src={ssy_nic_logo} alt="Design By NIC" className="" />
                            </Link>
                        </div>
                    </div>
                    <div className="col-xl-8 col-lg-7 col-md-5 col-sm-12">
                        <p>
                            All efforts have been made to make the information as accurate as possible. Contents of the this site are owned and maintained by the Office of the Labour Department. National Informatics Centre (NIC), will not be
                            responsible for any loss to any person caused by inaccuracy in the information available on this Website. Any discrepancy found may be brought to the notice of the Office of the Labour Department.
                        </p>
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-3 col-sm-12">
                        <div className="d-flex flex-column align-items-md-end justify-content-sm-center">
                            <Link to="/">
                                <img src={app_icon} alt="Child Labor" className="me-3 mb-1" />
                            </Link>
                            <Link to="/">
                                <img src={child_labor} alt="Child Labor" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <div className="row">
                        <p>
                            <Link to="/">Site Map</Link> &nbsp;|&nbsp;
                            <Link to="/">Disclaimer</Link> &nbsp;|&nbsp;
                            <Link to="/">Policy</Link>
                        </p>
                        <p className="copyright">
                            Copyright &copy; 2020 -22
                            <span>Labour Department</span> - All Rights Reserved
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default IndexFooter;
