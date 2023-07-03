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

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;