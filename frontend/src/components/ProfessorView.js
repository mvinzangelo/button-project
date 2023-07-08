import { React, useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import io from 'socket.io-client'
import "./StudentView.css";

const socket = io.connect();

export const ProfessorView = (props) => {

    const {
        user
    } = props

    const [lectureCode, setLectureCode] = useState('');

    useEffect(() => {
        socket.on('return_lecture_id', (res) => {
            console.log("RESPONSE: ", res);
            setLectureCode(res);
        });
    });

    const createNewLecturePress = () => {
        console.log("=========Create new lecture button pressed=========");
        var data = {
            "professorId": user.id,
        }
        socket.emit('create_new_lecture', data);
    }
    const endCurrentLecturePress = () => {
        // TODO: get this lecture code from the backend
        socket.emit('end_current_lecture', lectureCode);
    }
    return (
        <div className="professor-view-container">
            {/* <Route path="" exact>
                <Redirect to="/startlecture" />
            </Route> */}
            <h2>Current lecture code: {lectureCode ? lectureCode : "n/a"}</h2>
            <div>
                <Button onClick={createNewLecturePress}>Start a new lecture</Button>
            </div>
            <div>
                <Button onClick={endCurrentLecturePress}>End current lecture</Button>
            </div>
        </div>
    )
}