const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const PilotImageAccuracy = sequelize.define('PilotImageAccuracy', {
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    imageAccuracies: {
        type: DataTypes.JSON,
        allowNull: false
    }
});

module.exports = PilotImageAccuracy;
