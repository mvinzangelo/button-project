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
}

module.exports = Lecture;