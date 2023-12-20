import { Link } from "react-router-dom";

const AadhaarCorrectionStatus = ({ item }) => {
    console.log(item);
    console.log("TYPE---", item.is_active);
    const ViewType = item.is_active === 1 ? "/bmssy" : "/ssy";
    const actions = {
        view: {
            button: (
                <button type="button" className="btn btn-sm btn-primary " style={{ fontSize: 13, marginRight: "3px" }}>
                    <Link className="dropdown-item" to={"/beneficiary-details/" + item.enc_application_id + ViewType} style={{ textDecoration: "none" }} state={{ fromAadhaarCorrection: true, id: item.enc_application_id }}>
                        <i className="fa-solid fa-binoculars"></i> View
                    </Link>
                </button>
            ),
        },
    };

    const status = item.status.trim();

    switch (status) {
        case "A":
            return actions.view.button;
        default:
            // return actions.view.button;
            return "N/A";
    }
};

export default AadhaarCorrectionStatus;
