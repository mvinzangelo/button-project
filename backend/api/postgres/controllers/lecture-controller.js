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
    create: function (req, res) {
        console.log("======Create new lecture recorded======");
        if (!req.body.instructor) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }
        // Create a Tutorial
        const lecture_data = {
            instructor: req.body.instructor,
        };
        Lecture.create(lecture_data)
            .then(data => {
                console.log(data);
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Lecture."
                });
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
