const db = require("..");
const Button_Press = db.Button_Press;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
}

// create button_press

const button_press = {
    user: req.body.user,
    time: req.body.time
};

// save button_press in the database
Button_Press.create(button_press)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occured while creating Button_Press"
        });
    });
