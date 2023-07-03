module.exports = (sequelize, Sequelize) => {
  const Button_Press = sequelize.define("button_press", {
      user: {
          type: Sequelize.STRING,
          allowNull: false
      },
      time: {
          type: Sequelize.DATEONLY,
          allowNull: false
      }
  });

  return Button_Press;
};
