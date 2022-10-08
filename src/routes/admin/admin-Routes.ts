import { Router } from "express";
import dotenv from "dotenv";
import { Op } from "sequelize";
import db from "../../../models";
import jwtCheck from "../../../config/jwtMiddleware";
import { IAdminAction } from "../../types/adminActionTypes";
import { IUserAttributes } from "../../types/userTypes";
import { transactionStatus } from "../../types/transactionTypes";
import { getAllPets } from "../pet/petAuxFn";
import { getAllUsers } from "../user/userAuxFn";
import { getAllReviewsToUser, getPostsOfUser } from "./adminAuxFn";

dotenv.config();

const router = Router();

//---------------------- RUTAS: -----------------------------

router.post("/deleteUser", jwtCheck, async (req: any, res) => {
  console.log(`Entré a /admin/deleteUser`);

  try {
    let idFromReq: string = req.body.id;
    let emailFromReq: string = req.body.email;
    let passwordFromReq: string = req.body.password;
    const reqUserId = req.auth.sub;
    const newAdminAction: IAdminAction = {
      admin_id: req.auth.sub,
      route: `/admin/deleteUser`,
      action: `delete User with id "${idFromReq}" and email "${emailFromReq}".`,
      action_status: 0,
    };
    const reqUserIsAdmin = await checkIfJWTisAdmin(reqUserId);

    if (!reqUserIsAdmin) {
      console.log(
        `El usuario con id "${reqUserId}" que realiza la request no es un admin.`
      );
      return res.status(403).send({
        error: `El usuario con id "${reqUserId}" que realiza la request no es un admin.`,
      });
    }
    if (passwordFromReq != process.env.ADMIN_PASSWORD) {
      console.log(
        `La password de administrador "${passwordFromReq}" no es válida`
      );
      return res
        .status(403)
        .send(`La password de administrador "${passwordFromReq}" no es válida`);
    }
    let userToBeDeleted = await db.User.findOne({
      where: {
        [Op.and]: [{ id: idFromReq }, { email: emailFromReq }],
      },
    });
    if (!userToBeDeleted) {
      console.log(`Usuario no encontrado con ese email y Id.`);
      throw new Error(
        `Usuario no encontrado con email "${emailFromReq}" y id "${idFromReq}.`
      );
    } else {
      await userToBeDeleted.destroy();
      console.log(`Usuario destruido suavemente.`);
      await db.Action.create({ ...newAdminAction, action_status: 200 });
      return res
        .status(200)
        .send(
          `Usuario con email "${emailFromReq}" y id "${idFromReq}" eliminado.`
        );
    }
  } catch (error: any) {
    console.log(`Error en /admin/deleteUser. ${error.message}`);
    // await db.Action.create({
    //   admin_id: req.auth?.sub,
    //   route: `/admin/deleteUser`,
    //   action: `delete User with id "${req.body.id}" and email "${req.body.email}"`,
    //   action_status: 404,
    //   error_msg: `${error.message}`,
    // });
    return res.status(404).send(error.message);
  }
});

// CLEAN POSTS OF USER ID
router.post("/cleanPostsOfUserId", jwtCheck, async (req: any, res) => {
  console.log(`Entré a la ruta /admin/cleanPostsOfUserId`);
  try {
    const passwordFromReq = req.body.password;
    const userId = req.body.userId;
    const reqUserId = req.auth.sub;
    const newAdminAction: IAdminAction = {
      admin_id: reqUserId,
      route: `/admin/cleanPostsOfUserId`,
      action: `Delete posts of User with id "${req.body.userId}".`,
      action_status: 0,
    };
    const reqUserIsAdmin = await checkIfJWTisAdmin(reqUserId);
    if (!reqUserIsAdmin) {
      console.log(
        `El usuario con id "${reqUserId}" que realiza la request no es un admin.`
      );
      return res.status(403).send({
        error: `El usuario con id "${reqUserId}" que realiza la request no es un admin.`,
      });
    }
    if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
      console.log(
        `La password de administrador ${passwordFromReq} no es válida`
      );
      return res
        .status(403)
        .send(`La password de administrador "${passwordFromReq}" no es válida`);
    }
    if (!req.body.userId) {
      throw new Error(
        `Debe ingresar un userId. Usted envió "${req.body.userId}"`
      );
    }
    console.log(`req.body.userId = ${req.body.userId}`);

    let postsOfUser = await getPostsOfUser(userId);
    if (!postsOfUser) {
      throw new Error(`No se encontraron posts del user con id ${userId}`);
    }
    console.log(`Número de posts encontrados: ${postsOfUser?.length}`);
    console.log("Iniciando soft destruction de posteos...");
    let numberOfPostsDestroyed = 0;
    for (const post of postsOfUser) {
      await post.destroy();
      console.log("post destruido");
      numberOfPostsDestroyed++;
    }
    await db.Action.create({
      ...newAdminAction,
      status: 200,
      action_msg: `Número de posts destruidos: ${numberOfPostsDestroyed}`,
    });
    return res
      .status(200)
      .send(`Número de posts destruidos: ${numberOfPostsDestroyed}`);
  } catch (error: any) {
    console.log(`Error en la ruta /admin/cleanPostsOfUserId. ${error.message}`);
    return res.status(404).send(error.message);
  }
});

