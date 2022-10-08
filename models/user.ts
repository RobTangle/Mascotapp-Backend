"use strict";

import { Model, UUIDV4 } from "sequelize";
import { IUserAttributes } from "../src/types/userTypes";

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<IUserAttributes> implements IUserAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: string; // sub
    email!: string;
    name!: string;
    city: string | undefined;
    contact: string | undefined;
    image: string | undefined;
    isDonator: string | undefined;
    isAdopter: number | undefined;
    gaveUpForAdoption: number | undefined;
    foundAPet: number | undefined;
    gotAPetBack: number | undefined;
    points: number | undefined;
    endpoints!: Text;
    linkToDonate: string | undefined;
    isBanned: string | undefined;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;

    static associate(models: any) {
      // define association here
      User.hasMany(models.Animal);
      User.hasMany(models.Review);
      User.hasMany(models.Donation);
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
        validate: {
          len: [6, 30],
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isDonator: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isAdopter: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      gaveUpForAdoption: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      foundAPet: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      gotAPetBack: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      points: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      endpoints: {
        type: DataTypes.STRING(2000),
        allowNull: true,
      },
      linkToDonate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isBanned: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      isSuperAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
