import { useState } from "react";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Button } from "react-bootstrap";

const Sample = () => {
    const [confirm, setConfirm] = useState(false);

    const handleConfirm = () => {
        setConfirm(true);
    };

    return (
        <>
            <ConfirmationModal handleConfirm={handleConfirm} title="You are breaking chronological order. Do you want to continue ?" />
            <Button onClick=""> open </Button>
        </>
    );
};

export default Sample;
