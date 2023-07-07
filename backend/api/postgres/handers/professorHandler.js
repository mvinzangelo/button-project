const lecture_controller = require('../controllers/lecture-controller');

module.exports = (io, socket, lectures) => {
    const onCreatenewLecture = (data) => {
        console.log("SOCKET RESPONSE: ", data);
        lecture_controller.createLecture(data).then((ret) => {
            socket.emit('return_lecture_id', ret.dataValues.id);
            lectures.addLecture(ret.dataValues);
            console.log("------------ state------------\n", lectures.lecturesState);
        });
    }

    socket.on("create_new_lecture", onCreatenewLecture);
}