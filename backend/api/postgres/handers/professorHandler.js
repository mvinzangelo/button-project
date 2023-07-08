const lecture_controller = require('../controllers/lecture-controller');

module.exports = (io, socket, lectures) => {
    const onCreateNewLecture = (data) => {
        console.log("SOCKET RESPONSE: ", data);
        lecture_controller.createLecture(data)
            .then((ret) => {
                socket.emit('return_lecture_id', ret.dataValues.id);
                lectures.addLecture(ret.dataValues);
                console.log("------------ state------------\n", lectures.lecturesState);
            });
    }

    const onEndCurrentLecture = (data) => {
        lecture_controller.setLectureInactive(data).then((ret) => {
            // TODO: update the database when the lecture ends
            socket.emit('return_lecture_id', 'n/a');
            socket.to(data).emit("lecture_ended", data);
            lectures.removeLecture(data);
            console.log("------------ state------------\n", lectures.lecturesState);
        });
    }

    socket.on("create_new_lecture", onCreateNewLecture);
    socket.on("end_current_lecture", onEndCurrentLecture);
}