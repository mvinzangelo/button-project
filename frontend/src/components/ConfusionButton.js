import { React, useState } from 'react';
import Button from "react-bootstrap/Button";
import { apis, invokeZoomAppsSdk } from "../apis";
import "./ConfusionButton.css";

function ConfusionButton() {
    return (
        <Button>Press me if you're confused</Button>
    )
}

export default ConfusionButton