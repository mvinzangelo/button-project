import { React, useState, useEffect } from 'react';
import { Route, Redirect, useLocation, useHistory } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from "react-bootstrap/Button";
import io from 'socket.io-client'
import "./StudentView.css";

const socket = io.connect();

export const ProfessorView = (props) => {

    const history = useHistory();
    const binInterval = 5000; // interval of bins in millisecons (5 seconds)

    const {
        user
    } = props

    const [lectureCode, setLectureCode] = useState('');
    const [lecturePresses, setLecturePresses] = useState([]);

    useEffect(() => {
        socket.on('return_lecture_id', (res) => {
            console.log("RES LECTURE ID: ", res);
            setLectureCode(res);
        });
    });

    function histogram(X, binRange, endTime) {
        //inclusive of the first number  
        var numberOfBins = Math.ceil(endTime / binRange);
        var bins = new Array(numberOfBins).fill(0);
        //-min to normalise values for the array
        X.forEach((x) => bins[Math.floor(x / binRange)]++);
        return bins;
    }

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
        socket.emit('end_current_lecture', lectureCode, (presses, endTime) => {
            for (let i = 0; i < presses.length; i++) {
                console.log(presses[i].time);
                setLecturePresses(lecturePresses.push(presses[i].time));
            }
            console.log(lecturePresses);
            console.log(endTime);
            // create histogram for data
            const hist = histogram(lecturePresses, binInterval, endTime);
            console.log("histogram : ", hist);
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
            {/* <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={[1, 1, 1, 10]}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer> */}
            {/* </Route> */}
        </div>
    )
}