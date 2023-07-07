module.exports = (sequelize, Sequelize) => {
  const Lecture = sequelize.define("lecture", {
    instructor: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isOpen: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  });

  return Lecture;
};