import { React, useState, useEffect } from 'react';
import { Route, Redirect, useLocation, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import io from 'socket.io-client'
import "./StudentView.css";

const socket = io.connect();

export const ProfessorView = (props) => {

    const history = useHistory();

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
        // TODO: add a check if they're already in a lecture
        console.log("=========Create new lecture button pressed=========");
        var data = {
            "professorId": user.id,
        }
        socket.emit('create_new_lecture', data);
        history.push('/professor/in-lecture');

    }
    const endCurrentLecturePress = () => {
        // TODO: get this lecture code from the backend
        socket.emit('end_current_lecture', lectureCode, (response) => {
            console.log(response);
        });
        history.push('/professor/create-lecture');
    }
    return (
        <div className="professor-view-container">
            {/* <Route path='/professor/create-lecture'> */}
            <div>
                <Button onClick={createNewLecturePress}>Start a new lecture</Button>
            </div>
            {/* </Route> */}
            {/* <Route path='/professor/in-lecture'> */}
            <h2>Current lecture code: {lectureCode ? lectureCode : "n/a"}</h2>
            <div>
                <Button onClick={endCurrentLecturePress}>End current lecture</Button>
            </div>
            {/* </Route> */}
        </div>
    )
}