import { React, useState } from 'react';
import Button from "react-bootstrap/Button";
import { invokeConfusionPress } from "../apis";
import "./ConfusionButton.css";

function ConfusionButton() {
    return (
        <div className="confusion-button">
            <Button onClick={invokeConfusionPress()}>Press me if you're confused</Button>
        </div>
    )
}

export default ConfusionButton