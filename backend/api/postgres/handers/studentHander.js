const button_press_controller = require('../controllers/button-press-controller')
const user_controller = require('../controllers/user-controller')

module.exports = (io, socket, lectures) => {
    const onConfusionButtonPress = (data) => {
        // TODO: Check if the lecture is active and the user is in the lecture
        if (lectures.isLectureActive(data.lectureId)) {
            console.log("SOCKET RESPONSE: ", data);
            button_press_controller.createButtonPress(data);
        }
        else {
            console.error("Error creating button press: lecutre is not active");
        }
    }
    const onJoinLecturePress = (data) => {
        const { studentId, code } = data;
        // TODO: Check if the user is already in a lecture
        if (lectures.isLectureActive(code)) {
            console.log(`${studentId} has joined lecture ${code}`);
            lectures.joinLecture(code, studentId);
            socket.join(code);
            user_controller.addLectureId(studentId, code);
            console.log(socket.rooms);
        }
        else {
            console.error("Error joining lecture: not an active lecture.");
        }
    }
    const onLeaveLecturePress = async (data) => {
        const currentUser = await user_controller.getUserByPk(data);
        user_controller.removeLectureId(data);
        console.log(`${data} has left lefture ${currentUser.dataValues.lectureId}`);
        const foo = await socket.leave(currentUser.dataValues.lectureId);
        console.log(socket.rooms);
    }
    const onLectureEnded = (data) => {
        console.log("left lecture: ", data);
        user_controller.removeAllStudentsFromLecture(data);
        socket.leave(data)
    }

    socket.on("button_press", onConfusionButtonPress);
    socket.on("join_lecture", onJoinLecturePress);
    socket.on("lecture_ended", onLectureEnded);
    socket.on("leave_lecture", onLeaveLecturePress);
}