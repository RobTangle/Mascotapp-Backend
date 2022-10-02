"use strict";

import { Model, UUIDV4 } from "sequelize";
import { UserAttributes } from "../src/types/userTypes";

// export interface UserAttributes {
//   id: string | undefined;
//   googleId: string | undefined;
//   displayName: string | undefined;
//   email: string | undefined;
//   name: string | undefined;
//   postalCode: string | undefined;
//   aditionalContactInfo: string | undefined;
//   thumbnail: string | undefined;
// }

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: string; // sub
    email!: string;
    name: string | undefined;
    city: string | undefined;
    contact: string | undefined;
    image: string | undefined;
    isDonator: string | undefined;
    isAdopter: number | undefined;
    gaveUpForAdoption: number | undefined;
    foundAPet: number | undefined;
    gotAPetBack: number | undefined;
    points: number | undefined;
<<<<<<< HEAD
    endpoints!: string;
=======
    linkToDonate: string | undefined;

>>>>>>> 4cc23b9d44371026c71b539fdae67ef4da05251b
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
        allowNull: true,
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
<<<<<<< HEAD
      endpoints: {
        type: DataTypes.STRING,
        allowNull: true
      }
=======
      linkToDonate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
>>>>>>> 4cc23b9d44371026c71b539fdae67ef4da05251b
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
