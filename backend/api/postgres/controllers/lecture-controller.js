const db = require("../models");
const Button_Press = db.button_presses;
const Lecture = db.lectures;
const Op = db.Sequelize.Op;

module.exports = {
    createLecture: function (lecture) {
        return Lecture.create({
            instructor: lecture.instructor
        })
            .then((data) => {
                console.log(data);
                return data
            })
            .catch((err) => {
                console.log("Error while creating lecture: ", err);
            });
    },
    findAll: function () {
        return Lecture.findAll({
            include: [{ model: db.button_presses, as: "button_presses" }],
        }).then((data) => {
            console.log("All lectures", JSON.stringify(data, null, 2));
            return data;
        })
    }
};
