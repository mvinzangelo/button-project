const button_press_controller = require('../controllers/button-press-controller')

module.exports = (io, socket, lectures) => {
    const onConfusionButtonPress = (data) => {
        if (lectures.isLectureActive(data.lectureId)) {
            console.log("SOCKET RESPONSE: ", data);
            button_press_controller.createButtonPress(data);
        }
        else {
            console.error("Error creating button press: lecutre is not active");
        }
    }
    const onJoinLecturePress = (data) => {
        const { id, code } = data;
        if (lectures.isLectureActive(code)) {
            console.log(`${id} has joined lecture ${code}`);
            lectures.joinLecture(code, id);
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