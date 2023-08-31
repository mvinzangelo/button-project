const { UUIDV4 } = require("sequelize");
const Stopwatch = require('statman-stopwatch');

const ROOM_MAX_CAPACITY = 300;

class Lecture {
    constructor() {
        this.lecturesState = [];
    }
    addLecture(lecture) {
        this.lecturesState.push({
            info: lecture,
            time: new Stopwatch(true),
            students: []
        });
    }
    joinLecture(lectureCode, student) {
        for (let i = 0; i < this.lecturesState.length; i++) {
            if (this.lecturesState[i].info.id === lectureCode) {
                this.lecturesState[i].students.push(student);
                return 0;
            }
        }
        return -1;
    }
    getTime(lectureCode) {
        for (let i = 0; i < this.lecturesState.length; i++) {
            if (this.lecturesState[i].info.id === lectureCode) {
                return this.lecturesState[i].time.read();
            }
        }
        return 0;
    }
    pauseTime(lectureCode) {
        for (let i = 0; i < this.lecturesState.length; i++) {
            if (this.lecturesState[i].info.id === lectureCode) {
                return this.lecturesState[i].time.stop();
            }
        }
        return 0;
    }
    resumeTime(lectureCode) {
        for (let i = 0; i < this.lecturesState.length; i++) {
            if (this.lecturesState[i].info.id === lectureCode) {
                return this.lecturesState[i].time.start();
            }
        }
        return 0;
    }
    removeLecture(lectureCode) {
        const objWithIdIndex = this.lecturesState.findIndex((obj) => obj.info.id === lectureCode);
        if (objWithIdIndex > -1) {
            const endTime = this.lecturesState[objWithIdIndex].time.read();
            this.lecturesState.splice(objWithIdIndex, 1);
            return endTime;
        }
        else {
            return -1;
        }
    }
    isLectureActive(lectureCode) {
        const objWithIdIndex = this.lecturesState.findIndex((obj) => obj.info.id === lectureCode);
        if (objWithIdIndex > -1) {
            return true;
        } else {
            return false;
        }
    }
    checkLectureUUID(meetingUUID) {
        const objWithIdIndex = this.lecturesState.findIndex((obj) => obj.info.meetingUUID === meetingUUID);
        if (objWithIdIndex > -1) {
            return this.lecturesState[objWithIdIndex].info.id;
        }
        else {
            return false;
        }
    }
    checkIfProfessorOwnsLecture(professorId) {
        const objWithIdIndex = this.lecturesState.findIndex((obj) => obj.info.professorId === professorId);
        if (objWithIdIndex > -1) {
            return this.lecturesState[objWithIdIndex].info.id;
        }
        else {
            return false;
        }
    }
}

module.exports = Lecture;