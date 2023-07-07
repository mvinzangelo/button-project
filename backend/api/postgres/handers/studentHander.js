const button_press_controller = require('../controllers/button-press-controller')

module.exports = (io, socket, lectures) => {
    const onConfusionButtonPress = (data) => {
        console.log("SOCKET RESPONSE: ", data);
        button_press_controller.createButtonPress(data);
    }
    const onJoinLecturePress = (data) => {
        const { name, code } = data;
        console.log(`${name} has joined lecture ${code}`);
        lectures.joinLecture(code, name);
    }

    socket.on("button_press", onConfusionButtonPress);
    socket.on("join_lecture", onJoinLecturePress);
}