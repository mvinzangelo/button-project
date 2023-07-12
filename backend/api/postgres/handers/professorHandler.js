const lecture_controller = require('../controllers/lecture-controller');
const button_prress_controller = require('../controllers/button-press-controller');
const { button_presses } = require('../models');

module.exports = (io, socket, lectures) => {
    const onCreateNewLecture = (data) => {
        console.log("SOCKET RESPONSE: ", data);
        lecture_controller.createLecture(data)
            .then((ret) => {
                // TODO: update professor with the lectureId of created lecture
                socket.emit('return_lecture_id', ret.dataValues.id);
                lectures.addLecture(ret.dataValues);
                console.log("------------lectureStore state------------\n", lectures.lecturesState);
            });
    }

    const onEndCurrentLecture = (data, callback) => {
        lecture_controller.setLectureInactive(data)
            .then(async (ret) => {
                // TODO: update the database when the lecture ends
                socket.to(data).emit("lecture_ended", data);
                socket.emit('return_lecture_id', 'n/a');
                lectures.removeLecture(data);
                // get all button presses associated with lecture
                const button_presses = await button_prress_controller.findAllByLectureId(data);
                // return all data in callback
                callback(button_presses);
                console.log("------------lectureStore state------------\n", lectures.lecturesState);
            });
    }

    socket.on("create_new_lecture", onCreateNewLecture);
    socket.on("end_current_lecture", onEndCurrentLecture);
}