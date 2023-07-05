const { Router } = require('express')
const router = Router()
const button_press_controller = require('./controllers/button-press-controller')

router.post( "/onbuttonpress", button_press_controller.create);
module.exports = router;
