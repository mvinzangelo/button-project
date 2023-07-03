'use strict'

require('./config')

const http = require('http')
const express = require('express')
const morgan = require('morgan')
const { Sequelize, DataTypes } = require("sequelize");

const user = process.env.POSTGRES_USER;
const host = process.env.POSTGRES_HOST;
const database = process.env.POSTGRES_DATABASE;
const password = process.env.POSTGRES_PASSWORD;
const port = process.env.POSTGRES_PORT;

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'postgres',
  logging: false
})

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.')
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

const Button_Press = sequelize.define("button_presses", {
    user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
})

// * Create record
// sequelize.sync().then(() => {
//     console.log('Button_press table created successfully!');
//     Button_Press.create({
//       user: "FAKE USER",
//       time: "2021-12-12"
//     }).then(res => {
//       console.log(res)
//     }).catch((error) => {
//       console.error('Failed to create a new record : ', error);
//     })
//  }).catch((error) => {
//     console.error('Unable to create table : ', error);
//  });

// * Retrieve data
// sequelize.sync().then(() => {
//   Button_Press.findAll().then(res => {
//     console.log(res)
//     }).catch((error) => {
//     console.error('Failed to retrieve data : ', error);
//     }); 
//  }).catch((error) => {
//     console.error('Unable to create table : ', error);
//  });

const middleware = require('./middleware')

const zoomAppRouter = require('./api/zoomapp/router')
const zoomRouter = require('./api/zoom/router')
const thirdPartyOAuthRouter = require('./api/thirdpartyauth/router')
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
http.createServer(app).listen(process.env.PORT, () => {
  console.log('Zoom App is listening on port', process.env.PORT)
})
