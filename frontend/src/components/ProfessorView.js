import { React, useInsertionEffect, useState, useEffect, useReducer } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
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
            "instructor": user.first_name,
        }
        socket.emit('create_new_lecture', data);
    }
    const endCurrentLecturePress = async () => {

    }
    return (
        <div className="professor-view-container">
            {/* <Route path="" exact>
                <Redirect to="/startlecture" />
            </Route> */}
            <h1>Current lecture code: {lectureCode ? lectureCode : "n/a"}</h1>
            <div>
                <Button onClick={createNewLecturePress}>Start a new lecture</Button>
            </div>
            <div>
                <Button onClick={endCurrentLecturePress}>End current lecture</Button>
            </div>
        </div>
    )
}