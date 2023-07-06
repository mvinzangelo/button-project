const button_press_controller = require('../controllers/button-press-controller')

module.exports = (io, socket) => {
    const onConfusionButtonPress = (data) => {
        console.log("SOCKET RESPONSE: ", data);
        button_press_controller.createButtonPress(data);
    }

    socket.on("button_press", onConfusionButtonPress);
}