import { React, useState, useEffect, useRef } from 'react';
import { Route } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from "react-bootstrap/Button";
import io from 'socket.io-client'
import "./ProfessorView.css";
import { create } from 'lodash';

const socket = io.connect();

export const ProfessorView = (props) => {

    const binInterval = 5000; // interval of bins in millisecons 

    const {
        user,
        history,
        location,
        meetingUUID
    } = props

    const [lecturePresses, setLecturePresses] = useState([]);
    const [graphData, setGraphData] = useState(null);
    const [lectureData, setLectureData] = useState(null);
    const [recordingStatus, setRecordingStatus] = useState('Not Recording');
    const [lectureCode, setLectureCode] = useState('');
    const lectureCodeRef = useRef('');
    const locationRef = useRef('');
    lectureCodeRef.current = lectureCode;
    locationRef.current = location;

    useEffect(() => {
        socket.on('return_lecture_id', (res) => {
            console.log("RES LECTURE ID: ", res);
            setLectureCode(res);
        });
    });

    function createNewLecture() {
        var data = {
            "professorId": user.id,
            "meetingUUID": meetingUUID,
        }
        socket.emit('create_new_lecture', data, (lectureId) => {
            setLectureCode(lectureId);
        });
    }

    function endCurrentLecture() {
        socket.emit('end_current_lecture', lectureCodeRef.current, (lecture, presses, endTime) => {
            for (let i = 0; i < presses.length; i++) {
                console.log(presses[i].time);
                setLecturePresses(lecturePresses.push(presses[i].time));
            }
            setLectureCode('');
            console.log("lecture data: ", lecture[1]);
            setLectureData(lecture[1]);
            // console.log(lecturePresses);
            // console.log(endTime);
            // create histogram for data
            const hist = histogram(lecturePresses, binInterval, endTime);
            // set the data to be an array of objects 
            const graph = convertHistData(hist, binInterval);
            setGraphData(graph);
            console.log("Graph data: ");
            console.log(graphData);

            console.log("histogram : ", hist);
        });
    }

    function handleCloudRecordingEvent(event) {
        console.log(event);
        if (event === 'connecting' && !lectureCodeRef.current) {
            console.log("CONNECTING");
            setRecordingStatus('Connecting');
        }
        else if (event === 'started' && !lectureCodeRef.current) {
            console.log("CREATED NEW LECTURE");
            createNewLecture();
            history.push('/professor/in-lecture');
            setRecordingStatus('Recording');
        }
        else if (event === 'started' && lectureCodeRef.current) {
            console.log("RESUMED");
            socket.emit("resume_current_lecture", lectureCodeRef.current);
            setRecordingStatus('Recording');
        }
        else if (event === 'paused' && lectureCodeRef.current) {
            console.log("PAUSED");
            socket.emit("pause_current_lecture", lectureCodeRef.current);
            setRecordingStatus('Paused');
        }
        else if (event === 'stopped' && lectureCodeRef.current) {
            console.log("STOPPED");
            endCurrentLecture();
            history.push('/professor/lecture-data');
            setRecordingStatus('Not Recording');
        }
        else {
            console.log("NOTHING");
        }
    }

    useEffect(() => {
        zoomSdk.onCloudRecording((data) => {
            handleCloudRecordingEvent(data.action);
        })
    }, [])

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

    const exitDataView = () => {
        setGraphData(null);
        history.push('/professor/create-lecture');
    }

    const createNewLecturePress = () => {
        // TODO: add a check if they're already in a lecture
        console.log("=========Create new lecture button pressed=========");
        createNewLecture();
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
        endCurrentLecture();
    }
    return (
        <div className="professor-view-container">
            <Route path='/professor/create-lecture'>
                <div>
                    {/* <Button onClick={createNewLecturePress}>Start a new lecture</Button> */}
                    <h2>Start a cloud recording</h2>
                </div>
            </Route>
            <Route path='/professor/in-lecture'>
                <h2>Current lecture code: {lectureCodeRef.current ? lectureCodeRef.current : "n/a"}</h2>
                <h2>Recording status: {recordingStatus}</h2>
                <div>
                    {/* <Button onClick={endCurrentLecturePress}>End current lecture</Button> */}
                </div>
            </Route>
            <Route path='/professor/lecture-data'>
                <h1 class="text-center">Lecture {lectureData ? lectureData.createdAt.slice(0, 10) : "null"}</h1>
                <ButtonGraph />
                <Button onClick={exitDataView}>Exit</Button>
            </Route>
        </div>
        // <div className="professor-view-container">
        //     <h2>Recording status: {recordingStatus}</h2>
        // </div>

    )
}