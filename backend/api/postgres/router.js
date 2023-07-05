const { Router } = require('express')
const router = Router()
const button_press_controller = require('./controllers/button-press-controller')
const lecture_controller = require('./controllers/lecture-controller')

router.post("/onbuttonpress", button_press_controller.create);
router.post("/oncreatenewlecture", lecture_controller.create);
module.exports = router;
