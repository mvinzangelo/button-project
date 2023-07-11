const user_controller = require('../controllers/user-controller')

module.exports = (io, socket, lectures) => {
    const onfindOrCreateUser = (data, callback) => {
        const ret = user_controller.findOrCreateUser(data);
        ret.then((user) => {
            callback(user);
        })
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