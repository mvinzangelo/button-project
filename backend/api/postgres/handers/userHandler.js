const user_controller = require('../controllers/user-controller')

module.exports = (io, socket, lectures) => {
    const onfindOrCreateUser = (data, callback) => {
        const ret = user_controller.findOrCreateUser(data);
        ret.then((user) => {
            callback(user);
        })
    }

    socket.on("create_user", onfindOrCreateUser)
}