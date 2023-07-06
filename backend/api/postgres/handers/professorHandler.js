const lecture_controller = require('../controllers/lecture-controller');

module.exports = (io, socket) => {
    const onCreatenewLecture = (data) => {
        console.log("SOCKET RESPONSE: ", data);
        lecture_controller.createLecture(data);
    }

    socket.on("create_new_lecture", onCreatenewLecture);
}