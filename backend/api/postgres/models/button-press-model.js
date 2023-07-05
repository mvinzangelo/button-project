module.exports = (sequelize, Sequelize) => {
  const Button_Press = sequelize.define("button_press", {
      student: {
          type: Sequelize.STRING,
          allowNull: false
      }
  });

  return Button_Press;
};
