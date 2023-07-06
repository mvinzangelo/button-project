import { React, useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import "./ConfusionButton.css";

export const ConfusionButton = (props) => {

    const [roomCode, setRoomCode] = useState(1);

    const {
        user
    } = props

    const confusionButtonPress = async () => {
        console.log("=========Confusion button pressed=========");
        var data = {
            "student": user.first_name,
            // ! should be refactored to be stored in the backend
            "lectureId": roomCode
        }
        fetch('/api/postgres/onbuttonpress', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            console.log("Button press updated correctly.")
        }).catch(e => {
            console.error(e);
        });
    };

    const createNewLecturePress = async () => {
        console.log("=========Create new lecture button pressed=========");
        var data = {
            "instructor": user.first_name,
        }
        fetch('/api/postgres/oncreatenewlecture', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            console.log("Button press updated correctly.")
        }).catch(e => {
            console.error(e);
        });
    }
    return (
        <div className="confusion-button-container">
            <div>
                <Button onClick={confusionButtonPress}>Press me if you're confused</Button>
            </div>
            <div>
                <Button onClick={createNewLecturePress}>Create a new lecture</Button>
            </div>
            <Form>
                <Form.Group className="mb-3" controlId="fromRoomCode">
                    <Form.Label>Room code</Form.Label>
                    <Form.Control placeholder="Enter room code"
                        value={roomCode}
                        onChange={(e) => { setRoomCode(e.target.value) }}
                        type="text"
                    />
                </Form.Group>
            </Form>
            <div>
                <Button>Join lecture</Button>
            </div>
        </div>
    )
}