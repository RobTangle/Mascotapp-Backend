"use strict";

import { UUIDV4, Model } from "sequelize";
import { IAdminAction } from "../src/types/adminActionTypes";
module.exports = (sequelize: any, DataTypes: any) => {
  class Action extends Model<IAdminAction> implements IAdminAction {
    id?: number;
    admin_id!: string;
    route!: string;
    action!: string;
    action_status!: number;
    error_msg?: string;
    action_msg?: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  Action.init(
    {
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
    },
    {
      sequelize,
      modelName: "Action",
    }
  );
  return Action;
};
