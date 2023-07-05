const db = require("../models");
const Button_Press = db.button_presses;
const Op = db.Sequelize.Op;

// module.exports = {
//     create: function(req, res) {
//         // Validate request
//         if (!req.body.title) {
//           res.status(400).send({
//             message: "Content can not be empty!"
//           });
//           return;
//         }
//         // Create a Tutorial
//         const button_press = {
//           user: req.body.user,
//           time: req.body.time
//         };
//         // Save Tutorial in the database
//         Button_Press.create(button_press)
//           .then(data => {
//             res.send(data);
//           })
//           .catch(err => {
//             res.status(500).send({
//               message:
//                 err.message || "Some error occurred while creating the Tutorial."
//             });
//           });
//     }
// }
exports.create = (req, res) => {
  console.log("======Button press recorded======");
    // Validate request
    if (!req.body.user) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    // Create a Tutorial
    const press_data = {
      user: req.body.user,
      time: req.body.time
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
  };