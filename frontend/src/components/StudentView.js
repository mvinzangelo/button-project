import { React, useEffect, useState } from 'react';
import { Route, Redirect, useLocation, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import io from 'socket.io-client'
import "./StudentView.css";

const socket = io.connect();

export const StudentView = (props) => {

    const history = useHistory();

    const {
        user
    } = props

    const [lectureCode, setLectureCode] = useState('');
    const [buttonResponse, setButtonResponse] = useState('');

    const joinLectureButtonPress = () => {
        if (lectureCode !== '' && user.id !== '') {
            let studentId = user.id;
            let code = lectureCode;
            socket.emit('join_lecture', { studentId, code });
            history.push("/student/in-lecture");
        }
        else {
            console.error("No user or not in lecture.");
        }
    }

    const leaveLectureButtonPress = () => {
        if (user.id !== '') {
            let studentId = user.id;
            socket.emit('leave_lecture', studentId);
            setLectureCode('');
            history.push("/student/enter-code");
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
        socket.emit('button_press', data, (success) => {
            if (success) {
                setButtonResponse("Button press successfully recorded!");
            }
            else {
                setButtonResponse("Error: there was a problem recording the button press.");
            }
        });
    };

    return (
        <div className="student-view-container">
            <Route path='/student/enter-code' exact>
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
            </Route>
            <Route path='/student/in-lecture' exact>
                <div>
                    <Button class="form-control" onClick={confusionButtonPress}>Press me if you're confused</Button>
                </div>
                <div>
                    <small class="form-text text-muted">{buttonResponse}</small>
                </div>
                <div>
                    <Button onClick={leaveLectureButtonPress}>Leave lecture</Button>
                </div>
            </Route>
        </div>
    )
}