"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Animal extends sequelize_1.Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Animal.belongsTo(models.User);
        }
    }
    Animal.init({
        id: {
            type: DataTypes.STRING,
            defaultValue: sequelize_1.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "Sin nombre",
            validate: {
                len: [1, 50],
            },
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        specie: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        race: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        age: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        vaccinationSchemeStatus: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING(3000),
            allowNull: true,
        },
        comments: {
            type: DataTypes.STRING(3000),
            allowNull: true,
        },
        backWithItsOwner: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        withNewOwner: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        postStatus: {
            type: DataTypes.STRING,
            defaultValue: "activo",
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: "Animal",
    });
    return Animal;
};
