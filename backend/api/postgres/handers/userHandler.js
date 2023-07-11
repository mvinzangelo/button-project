const user_controller = require('../controllers/user-controller')

module.exports = (io, socket, lectures) => {
    const onCreateUser = (data) => {
        user_controller.createUser(data);
    }

    const getUserRole = (data) => {
        user_controller.getUserByPk(data)
            .then((user) => {
                socket.emit('return_user_role', user.dataValues.role);
            })
            .catch((err) => {
                console.error("Failed to get user: ", err);
            });
    }

    socket.on("create_user", onCreateUser)
    socket.on("get_user_role", getUserRole)
}