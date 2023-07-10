const user_controller = require('../controllers/user-controller')

module.exports = (io, socket, lectures) => {
    const onCreateUser = (data) => {
        user_controller.createUser(data);
    }

    socket.on("create_user", onCreateUser)
}