const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Calibration_10 = sequelize.define('Calibration_10', {
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    firstAccuracy: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    finalAccuracy: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    choiceWithoutAI: {
        type: DataTypes.JSON,
        allowNull: false
    },
    choiceWithAI: {
        type: DataTypes.JSON,
        allowNull: false
    },
    confidencesWithoutAI: {
        type: DataTypes.JSON,
        allowNull: false
    },
    confidencesWithAI: {
        type: DataTypes.JSON,
        allowNull: false
    },
    elapsedTime: {
        type: DataTypes.INTEGER, // 假设你存储的是整数秒
        allowNull: true // 可以为空，因为可能不是每个记录都有这个值
    },
    bonusReceived: {
        type: DataTypes.BOOLEAN,
        allowNull: true // 可以为空，因为可能不是每个记录都有这个值
    }
});

module.exports = Calibration_10;