// CLEAN REVIEWS TO USER
router.post("/cleanReviewsToUser", jwtCheck, async (req: any, res) => {
  console.log(`En ruta /admin/cleanReviewsToUser`);
  try {
    const passwordFromReq = req.body.password;
    const reqAdminId = req.auth.sub;
    const userId = req.body.userId;
    console.log(`userId recibido = ${userId}`);

    const newAdminAction: IAdminAction = {
      admin_id: reqAdminId,
      route: `/admin/cleanReviewsToUser`,
      action: `Delete Reviews of User with id "${userId}".`,
      action_status: 0,
      action_msg: "",
    };
    const reqUserIsAdmin = await checkIfJWTisAdmin(reqAdminId);
    if (!reqUserIsAdmin) {
      console.log(
        `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`
      );
      return res.status(403).send({
        error: `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`,
      });
    }
    if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send(`La password de administrador no es válida`);
    }

    let allReviewsToUser = await getAllReviewsToUser(userId);
    if (!allReviewsToUser) {
      throw new Error(`Las reviews al usuario encontradas es falso.`);
    }
    if (Array.isArray(allReviewsToUser) && allReviewsToUser.length === 0) {
      return res.status(200).send("No parecen haber reviews con ese UserId");
    }
    let reviewsErased = 0;
    console.log(
      `Empezando a borrar reviews... Reviews por borrar: ${allReviewsToUser.length}`
    );
    for (const review of allReviewsToUser) {
      await review.destroy();
      console.log("Review borrada...");
      reviewsErased++;
    }
    console.log("Cantidad de reviews borradas: " + reviewsErased);
    await db.Action.create({
      ...newAdminAction,
      action_status: 200,
      action_msg: `Cantidad de reviews soft destroyed: ${reviewsErased}`,
    });
    return res
      .status(200)
      .send(`Cantidad de reviews soft destroyed: ${reviewsErased}`);
  } catch (error: any) {
    console.log(`Error en /cleanReviewsToUser. ${error.message}`);
    return res.status(404).send(error.message);
  }
});
// DELETE PETS WITH NO UserId
router.post("/deletePetsWithNoUserId", jwtCheck, async (req: any, res) => {
  console.log(`En ruta /admin/deletePetsWithNoUserId`);
  try {
    // CHEQUEAR SI EL REQ.AUTH.SUB EXISTE EN LA DB
    let passwordFromReq = req.body.password;
    const reqAdminId = req.auth.sub;
    const reqAdminIsAdmin = await checkIfJWTisAdmin(reqAdminId);

    const newAdminAction: IAdminAction = {
      admin_id: reqAdminId,
      route: `/admin/deletePetsWithNoUserId`,
      action: `Delete Pets with no User Id.`,
      action_status: 0,
      action_msg: "",
    };

    if (!reqAdminIsAdmin) {
      console.log(
        `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`
      );
      return res.status(403).send({
        error: `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`,
      });
    }
    if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send(`La password de administrador no es válida`);
    }
    let allThePetsWithNoUser = await db.Animal.findAll({
      where: {
        UserId: {
          [Op.eq]: null,
        },
      },
    });
    console.log(
      `Cantidad de pets encontradas: ${allThePetsWithNoUser?.length}`
    );
    console.log(`Empezando a borrar mascotas con UserId === null`);
    let petsDestroyed = 0;
    for (const pet of allThePetsWithNoUser) {
      await pet.destroy();
      console.log(`Animal soft destroyed...`);
      petsDestroyed++;
    }
    await db.Action.create({
      ...newAdminAction,
      action_status: 200,
      action_msg: `Cantidad de Mascotas/Posts eliminados: ${petsDestroyed}.`,
    });
    return res
      .status(200)
      .send(`Cantidad de Mascotas/Posts eliminados: ${petsDestroyed}.`);
  } catch (error: any) {
    console.log(`Error en /admin/deletePetsWithNoUserId. ${error.message}`);
  }
});
router.post("/deletePet", jwtCheck, async (req: any, res) => {
  console.log(`En ruta /admin/deletePet`);
  try {
    const passwordFromReq = req.body.password;
    const reqAdminId = req.auth.sub;
    const { petId } = req.body;

    const newAdminAction: IAdminAction = {
      admin_id: reqAdminId,
      route: `/admin/deletePet`,
      action: `Delete Pet with Id "${petId}".`,
      action_status: 0,
      action_msg: "",
    };

    if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send(`La password de administrador no es válida`);
    }
    const reqAdminIsAdmin = await checkIfJWTisAdmin(reqAdminId);
    if (reqAdminIsAdmin !== true) {
      return res
        .status(403)
        .send(
          `No es posible realizar esta acción porque usted no es un admin.`
        );
    }

    const pet = await db.Animal.findByPk(petId);
    if (pet) {
      await pet.destroy();
      await db.Action.create({
        ...newAdminAction,
        action_status: 200,
        action_msg: `La publicación fue soft destroyed`,
      });
      return res.status(200).send("la publicación fue eliminada");
    }
    await db.Action.create({
      ...newAdminAction,
      action_status: 404,
      error_msg: `La publicación no existe`,
    });
    return res.status(404).send("la publicación no existe");
  } catch (error: any) {
    console.log(`Error en /admin/deletePets ${error.message}`);
  }
});
// AUX FN: CHECK IF LOGGED USER IS ADMIN
async function checkIfJWTisAdmin(jwtId: string): Promise<boolean> {
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
// AUX FN: CHECK IF USER IS SUPER ADMIN
async function checkIfJWTisSuperAdmin(jwtId: string): Promise<boolean> {
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
// AUX FN: CHECK IF USER IS ADMIN OR SUPER ADMIN
async function checkIfJWTisAdminOrSuperAdmin(jwtId: string): Promise<boolean> {
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
// SET isAdmin a TRUE o FALSE. Sólo la puede usar el SUPER ADMIN.
router.put("/setIsAdmin", jwtCheck, async (req: any, res) => {
  console.log(`Entré a "admin/setIsAdmin"`);
  try {
    const reqAdminId = req.auth.sub;
    const passwordFromReq = req.body.password;
    const idOfUserToSetIsAdminProp = req.body.userToAffect_id;
    const newIsAdminValue = req.body.newIsAdminValue;

    const newAdminAction: IAdminAction = {
      admin_id: reqAdminId,
      route: `/admin/setIsAdmin`,
      action: `Setear/cambiar la prop "isAdmin" del user con id "${idOfUserToSetIsAdminProp}" a "${newIsAdminValue}".`,
      action_status: 0,
      action_msg: "",
    };

    if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
      console.log(`La password ingresada "${passwordFromReq}" no es válida.`);

      return res
        .status(403)
        .send({ msg: `La password de administrador ingresada no es válida` });
    }
    const reqUserIsSuperAdmin: boolean = await checkIfJWTisSuperAdmin(
      reqAdminId
    );
    if (!reqUserIsSuperAdmin) {
      return res.status(403).send({
        error: `Se debe tener rol de Super Admin para realizar esta acción.`,
      });
    }
    const userToSetIsAdmin = await db.User.findByPk(idOfUserToSetIsAdminProp);
    if (!userToSetIsAdmin) {
      throw new Error(
        `No se encontró en la Data Base al usuario con el id ${idOfUserToSetIsAdminProp}`
      );
    }
    if (newIsAdminValue !== true && newIsAdminValue !== false) {
      throw new Error(
        `El valor de newIsAdminValue debe ser true o false (booleanos). Usted ingresó ${newIsAdminValue}, el cual no es correcto.`
      );
    }
    userToSetIsAdmin.isAdmin = newIsAdminValue;
    await userToSetIsAdmin.save();
    console.log(
      `Usuario con id ${idOfUserToSetIsAdminProp} fue seteado a isAdmin = ${newIsAdminValue}.`
    );
    await db.Action.create({
      ...newAdminAction,
      action_status: 200,
      action_msg: `Usuario con id ${idOfUserToSetIsAdminProp} fue seteado a isAdmin = ${newIsAdminValue}.`,
    });
    return res.status(200).send({
      msg: `Usuario con id ${idOfUserToSetIsAdminProp} fue seteado a isAdmin = ${newIsAdminValue}.`,
    });
  } catch (error: any) {
    console.log(`Error en ruta admin/setIsAdmin. ${error.message}`);
    return res.status(400).send({ error: `${error.message}` });
  }
});
// SET IS SUPER ADMIN. SÓLO LA PUEDE USAR UN SUPER ADMIN.
router.put("/setIsSuperAdmin", jwtCheck, async (req: any, res) => {
  console.log(`Entré a "admin/setIsSuperAdmin"`);
  try {
    const reqAdminId = req.auth.sub;
    const passwordFromReq = req.body.password;
    const idOfUserToSetIsSuperAdminProp = req.body.userToAffect_id;
    const newIsSuperAdminValue = req.body.newIsSuperAdminValue;

    const newAdminAction: IAdminAction = {
      admin_id: reqAdminId,
      route: `/admin/setIsSuperAdmin`,
      action: `Setear/cambiar la prop "isSuperAdmin" del user con id "${idOfUserToSetIsSuperAdminProp}" a "${newIsSuperAdminValue}".`,
      action_status: 0,
      action_msg: "",
    };

    if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
      console.log(`La password ingresada "${passwordFromReq}" no es válida.`);

      return res
        .status(403)
        .send({ msg: `La password de administrador ingresada no es válida` });
    }
    const reqUserIsSuperAdmin: boolean = await checkIfJWTisSuperAdmin(
      reqAdminId
    );
    if (!reqUserIsSuperAdmin) {
      return res.status(403).send({
        error: `Se debe tener rol de Super Admin para realizar esta acción.`,
      });
    }
    const userToSetIsSuperAdmin = await db.User.findByPk(
      idOfUserToSetIsSuperAdminProp
    );
    if (!userToSetIsSuperAdmin) {
      throw new Error(
        `No se encontró en la Data Base al usuario con el id ${idOfUserToSetIsSuperAdminProp}`
      );
    }
    if (newIsSuperAdminValue !== true && newIsSuperAdminValue !== false) {
      throw new Error(
        `El valor de newIsSuperAdmin debe ser true o false (booleanos). Usted ingresó ${newIsSuperAdminValue}, el cual no es correcto.`
      );
    }
    userToSetIsSuperAdmin.isSuperAdmin = newIsSuperAdminValue;
    await userToSetIsSuperAdmin.save();
    console.log(
      `Usuario con id ${idOfUserToSetIsSuperAdminProp} fue seteado a isAdmin = ${newIsSuperAdminValue}.`
    );
    await db.Action.create({
      ...newAdminAction,
      action_status: 200,
      action_msg: `Usuario con id ${idOfUserToSetIsSuperAdminProp} fue seteado a isAdmin = ${newIsSuperAdminValue}.`,
    });
    return res.status(200).send({
      msg: `Usuario con id ${idOfUserToSetIsSuperAdminProp} fue seteado a isAdmin = ${newIsSuperAdminValue}.`,
    });
  } catch (error: any) {
    console.log(`Error en ruta admin/setIsAdmin. ${error.message}`);
    return res.status(400).send({ error: `${error.message}` });
  }
});
// CHEQUEAR SI USER LOGUEADO CON JWT ES ADMIN O NO
router.post("/hasAdminPowers", jwtCheck, async (req: any, res) => {
  console.log(`Entré a "admin/hasAdminPowers".`);
  try {
    console.log(req.body);
    const jwtId: string = req.auth.sub;
    const passwordFromReq: string = req.body.password;
    if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
      console.log(`La password ${passwordFromReq} no es válida.`);
      return res.status(403).send({
        error: `La password de administrador "${passwordFromReq}" ingresada no es válida`,
        msg: false,
      });
    }
    const reqUserIsAdmin: boolean = await checkIfJWTisAdminOrSuperAdmin(jwtId);
    if (reqUserIsAdmin !== true) {
      return res.status(403).send({
        error: `Se debe tener rol de Admin para realizar esta acción.`,
        msg: false,
      });
    }
    if (reqUserIsAdmin === true) {
      return res.status(200).send({ msg: true });
    }
  } catch (error: any) {
    console.log(`Error en "admin/hasAdminPowers". ${error.message}`);
    return res.status(400).send({ error: `${error.message}`, msg: false });
  }
});
// ----   RUTAS MULTIPLICADORAS:  -----------
router.get("/createMultiplier", jwtCheck, async (req: any, res) => {
  try {
    const reqUserId = req.auth.sub;
    const reqUserIsAdmin = await checkIfJWTisAdmin(reqUserId);
    if (!reqUserIsAdmin) {
      console.log(
        `El usuario con id "${reqUserId}" que realiza la request no es un admin.`
      );
      return res.status(403).send({
        error: `El usuario con id "${reqUserId}" que realiza la request no es un admin.`,
      });
    }
    const multiplier = await db.Multiplier.findAll();
    if (multiplier.length === 0) {
      await db.Multiplier.create({ number: 1 });
      return res.send("multiplicador creado");
    }
    return res.send("el multiplicador ya existe");
  } catch (error: any) {
    console.log(`Error en /admin/changeMultiplier. ${error.message}`);
    return res.status(404).send(error.message);
  }
});
router.post("/changeMultiplier", jwtCheck, async (req: any, res) => {
  console.log(`Entré a /admin/changeMultiplier`);
  try {
    // Agregar chequeo de si existe el req.auth.sub en la DB
    const { newMultiplier } = req.body;
    let passwordFromReq = req.body.password;
    const reqAdminId = req.auth.sub;

    const newAdminAction: IAdminAction = {
      admin_id: reqAdminId,
      route: `/admin/changeMultiplier`,
      action: `Cambiar el valor del multiplicador de puntos de la tabla Multiplier a un nuevo valor: "${newMultiplier}"`,
      action_status: 0,
      action_msg: "",
    };

    const reqUserIsAdmin = await checkIfJWTisAdmin(reqAdminId);
    if (!reqUserIsAdmin) {
      console.log(
        `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`
      );
      return res.status(403).send({
        error: `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`,
      });
    }
    if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send(`La password de administrador no es válida`);
    }
    const multiplier = await db.Multiplier.findByPk(1);
    let newMultiplierToNumber: number = Number(newMultiplier);
    multiplier.number = newMultiplierToNumber;
    await multiplier.save();

    await db.Action.create({
      ...newAdminAction,
      action_status: 200,
      action_msg: `Multiplicador cambiado. Valor actual = ${multiplier.number}`,
    });

    return res
      .status(200)
      .send(`multiplicador cambiado. Valor actual = ${multiplier.number}`);
  } catch (error: any) {
    console.log(`Error en /admin/changeMultiplier. ${error.message}`);
    return res.status(404).send(error.message);
  }
});
// ------ RUTAS DEPRECADAS O YA SIN SENTIDO : ------
router.post("/mutateActiveToActivo", jwtCheck, async (req, res) => {
  console.log(`Entré a /admin/mutateActiveToActivo`);
  let password = req.body.password;
  try {
    if (password != process.env.ADMIN_PASSWORD) {
      return res.status(403).send(`La password de administrador no es válida`);
    }
    let allActiveTransactions = await db.Transaction.findAll({
      where: {
        status: "active",
      },
    });
    let numberModified = 0;
    for (const trans of allActiveTransactions) {
      trans.status = transactionStatus.Active;
      await trans.save();
      numberModified++;
      console.log(
        `Transacciones modificadas de "active" a ${transactionStatus.Active}: ${numberModified}`
      );
    }
    return res.status(200).send({ transactionsModified: `${numberModified}` });
  } catch (error: any) {
    console.log(`Error en el /admin/mutateActiveToActivo`);
    return res.status(404).send(error.message);
  }
});
router.post("/banUser", jwtCheck, async (req: any, res) => {
  console.log(`En ruta /banUser`);
  try {
    const { id } = req.body;
    let passwordFromReq = req.body.password;
    const reqAdminId = req.auth.sub;

    const newAdminAction: IAdminAction = {
      admin_id: reqAdminId,
      route: `/admin/banUser`,
      action: `Banear a usuario con id ${id}`,
      action_status: 0,
      action_msg: "",
    };

    const reqUserIsAdmin = await checkIfJWTisAdmin(reqAdminId);
    if (!reqUserIsAdmin) {
      console.log(
        `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`
      );
      return res.status(403).send({
        error: `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`,
      });
    }
    if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send(`La password de administrador no es válida`);
    }
    const user = await db.User.findByPk(id);
    if (user) {
      const ban = await db.Ban.create({ id: id, email: user.email });
      user.isBanned = "true";
      await user.save();

      console.log(`Usuario con email ${ban.email} ha sido banneado`);

      await db.Action.create({
        ...newAdminAction,
        action_status: 200,
        action_msg: `Usuario con id "${id}" e email "${ban.email}" ha sido banneado.`,
      });
      return res
        .status(200)
        .send(`Usuario con email ${ban.email} ha sido banneado.`);
    }

    await db.Action.create({
      ...newAdminAction,
      action_status: 404,
      error_msg: `El usuario con id "${id}" que se intenta banear no se encontró en la Data Base.`,
    });
    return res.status(404).send("el usuario no existe");
  } catch (error: any) {
    console.log(`Error en /admin/banUser. ${error.message}`);
    return res.status(404).send(error.message);
  }
});
//BORRAR PETS QUE TIENEN UN UserId de un User que no existe en la DB
router.delete("/purgePetsWithFalseUser", jwtCheck, async (req: any, res) => {
  console.log(`Entré a admin/purgePetsWithFalseUser`);
  try {
    const password = req.body.password;
    const reqAdminId = req.auth.sub;

    const newAdminAction: IAdminAction = {
      admin_id: reqAdminId,
      route: `/admin/purgePetsWithFalseUser`,
      action: `Purgar las Pets con un UserId de un User que no existe en la DB.`,
      action_status: 0,
      action_msg: "",
    };

    const reqUserIsAdmin = await checkIfJWTisAdmin(reqAdminId);
    if (!reqUserIsAdmin) {
      console.log(
        `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`
      );
      return res.status(403).send({
        error: `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`,
      });
    }
    if (!password) {
      throw new Error(`La password enviada por body es "${password}"`);
    }
    if (password !== process.env.ADMIN_PASSWORD) {
      console.log(`La password "${password}" es inválida`);
      return res.status(401).send(`Password inválida.`);
    }
    let allThePets = await getAllPets();
    let allTheUsers: IUserAttributes[] = await getAllUsers();
    let userIds = allTheUsers.map((user) => user.id);
    console.log(`userIds = `);
    console.log(userIds);
    let numberOfPetsPurged = 0;
    for (let i = 0; i < allThePets.length; i++) {
      if (!userIds.includes(allThePets[i].UserId)) {
        console.log(`Destruyendo Pet con id ${allThePets[i].id}`);
        await allThePets[i].destroy();
        numberOfPetsPurged++;
      }
    }
    console.log(`Cantidad de mascotas purgadas: ${numberOfPetsPurged}`);

    await db.Action.create({
      ...newAdminAction,
      action_status: 200,
      action_msg: `Cantidad de mascotas purgadas: ${numberOfPetsPurged}`,
    });

    return res
      .status(200)
      .send(`Cantidad de mascotas destruidas: ${numberOfPetsPurged}`);
  } catch (error: any) {
    console.log(`Error en admin/purgePetsWithFalseUser. ${error.message}`);
    return res.status(400).send(error.message);
  }
});

router.post("/getAdminActions", jwtCheck, async (req: any, res) => {
  console.log(`Entré a admin/getAdminActions`);
  try {
    const passwordFromReq = req.body.password;
    const reqAdminId = req.auth.sub;
    let reqAdminIsAdmin = await checkIfJWTisAdminOrSuperAdmin(reqAdminId);
    if (!reqAdminIsAdmin) {
      return res
        .status(403)
        .send({ error: "No tenés permiso para realizar esta acción." });
    }
    if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
      return res.status(403).send({ error: "Password inválida" });
    }

    const allTheAdminActions: IAdminAction[] = await db.Action.findAll();
    console.log(
      `Cantidad de Admin Actions fetcheadas de la DB: ${allTheAdminActions.length}`
    );
    return res.status(200).send(allTheAdminActions);
  } catch (error: any) {
    console.log(`Error en "admin/getAdminActions". ${error.message}`);
    return res.status(400).send({ error: error.message });
  }
});

export default router;
