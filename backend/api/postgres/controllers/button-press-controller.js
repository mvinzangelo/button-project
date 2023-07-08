const db = require("../models");
const Button_Press = db.button_presses;
const Lecture = db.lectures;
const Op = db.Sequelize.Op;

module.exports = {
  createButtonPress: function (data) {
    return Button_Press.create({
      studentId: data.studentId,
      lectureId: data.lectureId,
    })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.log("Error while creating button-press: ", err);
        return err;
      });
  },

  create: function (req, res) {
    console.log("======Button press recorded======");
    // Validate request
    if (!req.body.studentId) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    // Create a Tutorial
    const press_data = {
      studentId: req.body.studentId,
      lectureId: req.body.lectureId,
    };
    // Save Tutorial in the database
    Button_Press.create(press_data)
      .then(data => {
        console.log(data);
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Button Press."
        });
      });
  }
}