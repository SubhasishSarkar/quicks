import { useState } from "react";
import "../scss/ImageMagnifier.scss";

const BmssyImageZoom = ({ imageUrl }) => {
    const [zoomLevel, setZoomLevel] = useState(1);

    const handleZoomIn = () => {
        setZoomLevel(zoomLevel + 0.2);
    };

    const handleZoomOut = () => {
        setZoomLevel(zoomLevel - 0.2);
    };

    const handleReset = () => {
        setZoomLevel(1);
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12 mb-2 d-flex justify-content-md-center">
                    <div className="row">
                        <div className="col-md-4">
                            <button type="button" className="btn btn-success" onClick={handleZoomIn} title="zoom in">
                                <i className="fa-solid fa-magnifying-glass-plus"></i>
                            </button>
                        </div>
                        <div className="col-md-4">
                            <button type="button" className="btn btn-warning" onClick={handleReset} title="back to original size">
                                <i className="fa-solid fa-rotate-right"></i>
                            </button>
                        </div>
                        <div className="col-md-4">
                            <button type="button" className="btn btn-primary" onClick={handleZoomOut} title="zoom out">
                                <i className="fa-solid fa-magnifying-glass-minus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="image-container scroll--simple rectification_modal_tabs">
                        <img
                            className="image"
                            src={imageUrl}
                            alt=""
                            height="50%"
                            width="50%"
                            style={{
                                transform: `scale(${zoomLevel})`,
                                transformOrigin: "top left", // Set the transform origin to the top left corner
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BmssyImageZoom;
