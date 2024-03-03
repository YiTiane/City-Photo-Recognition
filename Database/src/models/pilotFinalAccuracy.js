const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const PilotFinalAccuracy = sequelize.define('PilotFinalAccuracy', {
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    finalAccuracy: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = PilotFinalAccuracy;

