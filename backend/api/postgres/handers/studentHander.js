const button_press_controller = require('../controllers/button-press-controller')

module.exports = (io, socket, lectures) => {
    const onConfusionButtonPress = (data) => {
        console.log("SOCKET RESPONSE: ", data);
        button_press_controller.createButtonPress(data);
    }
    const onJoinLecturePress = (data) => {
        const { name, code } = data;
        if (lectures.isLectureActive(code)) {
            console.log(`${name} has joined lecture ${code}`);
            lectures.joinLecture(code, name);
            socket.join(code);
            console.log(socket.rooms);
        }
        else {
            console.error("Error joining lecture: not an active lecture.");
        }
    }
    const onLectureEnded = (data) => {
        console.log("left lecture: ", data);
        socket.leave(data)
    }

    socket.on("button_press", onConfusionButtonPress);
    socket.on("join_lecture", onJoinLecturePress);
    socket.on("lecture_ended", onLectureEnded);
}