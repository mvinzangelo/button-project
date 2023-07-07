const { UUIDV4 } = require("sequelize");

const ROOM_MAX_CAPACITY = 300;

class Lecture {
    constructor() {
        this.lecturesState = [];
    }

    addLecture(lecture) {
        this.lecturesState.push(lecture)
    }
}

module.exports = Lecture;