"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Action extends sequelize_1.Model {
    }
    Action.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        admin_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        route: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        error_msg: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        action_msg: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: "Action",
    });
    return Action;
};
