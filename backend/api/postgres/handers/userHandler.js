const user_controller = require('../controllers/user-controller')

module.exports = (io, socket, lectures) => {
    const onfindOrCreateUser = (data, callback) => {
        const ret = user_controller.findOrCreateUser(data);
        ret.then((user) => {
            callback(user);
        })
    }

    const onJoinedMeeting = (data) => {
        socket.join(data);
        console.log("==========JOINED ROOMS: ");
        console.log(socket.rooms);
    }

    socket.on("create_user", onfindOrCreateUser);
    socket.on("joined_meeting", onJoinedMeeting);
}