const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const PilotImageConfidence = sequelize.define('PilotImageConfidence', {
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    imageConfidences: {
        type: DataTypes.JSON,
        allowNull: false
    }
});

module.exports = PilotImageConfidence;
