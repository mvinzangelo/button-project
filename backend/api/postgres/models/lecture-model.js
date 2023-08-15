module.exports = (sequelize, Sequelize) => {
  const Lecture = sequelize.define("lecture", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    professorId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    meetingUUID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  });

  return Lecture;
};