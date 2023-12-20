import React from "react";
import { Link } from "react-router-dom";

import languagebox from "/assets/language-box.jpg";
import user_accessibility from "/assets/user_accessibility.png";

import bmssylogo from "/assets/bmssy-logo.png";
import beneficiaries_icon from "/assets/beneficiaries_icon.png";
import application_icon from "/assets/application_icon.png";
import site_counter_icon from "/assets/site_counter_icon.png";

const IndexHeader = () => {
    return (
        <>
            <div className="header-top">
                <div className="container">
                    <div className="row wow fadeIn">
                        <div className="col-12">
                            <div className="select-lang">
                                <img src={languagebox} alt="" className="img-fluid" />
                            </div>
                            <div className="dropdown top-header-font-resize">
                                <button className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img src={user_accessibility} width="" height="" alt="ssy_user_accessibility" />
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <Link className="dropdown-item" to="/">
                                        -A
                                    </Link>
                                    <Link className="dropdown-item" to="/">
                                        A
                                    </Link>
                                    <Link className="dropdown-item" to="/">
                                        +A
                                    </Link>
                                    <Link className="dropdown-item" to="/">
                                        A
                                    </Link>
                                    <Link className="dropdown-item" to="/">
                                        A
                                    </Link>
                                </div>
                            </div>
                            <div className="screen_reader">
                                <Link to="/">Screen Reader</Link>
                            </div>
                        </div>
                        {/* <div className="col-xs-12 col-sm-3 col-md-3 col-lg-5 ml-auto text-right"> */}
                        {/* <Link to="/login" className="login_btm">
                                Login
                            </Link> */}
                        {/* </div> */}
                    </div>
                </div>
            </div>

            <div className="header-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <Link to="index.html" className="main-logo wow fadeIn">
                                <img src={bmssylogo} alt="" width="" height="" className="img-fluid" />
                            </Link>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 counter-panel">
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 counter-box wow bounceIn">
                                    <div className="icon_box">
                                        <img src={beneficiaries_icon} className="img-fluid" width="" height="" alt="" />
                                    </div>
                                    <span className="counter">00,000,000</span>
                                    Beneficiaries
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 counter-box wow bounceIn">
                                    <div className="icon_box">
                                        <img src={application_icon} className="img-fluid" width="" height="" alt="" />
                                    </div>
                                    <span className="counter">00,00,000</span>
                                    Application
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 counter-box wow bounceIn">
                                    <div className="icon_box">
                                        <img src={site_counter_icon} className="img-fluid" width="" height="" alt="" />
                                    </div>
                                    <span className="counter">00,000,000</span>
                                    Site Counter
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div id="fixed-menu" className="menu wow fadeIn">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <nav className="navbar navbar-expand-lg">
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav">
                                        <li className="nav-item active">
                                            <a className="nav-link" href="/">
                                                Home
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/">
                                                About Us
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/">
                                                Acts & Rules
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/">
                                                Schemes
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/">
                                                Forms
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/">
                                                RTI
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/">
                                                Gallery
                                            </a>
                                        </li>

                                        <li className="nav-item">
                                            <a className="nav-link" href="/">
                                                Faq
                                            </a>
                                        </li>

                                        <li className="nav-item">
                                            <a className="nav-link" href="/">
                                                Contact Us
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="search ml-auto">
                                        <form action="/action_page.php">
                                            <input className="search-input" placeholder="Type Your Search..." type="search" value="" name="search" id="search" />
                                        </form>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
};

export default IndexHeader;
