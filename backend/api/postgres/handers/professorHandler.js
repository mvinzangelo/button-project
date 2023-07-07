const lecture_controller = require('../controllers/lecture-controller');

module.exports = (io, socket, lectures) => {
    const onCreatenewLecture = (data) => {
        console.log("SOCKET RESPONSE: ", data);
        lecture_controller.createLecture(data).then((ret) => {
            console.log("RETURNED DATA", ret);
            socket.emit('return_lecture_id', ret.dataValues.id);
        });
    }

    socket.on("create_new_lecture", onCreatenewLecture);
}