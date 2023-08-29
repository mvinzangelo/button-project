const button_press_controller = require('../controllers/button-press-controller')
const user_controller = require('../controllers/user-controller')

module.exports = (io, socket, lectures) => {
    const onConfusionButtonPress = (data, callback) => {
        // TODO: Check if the lecture is active and the user is in the lecture
        if (lectures.isLectureActive(data.lectureId)) {
            console.log("SOCKET RESPONSE: ", data);
            data.time = lectures.getTime(data.lectureId);
            button_press_controller.createButtonPress(data)
                .then(async (ret) => {
                    // utilizing duck-typing
                    if (ret && ret.stack && ret.message) {
                        callback(false);
                    }
                    else {
                        callback(true);
                    }
                })
        }
        else {
            console.error("Error creating button press: lecutre is not active");
        }
    }
    const onJoinLecture = (data) => {
        const { studentId, code } = data;
        // TODO: Check if the user is already in a lecture
        if (lectures.isLectureActive(code)) {
            console.log(`${studentId} has joined lecture ${code}`);
            lectures.joinLecture(code, studentId);
            user_controller.addLectureId(studentId, code);
        }
        else {
            console.error("Error joining lecture: not an active lecture.");
        }
    }
    const onLeaveLecturePress = async (data) => {
        const currentUser = await user_controller.getUserByPk(data);
        console.log(`${data} has left lefture ${currentUser.dataValues.lectureId}`);
        user_controller.removeLectureId(data);
        const foo = await socket.leave(currentUser.dataValues.lectureId);
    }
    const onLectureEnded = (data) => {
        console.log("left lecture: ", data);
        user_controller.removeAllStudentsFromLecture(data);
        socket.leave(data)
    }

    const onCheckExistingLecture = (data, callback) => {
        const { studentId, meetingUUID } = data;
        const lectureId = lectures.checkLectureUUID(meetingUUID);
        if (lectureId) {
            // join lecture
            console.log(`${studentId} has joined lecture ${lectureId}`);
            lectures.joinLecture(lectureId, studentId);
            user_controller.addLectureId(studentId, lectureId);
            console.log(socket.rooms);
            // use callback to return true
            callback(true)
            return 0;
        }
        else {
            // use callback to return false
            callback(false)
            return 1;
        }
    }

    socket.on("button_press", onConfusionButtonPress);
    socket.on("join_lecture", onJoinLecture);
    socket.on("lecture_ended", onLectureEnded);
    socket.on("leave_lecture", onLeaveLecturePress);
    socket.on("check_existing_lecture", onCheckExistingLecture);
}