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
  console.log('Connection to database established successfully.')
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.lectures = require("./lecture-model")(sequelize, Sequelize);
db.button_presses = require("./button-press-model")(sequelize, Sequelize);

db.lectures.hasMany(db.button_presses, {as: "button_presses"});
db.button_presses.belongsTo(db.lectures, {
  foreignKey: "lectureId",
  as: "lecture",
});

module.exports = db;