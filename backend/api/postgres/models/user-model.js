module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        displayName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        inLecture: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        role: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "student"
        },
    });

    return User;
};
