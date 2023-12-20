import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AccessDenied() {
    const navigate = useNavigate();
    return (
        <div className="d-flex justify-content-center align-items-center h-100">
            <div className="row w-100 d-flex justify-content-center">
                <Card className="p-4 col-8 ">
                    <div className="d-flex justify-content-center">
                        <img style={{ maxHeight: "250px", maxWidth: "100%" }} src="/assets/id-card.png" alt="access denied" />
                    </div>
                    <h3 style={{ textAlign: "center" }}>Access Denied</h3>
                    <div className="d-flex justify-content-center">
                        <div className="col-6">
                            <Button
                                className="w-100"
                                onClick={() => {
                                    navigate(-1);
                                }}
                            >
                                Go Back
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default AccessDenied;
