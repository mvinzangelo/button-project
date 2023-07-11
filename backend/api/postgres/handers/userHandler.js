const user_controller = require('../controllers/user-controller')

module.exports = (io, socket, lectures) => {
    const onfindOrCreateUser = (data) => {
        user_controller.findOrCreateUser(data);
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

    socket.on("create_user", onfindOrCreateUser)
    socket.on("get_user_role", getUserRole)
}