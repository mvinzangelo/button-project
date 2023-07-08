import { React, useEffect, useState } from 'react';
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
        if (lectureCode !== '' && user.id !== '') {
            let studentId = user.id;
            let code = lectureCode;
            socket.emit('join_lecture', { studentId, code });
        }
        else {
            console.error("No user or not in lecture.");
        }
    }

    const leaveLectureButtonPress = () => {
        if (user.id !== '') {
            socket.emit('leave_lecture');
        }
        else {
            console.error("No user.");
        }
    }

    const confusionButtonPress = async () => {
        console.log("=========Confusion button pressed=========");
        var data = {
            "studentId": user.id,
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
                    <Button onClick={leaveLectureButtonPress}>Leave lecture</Button>
                </Form.Group>
            </Form>
            <div>
                <Button onClick={confusionButtonPress}>Press me if you're confused</Button>
            </div>
        </div>
    )
}