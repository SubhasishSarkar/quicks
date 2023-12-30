import React from "react";
import { Link } from "react-router-dom";

import "../scss/404Page.scss";

const PageNotFound = () => {
    return (
        <>
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
