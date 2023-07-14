import { React, useState, useEffect } from 'react';
import { Route, Redirect, useLocation, useHistory } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from "react-bootstrap/Button";
import io from 'socket.io-client'
import "./ProfessorView.css";

const socket = io.connect();

export const ProfessorView = (props) => {

    const history = useHistory();
    const binInterval = 5000; // interval of bins in millisecons 

    const {
        user
    } = props

    const [lectureCode, setLectureCode] = useState('');
    const [lecturePresses, setLecturePresses] = useState([]);
    const [graphData, setGraphData] = useState(null);

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

    // from https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    function convertHistData(data, binInterval) {
        return data.map((x, index) => (
            {
                time: millisToMinutesAndSeconds(index * binInterval),
                presses: x
            }
        ));
    }

    const createNewLecturePress = () => {
        // TODO: add a check if they're already in a lecture
        console.log("=========Create new lecture button pressed=========");
        var data = {
            "professorId": user.id,
        }
        socket.emit('create_new_lecture', data);
        history.push('/professor/in-lecture');
        setGraphData(null);
    }
    function ButtonGraph() {
        if (graphData === null) {
            return <></>
        }
        else {
            return (
                <ResponsiveContainer className="graph-container" width="90%" height="80%">
                    <LineChart
                        width={500}
                        height={300}
                        data={graphData}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis height={50} dataKey="time" label={{ value: 'Timestamp', position: 'insideBottom', offset: 0 }} />
                        <YAxis width={50} label={{ value: 'Number of button presses', angle: -90, position: 'insideLeft', offset: 0 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="presses" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            )
        }
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
            // set the data to be an array of objects 
            const graph = convertHistData(hist, binInterval);
            setGraphData(graph);

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
            {/* </Route> */}
            {/* <Route path='/professor/lecture-data'> */}
            {/* </Route> */}
            <ButtonGraph />
        </div>
    )
}