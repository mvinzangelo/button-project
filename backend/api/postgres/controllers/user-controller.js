const db = require("../models");
const User = db.users;

module.exports = {
    checkUser: function (id) {
        return User.findOne({ where: { id }, attributes: ['id'] })
            .then(token => token !== null)
            .then(idExists => idExists);
    },
    createUser: function (user) {
        return User.create({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            displayName: user.display_name,
            email: user.email
        })
            .then((data => {
                console.log(data);
                return data;
            }))
            .catch((err) => {
                console.error("Error while creating user: ", err);
                return err;
            });
    }
}