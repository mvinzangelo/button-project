module.exports = (sequelize, Sequelize) => {
  const Lecture = sequelize.define("lecture", {
      instructor: {
          type: Sequelize.STRING,
          allowNull: false
      }
  });

  return Lecture;
};