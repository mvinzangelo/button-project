import { React, useState } from 'react';
import { Route, Redirect, useHistory } from "react-router-dom";
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
        </div>
    )
}