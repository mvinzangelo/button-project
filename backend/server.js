'use strict'

require('./config')

const db = require("./api/postgres/models")
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const { Server } = require("socket.io");
const Lecture = require("./util/lecture")

const middleware = require('./middleware')

// routers
const zoomAppRouter = require('./api/zoomapp/router')
const zoomRouter = require('./api/zoom/router')
const thirdPartyOAuthRouter = require('./api/thirdpartyauth/router')
const { env } = require('process')

// Create app
const app = express()

// Set view engine (for system browser error pages)
app.set('view engine', 'pug')

// Set static file directory (for system browser error pages)
app.use('/', express.static('public'))

// Set universal middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(middleware.session)
app.use(middleware.setResponseHeaders)
app.use(cors());

// Zoom App routes
app.use('/api/zoomapp', zoomAppRouter)
if (
  process.env.AUTH0_CLIENT_ID &&
  process.env.AUTH0_CLIENT_SECRET &&
  process.env.AUTH0_ISSUER_BASE_URL
) {
  app.use('/api/auth0', thirdPartyOAuthRouter)
} else {
  console.log('Please add Auth0 env variables to enable the /auth0 route')
}

app.use('/zoom', zoomRouter)

// deauthorizaiton endpoint
app.post('/api/zoomapp/deauth', (req, res, next) => {
  if (req.header.authorization === process.env.VERIFICATION_TOKEN) {
    console.log("User deauthorized");
  }
  else {
    const error = new Error('Unauthorized request')
    error.status = 401
    next(error)
  }
});

// business endpoints
app.get("/terms-of-use", (req, res) => {
  res.sendFile(__dirname + "/docs/terms-of-use.html");
})
app.get("/privacy-policy", (req, res) => {
  res.sendFile(__dirname + "/docs/privacy-policy.html");
})
app.get("/support", (req, res) => {
  res.sendFile(__dirname + "/docs/support.html");
})
app.get("/documentation", (req, res) => {
  res.sendFile(__dirname + "/docs/documentation.html");
})

// validation
const fs = require('fs');
const content = '628adf0a608e430cb1b9c9b34b2e8cb2';
try {
  fs.writeFileSync('./zoomverify/verifyzoom.html', content);
  // file written successfully
} catch (err) {
  console.error(err);
}

app.get('/hello', (req, res) => {
  res.send('THEK1NG0FGAM3S')
})

// Handle 404
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// Handle errors (system browser only)
app.use((error, req, res) => {
  res.status(error.status || 500)
  res.render('error', {
    title: 'Error',
    message: error.message,
    stack: error.stack,
  })
})

// Start express server
const server = http.createServer(app).listen(process.env.PORT, () => {
  console.log('Zoom App is listening on port', process.env.PORT)
});

// initialize socket.io
const io = new Server(server);
const lectureStore = new Lecture();

const studentHandlers = require("./api/postgres/handers/studentHander");
const professorHanders = require("./api/postgres/handers/professorHandler");
const userHandlers = require("./api/postgres/handers/userHandler");

io.on('connection', (socket) => {
  console.log(`SOCKET RESPONSE: user connected ${socket.id}`);
  // register handers
  studentHandlers(io, socket, lectureStore);
  professorHanders(io, socket, lectureStore);
  userHandlers(io, socket, lectureStore);
});

// Create connection to db
// ! {force: true} for development purposes only
db.sequelize.sync({ alter: true }).then(async () => {
  console.log("Sync'd successfully.");
  // ! TEST DATA
  const lecture_controller = require("./api/postgres/controllers/lecture-controller");
  const ret = await lecture_controller.createLecture({ professorId: 'test' });
  lectureStore.addLecture(ret.dataValues);
}).catch((error) => {
  console.error("Unable to sync : ", error);
});