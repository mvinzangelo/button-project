const lecture_controller = require('../controllers/lecture-controller');
const button_prress_controller = require('../controllers/button-press-controller');
const { button_presses } = require('../models');

module.exports = (io, socket, lectures) => {
    const onCreateNewLecture = (data, callback) => {
        console.log("SOCKET RESPONSE: ", data);
        lecture_controller.createLecture(data)
            .then((ret) => {
                // TODO: update professor with the lectureId of created lecture
                lectures.addLecture(ret.dataValues);
                console.log("------------lectureStore state------------\n", lectures.lecturesState);
                callback(ret.dataValues.id);
            });
    }

    const onEndCurrentLecture = (data, callback) => {
        lecture_controller.setLectureInactive(data)
            .then(async (ret) => {
                // TODO: update the database when the lecture ends
                socket.to(data).emit("lecture_ended", data);
                const endTime = lectures.removeLecture(data);
                // get all button presses associated with lecture
                const buttonPresses = await button_prress_controller.findAllByLectureId(data);
                // return all data in callback
                callback(ret, buttonPresses, endTime);
                console.log("------------lectureStore state------------\n", lectures.lecturesState);
            });
    }

    socket.on("create_new_lecture", onCreateNewLecture);
    socket.on("end_current_lecture", onEndCurrentLecture);
}