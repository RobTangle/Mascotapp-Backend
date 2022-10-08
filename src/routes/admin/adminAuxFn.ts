import db from "../../../models";
import { IUserAttributes } from "../../types/userTypes";

// -------- FUNCIONES AUXILIARES : ---------

// GET ALL REVIEWS TO USER by id
export async function getAllReviewsToUser(id: any) {
  try {
    let allReviewsToUser = await db.Review.findAll({
      where: {
        UserId: id,
      },
    });
    console.log(`reviews al User encontradas: ${allReviewsToUser.length}`);
    return allReviewsToUser;
  } catch (error) {
    console.log(`Error en function getAllReviewsToUser en /admin/`);
    throw new Error(`Error al buscar las reviews que el usuario recibió.`);
  }
}

// GET POSTS OF USER by id
export async function getPostsOfUser(id: any) {
  console.log(`En getPostsOfUser...`);
  try {
    console.log(`id ingresado como argumento: ${id}`);
    let postsOfUser = await db.Animal.findAll({
      where: {
        UserId: id,
      },
    });
    console.log(
      `Encontrados ${postsOfUser?.length} posts con el id ingresado.`
    );
    return postsOfUser;
  } catch (error: any) {
    console.log(`Error en getPostsOfUser: ${error.message}`);
    throw new Error(`${error.message}`);
  }
}

// AUX FN: CHECK IF USER IS ADMIN OR SUPER ADMIN
export async function checkIfJWTisAdminOrSuperAdmin(
  jwtId: string
): Promise<boolean> {
  console.log(`Chequeando si el user id "${jwtId}" es admin o super admin.`);
  try {
    const userInDB: IUserAttributes = await db.User.findByPk(jwtId);
    if (!userInDB) {
      throw new Error(`El usuario con id ${jwtId} no existe en la Data Base.`);
    }
    if (userInDB.isAdmin === true || userInDB.isSuperAdmin === true) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    throw new Error(
      `Error en function checkIfJWTisAdminOrSuperAdmin. ${error.message}`
    );
  }
}

// AUX FN: CHECK IF USER IS SUPER ADMIN
export async function checkIfJWTisSuperAdmin(jwtId: string): Promise<boolean> {
  console.log(`Chequeando si user id ${jwtId} es SUPER ADMIN`);
  try {
    const userInDB: IUserAttributes = await db.User.findByPk(jwtId);
    if (userInDB.isSuperAdmin === true) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.log(`Error en function checkIfJWTisSuperAdmin`);
    throw new Error(
      `Error en function checkIfJWTisSuperAdmin. ${error.message}`
    );
  }
}

// AUX FN: CHECK IF LOGGED USER IS ADMIN
export async function checkIfJWTisAdmin(jwtId: string): Promise<boolean> {
  console.log(`Chequeando si el sub del JWT es un Admin`);
  try {
    let userAsAdmin = await db.User.findByPk(jwtId);
    if (userAsAdmin.isAdmin === true) {
      console.log(`isAdmin === true`);
      return true;
    } else {
      console.log(`isAdmin !== true. El id ${jwtId} NO ES ADMIN`);
      return false;
    }
  } catch (error) {
    throw new Error("Error al chequear si el JWT sub es un admin");
  }
}
