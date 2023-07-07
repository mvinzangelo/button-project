const { UUIDV4 } = require("sequelize");

const ROOM_MAX_CAPACITY = 300;

class Lecture {
    constructor() {
        this.lecturesState = [];
    }

    addLecture(lecture) {
        this.lecturesState.push({
            info: lecture,
            students: []
        });
    }
    joinLecture(lectureCode, student) {
        for (let i = 0; i < this.lecturesState.length; i++) {
            if (this.lecturesState[i].info.id === lectureCode) {
                this.lecturesState[i].students.push(student);
            }
        }
    }
    removeLecture(lectureCode) {
        const objWithIdIndex = this.lecturesState.findIndex((obj) => obj.info.id === lectureCode);
        if (objWithIdIndex > -1) {
            this.lecturesState.splice(objWithIdIndex, 1);
        }
        return this.lecturesState;
    }
    isLectureActive(lectureCode) {
        const objWithIdIndex = this.lecturesState.findIndex((obj) => obj.info.id === lectureCode);
        if (objWithIdIndex > -1) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Lecture;