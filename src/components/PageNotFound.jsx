import React from "react";
import { Link } from "react-router-dom";
// import invalid from "/assets/404_page.png";
// import logo from "/assets/bmssy-logo.png";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { FreeMode, Autoplay } from "swiper";
// import "swiper/css";
// import "swiper/css/pagination";
// import "../scss/swiper.scss";
// import "swiper/css/free-mode";
// import IndexFooter from "../layout/IndexFooter";

// import digital_india_logo from "/assets/digital_india_logo.jpg";
// import my_gov_logo from "/assets/my_gov_logo.jpg";
// import egiye_bengal_logo from "/assets/egiye_bengal_logo.jpg";
// import bengal_logo from "/assets/bengal_logo.jpg";
// import wbidc from "/assets/wbidc.jpg";
// import wblabour from "/assets/wblabour.jpg";
// import finance from "/assets/finance.jpg";

import "../scss/404Page.scss";

const PageNotFound = () => {
    return (
        <>
            {/* <div className="container text-center">
                <div className="row">
                    <div className="col-md-12">
                        <img src={logo} alt="" width="100%" />
                    </div>
                    <div className="col-md-12">
                        <img src={invalid} alt="" width="60%" height="100%" />
                    </div>
                </div>
            </div>
            <section className="services">
                <div className="d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <p className="fs-3">
                            <span className="text-danger">Opps!</span> Page not found.
                        </p>
                        <p className="lead">The page you’re looking for doesn’t exist.</p>
                        <Link to="/dashboard" className="btn btn-primary">
                            Go Home
                        </Link>
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
                                    <Link to="http://wbfin.nic.in/" target="_blank" rel="noreferrer">
                                        <img src={finance} alt="" />
                                    </Link>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
            <IndexFooter /> */}
            <div className="not-found-container">
                <div className="not-found-content">
                    <h1 className="not-found-title">404 - Not Found</h1>
                    <p className="not-found-text">Oops! It looks like the page you are searching for is not found.</p>

                    <Link to="/dashboard" className="btn btn-primary">
                        Go Home
                    </Link>
                </div>
            </div>
        </>
    );
};

export default PageNotFound;
