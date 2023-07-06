import { React, useState } from 'react';
import { Route, Redirect, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import io from 'socket.io-client'
import "./ConfusionButton.css";

const socket = io.connect();

export const ConfusionButton = (props) => {

    const {
        user
    } = props

    const [lectureCode, setLectureCode] = useState('');

    const joinLecture = () => {
        if (lectureCode !== '' && user.first_name !== '') {
            let name = user.first_name;
            let code = lectureCode;
            socket.emit('join_lecture', { name, code });
        }
    }

    const joinLectureButtonPress = () => {
        joinLecture();
    }

    const confusionButtonPress = async () => {
        console.log("=========Confusion button pressed=========");
        var data = {
            "student": user.first_name,
            // ! should be refactored to be stored in the backend
            "lectureId": lectureCode
        }
        socket.emit('button_press', data);
        // * old http method
        // fetch('/api/postgres/onbuttonpress', {
        //     method: "POST",
        //     body: JSON.stringify(data),
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // }).then(() => {
        //     console.log("Button press updated correctly.")
        // }).catch(e => {
        //     console.error(e);
        // });
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
                <Button onClick={createNewLecturePress}>Create a new lecture</Button>
            </div>
            <Form>
                <Form.Group className="mb-3" controlId="fromRoomCode">
                    <Form.Label>Room code</Form.Label>
                    <Form.Control placeholder="Enter room code"
                        value={lectureCode}
                        onChange={(e) => { setLectureCode(e.target.value) }}
                        type="text"
                    />
                    <Button onClick={joinLectureButtonPress}>Join lecture</Button>
                </Form.Group>
            </Form>
            <div>
                <Button onClick={confusionButtonPress}>Press me if you're confused</Button>
            </div>
        </div>
    )
}