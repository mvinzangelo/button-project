const db = require("../models");
const User = db.users;

module.exports = {
    findOrCreateUser: function (user) {
        return User.findOrCreate({
            where: { id: user.id },
            defaults: {
                firstName: user.first_name,
                lastName: user.last_name,
                displayName: user.display_name,
                email: user.email
            }
        })
            .then((data => {
                console.log(data);
                return data;
            }))
            .catch((err) => {
                console.error("Error while creating user: ", err);
                return err;
            });
    },
    addLectureId: function (user, lectureId) {
        return User.update({
            lectureId: lectureId,
            inLecture: true
        }, {
            where: { id: user }
        })
            .then((data) => {
                console.log(data);
                return data;
            })
            .catch((err) => {
                console.error("Error while updating user: ", err);
                return err;
            });
    },
    removeLectureId: function (user) {
        return User.update({
            lectureId: null,
            inLecture: false
        }, {
            where: { id: user }
        })
            .then((data) => {
                console.log(data);
                return data;
            })
            .catch((err) => {
                console.error("Error while updating user: ", err);
                return err;
            });
    },
    removeAllStudentsFromLecture: async function (lectureId) {
        // TODO: FIXME (NOT FINISHED)
        const users = User.findAll({
            lectureId: lectureId
        });
        console.log(users.toJSON());
    },
    getUserByPk: function (user) {
        return User.findByPk(user)
            .then((data) => {
                console.log(data.toJSON());
                return data;
            })
            .catch((err) => {
                console.error("Error finding user by pk: ", err);
                return err;
            });
    }
}