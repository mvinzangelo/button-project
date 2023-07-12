module.exports = (sequelize, Sequelize) => {
  const Button_Press = sequelize.define("button_press", {
    studentId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    time: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  });

  return Button_Press;
};
