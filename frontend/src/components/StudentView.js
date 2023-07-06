import { React, useState } from 'react';
import { Route, Redirect, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import io from 'socket.io-client'
import "./StudentView.css";

const socket = io.connect();

export const StudentView = (props) => {

    const {
        user
    } = props

    const [lectureCode, setLectureCode] = useState('');

    const joinLectureButtonPress = () => {
        if (lectureCode !== '' && user.first_name !== '') {
            let name = user.first_name;
            let code = lectureCode;
            socket.emit('join_lecture', { name, code });
        }
    }

    const confusionButtonPress = async () => {
        console.log("=========Confusion button pressed=========");
        var data = {
            "student": user.first_name,
            // ! should be refactored to be stored in the backend
            "lectureId": lectureCode
        }
        socket.emit('button_press', data);
    };

    return (
        <div className="confusion-button-container">
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