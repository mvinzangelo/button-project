module.exports = (sequelize, Sequelize) => {
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

  return Button_Press;
};
