import React, { useState } from "react";
import { GeoJSON, MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../scss/westBengalMap.scss";

const WestBengalMap = ({ districtData, setDistrictName, setDistrictId, districtId }) => {
    const [highlightedDistrict, setHighlightedDistrict] = useState(null);
    const onEachFeature = (feature, layer) => {
        layer.on({
            click: (e) => {
                setDistrictName(feature.properties.name);
                setDistrictId(feature.properties.bmssy_dis_code);
                setHighlightedDistrict(feature.properties.bmssy_dis_code);
            },
            // mouseout: (e) => {
            //     setDistrictName("");
            // },
        });
    };

    const geoJsonStyle = (feature) => {
        const isHighlighted = highlightedDistrict === feature.properties.bmssy_dis_code;

        return {
            fillColor: feature.properties.fill_color,
            color: isHighlighted ? "black" : "white",
            weight: isHighlighted ? 3 : 1,
            fillOpacity: 2.5,
        };
    };

    return (
        <>
            <MapContainer
                center={[23.685, 86.9444]}
                zoom={6.5}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                maxBoundsViscosity={1.0}
                zoomControl={false}
                scrollWheelZoom={false}
                dragging={false}
                touchZoom={false}
                doubleClickZoom={false}
                boxZoom={false}
                keyboard={false}
            >
                <GeoJSON data={districtData} onEachFeature={onEachFeature} style={geoJsonStyle} />
            </MapContainer>
        </>
    );
};

export default WestBengalMap;
