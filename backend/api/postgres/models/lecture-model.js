module.exports = (sequelize, Sequelize) => {
  const Lecture = sequelize.define("lecture", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
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