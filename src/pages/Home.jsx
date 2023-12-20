import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "../scss/swiper.scss";
import "swiper/css/free-mode";
import { Link } from "react-router-dom";

import slider1 from "/assets/slider1.jpg";
import slider2 from "/assets/slider2.jpg";
import download_icon from "/assets/download_icon.png";
import helpdesk_icon from "/assets/helpdesk_icon.png";
import helpdesk from "/assets/helpline_icon.png";
import contact from "/assets/contact_icon.png";
import digital_india_logo from "/assets/digital_india_logo.jpg";
import my_gov_logo from "/assets/my_gov_logo.jpg";
import egiye_bengal_logo from "/assets/egiye_bengal_logo.jpg";
import bengal_logo from "/assets/bengal_logo.jpg";
import wbidc from "/assets/wbidc.jpg";
import wblabour from "/assets/wblabour.jpg";
import finance from "/assets/finance.jpg";
import new_tag from "/assets/new_tag.png";

const Home = () => {
    return (
        <>
            <section className="slider">
                <Swiper
                    loop={true}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    direction={"vertical"}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination, Autoplay]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <img data-u="image" src={slider1} alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img data-u="image" src={slider2} alt="" />
                    </SwiperSlide>
                </Swiper>
            </section>
            <section className="activities">
                <div className="container">
                    <div className="row">
                        <div className="col-xl col-lg col-md-4 col-sm-12">
                            <Link to="/login">
                                <div className="ssin pb-3 my-lg-4 my-md-3 mb-sm-2 mt-sm-4">
                                    <i className="fa-solid fa-user-lock fa-2x" alt="userLogin"></i>
                                    <span>
                                        User <br />
                                        Login
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <div className="col-xl col-lg col-md-4 col-sm-12">
                            <Link to="/">
                                <div className="agent pb-3 my-lg-4 my-md-3 my-sm-2">
                                    <i className="fa-solid fa-file-pen fa-2x" alt="newRegistration"></i>
                                    <span>
                                        New Registration <br />
                                        by Beneficiary
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <div className="col-xl col-lg col-md-4 col-sm-12">
                            <Link to="/">
                                <div className="track pb-3 my-lg-4 my-md-3 my-sm-2">
                                    <i className="fa-solid fa-magnifying-glass-plus fa-2x" alt="Search Your Details"></i>
                                    <span>
                                        Search
                                        <br />
                                        Your Details
                                    </span>
                                </div>
                            </Link>
                        </div>

                        <div className="col-xl col-lg col-md-6 col-sm-12">
                            <Link to="/">
                                <div className="nominee pb-3 my-lg-4 mb-md-3 my-sm-2">
                                    <i className="fa-solid fa-hands-holding-circle fa-2x" alt="AboutScheme"></i>
                                    <span>
                                        About The <br />
                                        Scheme
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <div className="col-xl col-lg col-md-6 col-sm-12">
                            <Link to="/">
                                <div className="report pb-3 my-lg-4 mb-md-3 mt-sm-2 mb-sm-4">
                                    <i className="fa-solid fa-file-lines fa-2x" alt="UserManual"></i>
                                    <span>
                                        User <br />
                                        Manual
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className="services">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-6 col-sm-12 services-area">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="media wow bounceInLeft">
                                        <img src={download_icon} width="" height="" alt="" />
                                        <div className="media-body">
                                            <h2>Reports</h2>
                                            <p>View & Download various reports</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="media wow bounceInLeft">
                                        <img src={helpdesk_icon} width="" height="" alt="" />
                                        <div className="media-body">
                                            <h2>Helpdesk</h2>
                                            <p>May we help you? For any query please contact us.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media wow bounceInLeft">
                                        <img src={contact} width="" height="" alt="" />
                                        <div className="media-body">
                                            <h2>Contact Us</h2>
                                            <p>11th Floor, New Secretariat Building, 1, Kiran Shankar Ray Road, Kolkata-700001</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="media wow bounceInLeft">
                                        <img src={helpdesk} width="" height="" alt="" />
                                        <div className="media-body">
                                            <h2>Shramik Sathi</h2>
                                            <p>
                                                Help Line of Labour Commissionerate, Gov.of West Bengal.
                                                <br />
                                                <b>1800-103-0009(Tol Free)</b>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 ">
                            <div
                                className="wow bounceInRight notification"
                                style={{
                                    visibility: "visible",
                                    animationName: "bounceInRight",
                                }}
                            >
                                <h2>Announcements</h2>
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        <ul
                                            className="demo"
                                            style={{
                                                overflowY: "hidden",
                                                height: "221px",
                                            }}
                                        >
                                            <li>
                                                <Link to="/">
                                                    The service of Registration of Construction Workers and Transport Workers under the BOCW Scheme and WBTWSSS respectively is now available in BMSSY portal instead of e-District Portal.{" "}
                                                    <img src={new_tag} width="" height="" alt="" />
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="panel-footer"> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="others-links">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <Swiper
                                loop={true}
                                autoplay={{
                                    delay: 1000,
                                    disableOnInteraction: false,
                                }}
                                slidesPerView={5}
                                spaceBetween={16}
                                freeMode={true}
                                modules={[FreeMode, Autoplay]}
                                className="mySwiper"
                            >
                                <SwiperSlide>
                                    <Link to="http://www.digitalindia.gov.in/" target="_blank" rel="noreferrer">
                                        <img src={digital_india_logo} alt="" />
                                    </Link>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Link to="https://www.mygov.in/" target="_blank" rel="noreferrer">
                                        <img src={my_gov_logo} alt="" />
                                    </Link>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Link to="https://wb.gov.in/" target="_blank" rel="noreferrer">
                                        <img src={egiye_bengal_logo} alt="" />
                                    </Link>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Link to="https://www.wbtourismgov.in/" target="_blank" rel="noreferrer">
                                        <img src={bengal_logo} alt="" />
                                    </Link>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Link to="http://wbidc.com/" target="_blank" rel="noreferrer">
                                        <img src={wbidc} alt="" />
                                    </Link>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Link to="https://wblabour.gov.in/" target="_blank" rel="noreferrer">
                                        <img src={wblabour} alt="" />
                                    </Link>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Link to="https://wbfin.nic.in/" target="_blank" rel="noreferrer">
                                        <img src={finance} alt="" />
                                    </Link>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
