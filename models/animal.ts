"use strict";
import { Model, UUIDV4 } from "sequelize";
import {
  Ages,
  Genders,
  Pet,
  postStatus,
  Species,
  Status,
  VaccinationStatus,
} from "../src/types/petTypes";

module.exports = (sequelize: any, DataTypes: { STRING: any }) => {
  class Animal extends Model<Pet> implements Pet {
    id: string | undefined; //! le damos la opción al cliente de setear el id como el string que quiera. Si no ingresa nada, se genera un id UUIDV4 por default
    name: string | undefined; //! acá pueden enviar un string >= 1 && <= 50 chars; || null || undefined que sería no enviar la propiedad name. Muy similar en todas las string | undefined. Dependiendo del largo del string nada más.
    specie!: Species; //! OBLIGATORIO
    race: string | undefined;
    city: string | undefined;
    age: Ages | undefined;
    gender: Genders | undefined;
    status!: Status; //! OBLIGATORIO
    vaccinationSchemeStatus: VaccinationStatus | undefined;
    image: string | undefined;
    comments: string | undefined;
    withNewOwner: undefined | true;
    backWithItsOwner: undefined | true;
    postStatus: undefined | postStatus;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Animal.belongsTo(models.User);
    }
  }
  Animal.init(
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: UUIDV4,
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
    },
    {
      sequelize,
      modelName: "Animal",
    }
  );
  return Animal;
};
