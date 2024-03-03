const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Experiment = sequelize.define('Experiment', {
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
    }
});

module.exports = Experiment;
