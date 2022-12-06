"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../../../models"));
const jwtMiddleware_1 = __importDefault(require("../../../config/jwtMiddleware"));
const transactionTypes_1 = require("../../types/transactionTypes");
const petAuxFn_1 = require("../pet/petAuxFn");
const userAuxFn_1 = require("../user/userAuxFn");
const adminAuxFn_1 = require("./adminAuxFn");
const GenericValidators_1 = require("../../validators/GenericValidators");
dotenv_1.default.config();
const router = (0, express_1.Router)();
//---------------------- RUTAS: -----------------------------
router.post("/deleteUser", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a /admin/deleteUser`);
    try {
        let idFromReq = req.body.id;
        let emailFromReq = req.body.email;
        let passwordFromReq = req.body.password;
        const reqUserId = req.auth.sub;
        const newAdminAction = {
            admin_id: req.auth.sub,
            route: `/admin/deleteUser`,
            action: `delete User with id "${idFromReq}" and email "${emailFromReq}".`,
            action_status: 0,
        };
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqUserId);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqUserId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqUserId}" que realiza la request no es un admin.`,
            });
        }
        if (passwordFromReq != process.env.ADMIN_PASSWORD) {
            console.log(`La password de administrador "${passwordFromReq}" no es válida`);
            return res
                .status(403)
                .send(`La password de administrador "${passwordFromReq}" no es válida`);
        }
        let userToBeDeleted = yield models_1.default.User.findOne({
            where: {
                [sequelize_1.Op.and]: [{ id: idFromReq }, { email: emailFromReq }],
            },
        });
        if (!userToBeDeleted) {
            console.log(`Usuario no encontrado con ese email y Id.`);
            throw new Error(`Usuario no encontrado con email "${emailFromReq}" y id "${idFromReq}.`);
        }
        else {
            yield userToBeDeleted.destroy();
            console.log(`Usuario destruido suavemente.`);
            yield models_1.default.Action.create(Object.assign(Object.assign({}, newAdminAction), { action_status: 200, action_msg: `Usuario con email "${userToBeDeleted.email}" y id "${userToBeDeleted.id}" eliminado.` }));
            return res
                .status(200)
                .send(`Usuario con email "${userToBeDeleted.email}" y id "${userToBeDeleted.id}" eliminado.`);
        }
    }
    catch (error) {
        console.log(`Error en ${req.path}. ${error.message}`);
        return res.status(400).send("Lo siento. Hubo un error.");
    }
}));
// CLEAN POSTS OF USER ID
router.post("/cleanPostsOfUserId", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a la ruta /admin/cleanPostsOfUserId`);
    try {
        const passwordFromReq = req.body.password;
        const userId = req.body.userId;
        const userIdSanitized = (0, GenericValidators_1.sanitizeID)(userId);
        const reqUserId = req.auth.sub;
        let reqUserIdSanitized = (0, GenericValidators_1.sanitizeID)(reqUserId);
        if (userId !== userIdSanitized) {
            console.log("Error al comparar userId con userIdSanitized");
            throw new Error("El user id no es válido");
        }
        if (reqUserId !== reqUserIdSanitized) {
            console.log("Error al comparar reqUserId con reqUserIdSanitized");
            throw new Error("El reqUserId no es válido");
        }
        const newAdminAction = {
            admin_id: reqUserId,
            route: `/admin/cleanPostsOfUserId`,
            action: `Delete posts of User with id "${req.body.userId}". IP: ${req.ip}`,
            action_status: 0,
        };
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqUserIdSanitized);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqUserId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqUserIdSanitized}" que realiza la request no es un admin.`,
            });
        }
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            console.log(`La password de administrador ${passwordFromReq} no es válida`);
            return res
                .status(403)
                .send(`La password de administrador "${(0, GenericValidators_1.sanitizeID)(passwordFromReq)}" no es válida`);
        }
        if (!req.body.userId) {
            throw new Error(`Debe ingresar un userId. Usted envió "${req.body.userId}"`);
        }
        console.log(`req.body.userId = ${req.body.userId}`);
        let postsOfUser = yield (0, adminAuxFn_1.getPostsOfUser)(userId);
        if (!postsOfUser) {
            throw new Error(`No se encontraron posts del user con id ${userId}`);
        }
        console.log(`Número de posts encontrados: ${postsOfUser === null || postsOfUser === void 0 ? void 0 : postsOfUser.length}`);
        console.log("Iniciando soft destruction de posteos...");
        let numberOfPostsDestroyed = 0;
        for (const post of postsOfUser) {
            yield post.destroy();
            console.log("post destruido");
            numberOfPostsDestroyed++;
        }
        yield models_1.default.Action.create(Object.assign(Object.assign({}, newAdminAction), { action_status: 200, action_msg: `Número de posts destruidos: ${numberOfPostsDestroyed}` }));
        return res
            .status(200)
            .send(`Número de posts destruidos: ${numberOfPostsDestroyed}`);
    }
    catch (error) {
        console.log(`Error en ${req.path}. ${error.message}`);
        return res.status(400).send("Lo siento. Hubo un error.");
    }
}));
// CLEAN REVIEWS TO USER
router.post("/cleanReviewsToUser", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`En ruta /admin/cleanReviewsToUser`);
    try {
        const passwordFromReq = req.body.password;
        const reqAdminId = req.auth.sub;
        const userId = req.body.userId;
        console.log(`userId recibido = ${userId}`);
        const newAdminAction = {
            admin_id: reqAdminId,
            route: `/admin/cleanReviewsToUser`,
            action: `Delete Reviews of User with id "${userId}". IP: ${req.ip}`,
            action_status: 0,
            action_msg: "",
        };
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqAdminId);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqAdminId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`,
            });
        }
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send(`La password de administrador no es válida`);
        }
        let allReviewsToUser = yield (0, adminAuxFn_1.getAllReviewsToUser)(userId);
        if (!allReviewsToUser) {
            throw new Error(`Las reviews al usuario encontradas es falso.`);
        }
        if (Array.isArray(allReviewsToUser) && allReviewsToUser.length === 0) {
            return res.status(200).send("No parecen haber reviews con ese UserId");
        }
        let reviewsErased = 0;
        console.log(`Empezando a borrar reviews... Reviews por borrar: ${allReviewsToUser.length}`);
        for (const review of allReviewsToUser) {
            yield review.destroy();
            console.log("Review borrada...");
            reviewsErased++;
        }
        console.log("Cantidad de reviews borradas: " + reviewsErased);
        yield models_1.default.Action.create(Object.assign(Object.assign({}, newAdminAction), { action_status: 200, action_msg: `Cantidad de reviews soft destroyed: ${reviewsErased}` }));
        return res
            .status(200)
            .send(`Cantidad de reviews soft destroyed: ${reviewsErased}`);
    }
    catch (error) {
        console.log(`Error en ${req.path}. ${error.message}`);
        return res.status(400).send("Lo siento. Hubo un error.");
    }
}));
// DELETE PETS WITH NO UserId
router.post("/deletePetsWithNoUserId", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`En ruta /admin/deletePetsWithNoUserId`);
    try {
        // CHEQUEAR SI EL REQ.AUTH.SUB EXISTE EN LA DB
        let passwordFromReq = req.body.password;
        const reqAdminId = req.auth.sub;
        const reqAdminIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqAdminId);
        const newAdminAction = {
            admin_id: reqAdminId,
            route: `/admin/deletePetsWithNoUserId`,
            action: `Delete Pets with no User Id.`,
            action_status: 0,
            action_msg: "",
        };
        if (!reqAdminIsAdmin) {
            console.log(`El usuario con id "${reqAdminId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`,
            });
        }
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send(`La password de administrador no es válida`);
        }
        let allThePetsWithNoUser = yield models_1.default.Animal.findAll({
            where: {
                UserId: {
                    [sequelize_1.Op.eq]: null,
                },
            },
        });
        console.log(`Cantidad de pets encontradas: ${allThePetsWithNoUser === null || allThePetsWithNoUser === void 0 ? void 0 : allThePetsWithNoUser.length}`);
        console.log(`Empezando a borrar mascotas con UserId === null`);
        let petsDestroyed = 0;
        for (const pet of allThePetsWithNoUser) {
            yield pet.destroy();
            console.log(`Animal soft destroyed...`);
            petsDestroyed++;
        }
        yield models_1.default.Action.create(Object.assign(Object.assign({}, newAdminAction), { action_status: 200, action_msg: `Cantidad de Mascotas/Posts eliminados: ${petsDestroyed}.` }));
        return res
            .status(200)
            .send(`Cantidad de Mascotas/Posts eliminados: ${petsDestroyed}.`);
    }
    catch (error) {
        console.log(`Error en ${req.path}. ${error.message}`);
        return res.status(400).send("Lo siento. Hubo un error.");
    }
}));
// DELETE PET
router.post("/deletePet", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`En ruta /admin/deletePet`);
    try {
        const passwordFromReq = req.body.password;
        const reqAdminId = req.auth.sub;
        const { petId } = req.body;
        const newAdminAction = {
            admin_id: reqAdminId,
            route: `/admin/deletePet`,
            action: `Delete Pet with Id "${petId}".`,
            action_status: 0,
            action_msg: "",
        };
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send(`La password de administrador no es válida`);
        }
        const reqAdminIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqAdminId);
        if (reqAdminIsAdmin !== true) {
            return res
                .status(403)
                .send(`No es posible realizar esta acción porque usted no es un admin.`);
        }
        const pet = yield models_1.default.Animal.findByPk(petId);
        if (pet) {
            yield pet.destroy();
            yield models_1.default.Action.create(Object.assign(Object.assign({}, newAdminAction), { action_status: 200, action_msg: `La publicación fue soft destroyed` }));
            return res.status(200).send("la publicación fue eliminada");
        }
        yield models_1.default.Action.create(Object.assign(Object.assign({}, newAdminAction), { action_status: 404, error_msg: `La publicación no existe` }));
        return res.status(404).send("la publicación no existe");
    }
    catch (error) {
        console.log(`Error en ${req.path}. ${error.message}`);
        return res.status(400).send("Lo siento. Hubo un error.");
    }
}));
// SET isAdmin a TRUE o FALSE. Sólo la puede usar el SUPER ADMIN.
router.put("/setIsAdmin", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a "admin/setIsAdmin"`);
    try {
        const reqAdminId = req.auth.sub;
        const passwordFromReq = req.body.password;
        const idOfUserToSetIsAdminProp = req.body.userToAffect_id;
        const newIsAdminValue = req.body.newIsAdminValue;
        let idOfUserToSetIsAdminPropSanitized = (0, GenericValidators_1.sanitizeID)(req.body.userToAffect_id);
        if (idOfUserToSetIsAdminProp !== idOfUserToSetIsAdminPropSanitized) {
            console.log("idOfUserToSetIsAdminProp tiene caracteres inválidos");
            throw new Error("idOfUserToSetIsAdminProp tiene caracteres inválidos");
        }
        const newAdminAction = {
            admin_id: reqAdminId,
            route: `/admin/setIsAdmin`,
            action: `Setear/cambiar la prop "isAdmin" del user con id "${idOfUserToSetIsAdminPropSanitized}" a "${newIsAdminValue}".`,
            action_status: 0,
            action_msg: "",
        };
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            console.log(`La password ingresada "${passwordFromReq}" no es válida.`);
            return res
                .status(403)
                .send({ msg: `La password de administrador ingresada no es válida` });
        }
        const reqUserIsSuperAdmin = yield (0, adminAuxFn_1.checkIfJWTisSuperAdmin)(reqAdminId);
        if (!reqUserIsSuperAdmin) {
            return res.status(403).send({
                error: `Se debe tener rol de Super Admin para realizar esta acción.`,
            });
        }
        const userToSetIsAdmin = yield models_1.default.User.findByPk(idOfUserToSetIsAdminPropSanitized);
        if (!userToSetIsAdmin) {
            throw new Error(`No se encontró en la Data Base al usuario con el id ${idOfUserToSetIsAdminPropSanitized}`);
        }
        if (newIsAdminValue !== true && newIsAdminValue !== false) {
            throw new Error(`El valor de newIsAdminValue debe ser true o false (booleanos). Usted ingresó ${newIsAdminValue}, el cual no es correcto.`);
        }
        userToSetIsAdmin.isAdmin = newIsAdminValue;
        yield userToSetIsAdmin.save();
        console.log(`Usuario con id ${idOfUserToSetIsAdminPropSanitized} fue seteado a isAdmin = ${newIsAdminValue}.`);
        yield models_1.default.Action.create(Object.assign(Object.assign({}, newAdminAction), { action_status: 200, action_msg: `Usuario con id ${idOfUserToSetIsAdminPropSanitized} fue seteado a isAdmin = ${newIsAdminValue}.` }));
        return res.status(200).send({
            msg: `Usuario con id ${idOfUserToSetIsAdminPropSanitized} fue seteado a isAdmin = ${newIsAdminValue}.`,
        });
    }
    catch (error) {
        console.log(`Error en ruta admin/setIsAdmin. ${error.message}`);
        return res.status(400).send({ error: `Algo salió mal :(` });
    }
}));
// SET IS SUPER ADMIN. SÓLO LA PUEDE USAR UN SUPER ADMIN.
router.put("/setIsSuperAdmin", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a "admin/setIsSuperAdmin"`);
    try {
        const reqAdminId = req.auth.sub;
        const passwordFromReq = req.body.password;
        const idOfUserToSetIsSuperAdminProp = req.body.userToAffect_id;
        const newIsSuperAdminValue = req.body.newIsSuperAdminValue;
        let idOfUserToSetIsSuperAdminPropSanitized = (0, GenericValidators_1.sanitizeID)(req.body.userToAffect_id);
        if (idOfUserToSetIsSuperAdminProp !== idOfUserToSetIsSuperAdminPropSanitized) {
            console.log("idOfUserToSetIsAdminProp tiene caracteres inválidos");
            throw new Error("idOfUserToSetIsAdminProp tiene caracteres inválidos");
        }
        const newAdminAction = {
            admin_id: reqAdminId,
            route: `/admin/setIsSuperAdmin`,
            action: `Setear/cambiar la prop "isSuperAdmin" del user con id "${idOfUserToSetIsSuperAdminPropSanitized}" a "${newIsSuperAdminValue}".`,
            action_status: 0,
            action_msg: "",
        };
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            console.log(`La password ingresada "${passwordFromReq}" no es válida.`);
            return res
                .status(403)
                .send({ msg: `La password de administrador ingresada no es válida` });
        }
        const reqUserIsSuperAdmin = yield (0, adminAuxFn_1.checkIfJWTisSuperAdmin)(reqAdminId);
        if (!reqUserIsSuperAdmin) {
            return res.status(403).send({
                error: `Se debe tener rol de Super Admin para realizar esta acción.`,
            });
        }
        const userToSetIsSuperAdmin = yield models_1.default.User.findByPk(idOfUserToSetIsSuperAdminPropSanitized);
        if (!userToSetIsSuperAdmin) {
            throw new Error(`No se encontró en la Data Base al usuario con el id ${idOfUserToSetIsSuperAdminPropSanitized}`);
        }
        if (newIsSuperAdminValue !== true && newIsSuperAdminValue !== false) {
            throw new Error(`El valor de newIsSuperAdmin debe ser true o false (booleanos). Usted ingresó ${newIsSuperAdminValue}, el cual no es correcto.`);
        }
        userToSetIsSuperAdmin.isSuperAdmin = newIsSuperAdminValue;
        yield userToSetIsSuperAdmin.save();
        console.log(`Usuario con id ${idOfUserToSetIsSuperAdminPropSanitized} fue seteado a isAdmin = ${newIsSuperAdminValue}.`);
        yield models_1.default.Action.create(Object.assign(Object.assign({}, newAdminAction), { action_status: 200, action_msg: `Usuario con id ${idOfUserToSetIsSuperAdminPropSanitized} fue seteado a isAdmin = ${newIsSuperAdminValue}.` }));
        return res.status(200).send({
            msg: `Usuario con id ${idOfUserToSetIsSuperAdminPropSanitized} fue seteado a isAdmin = ${newIsSuperAdminValue}.`,
        });
    }
    catch (error) {
        console.log(`Error en ${req.path}. ${error.message}`);
        return res.status(400).send("Lo siento. Hubo un error.");
    }
}));
// CHEQUEAR SI USER LOGUEADO CON JWT ES ADMIN O NO
router.post("/hasAdminPowers", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a "admin/hasAdminPowers".`);
    try {
        console.log(req.body);
        const jwtId = req.auth.sub;
        const passwordFromReq = req.body.password;
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            console.log(`La password ${passwordFromReq} no es válida.`);
            return res.status(403).send({
                error: `La password de administrador "${passwordFromReq}" ingresada no es válida`,
                msg: false,
            });
        }
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdminOrSuperAdmin)(jwtId);
        if (reqUserIsAdmin !== true) {
            return res.status(403).send({
                error: `Se debe tener rol de Admin para realizar esta acción.`,
                msg: false,
            });
        }
        if (reqUserIsAdmin === true) {
            return res.status(200).send({ msg: true });
        }
    }
    catch (error) {
        console.log(`Error en "admin/hasAdminPowers". ${error.message}`);
        return res.status(400).send({ error: `Algo salió mal.`, msg: false });
    }
}));
// ----   RUTAS MULTIPLICADORAS:  -----------
router.get("/createMultiplier", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqUserId = req.auth.sub;
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqUserId);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqUserId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqUserId}" que realiza la request no es un admin.`,
            });
        }
        const multiplier = yield models_1.default.Multiplier.findAll();
        if (multiplier.length === 0) {
            yield models_1.default.Multiplier.create({ number: 1 });
            return res.send("multiplicador creado");
        }
        return res.send("el multiplicador ya existe");
    }
    catch (error) {
        console.log(`Error en ${req.path}. ${error.message}`);
        return res.status(400).send("Lo siento. Hubo un error.");
    }
}));
router.post("/changeMultiplier", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a /admin/changeMultiplier`);
    try {
        // Agregar chequeo de si existe el req.auth.sub en la DB
        const { newMultiplier } = req.body;
        let passwordFromReq = req.body.password;
        const reqAdminId = req.auth.sub;
        const newAdminAction = {
            admin_id: reqAdminId,
            route: `/admin/changeMultiplier`,
            action: `Cambiar el valor del multiplicador de puntos de la tabla Multiplier a un nuevo valor: "${newMultiplier}"`,
            action_status: 0,
            action_msg: "",
        };
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqAdminId);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqAdminId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`,
            });
        }
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send(`La password de administrador no es válida`);
        }
        const multiplier = yield models_1.default.Multiplier.findByPk(1);
        let newMultiplierToNumber = Number(newMultiplier);
        multiplier.number = newMultiplierToNumber;
        yield multiplier.save();
        yield models_1.default.Action.create(Object.assign(Object.assign({}, newAdminAction), { action_status: 200, action_msg: `Multiplicador cambiado. Valor actual = ${multiplier.number}` }));
        return res
            .status(200)
            .send(`multiplicador cambiado. Valor actual = ${multiplier.number}`);
    }
    catch (error) {
        console.log(`Error en ${req.path}. ${error.message}`);
        return res.status(400).send("Lo siento. Hubo un error.");
    }
}));
// ------ RUTAS DEPRECADAS O YA SIN SENTIDO : ------
router.post("/mutateActiveToActivo", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a /admin/mutateActiveToActivo`);
    let password = req.body.password;
    try {
        if (password != process.env.ADMIN_PASSWORD) {
            return res.status(403).send(`La password de administrador no es válida`);
        }
        let allActiveTransactions = yield models_1.default.Transaction.findAll({
            where: {
                status: "active",
            },
        });
        let numberModified = 0;
        for (const trans of allActiveTransactions) {
            trans.status = transactionTypes_1.transactionStatus.Active;
            yield trans.save();
            numberModified++;
            console.log(`Transacciones modificadas de "active" a ${transactionTypes_1.transactionStatus.Active}: ${numberModified}`);
        }
        return res.status(200).send({ transactionsModified: `${numberModified}` });
    }
    catch (error) {
        console.log(`Error en ${req.path}. ${error.message}`);
        return res.status(400).send("Lo siento. Hubo un error.");
    }
}));
router.post("/banUser", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`En ruta /banUser`);
    try {
        const { id } = req.body;
        let passwordFromReq = req.body.password;
        const reqAdminId = req.auth.sub;
        const newAdminAction = {
            admin_id: reqAdminId,
            route: `/admin/banUser`,
            action: `Banear a usuario con id ${id}`,
            action_status: 0,
            action_msg: "",
        };
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqAdminId);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqAdminId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqAdminId}" que realiza la request no es un admin.`,
            });
        }
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send(`La password de administrador no es válida`);
        }
        const user = yield models_1.default.User.findByPk(id);
        if (user) {
            const ban = yield models_1.default.Ban.create({ id: id, email: user.email });
            user.isBanned = "true";
            yield user.save();
            console.log(`Usuario con email ${ban.email} ha sido banneado`);
            yield models_1.default.Action.create(Object.assign(Object.assign({}, newAdminAction), { action_status: 200, action_msg: `Usuario con id "${id}" e email "${ban.email}" ha sido banneado.` }));
            return res
                .status(200)
                .send(`Usuario con email ${ban.email} ha sido banneado.`);
        }
        yield models_1.default.Action.create(Object.assign(Object.assign({}, newAdminAction), { action_status: 404, error_msg: `El usuario con id "${id}" que se intenta banear no se encontró en la Data Base.` }));
        return res.status(404).send("el usuario no existe");
    }
    catch (error) {
        console.log(`Error en ${req.path}. ${error.message}`);
        return res.status(400).send("Lo siento. Hubo un error.");
    }
}));
//BORRAR PETS QUE TIENEN UN UserId de un User que no existe en la DB
router.delete("/purgePetsWithFalseUser", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a admin/purgePetsWithFalseUser`);
    try {
        const password = req.body.password;
        const reqAdminId = req.auth.sub;
        const newAdminAction = {
            admin_id: reqAdminId,
            route: `/admin/purgePetsWithFalseUser`,
            action: `Purgar las Pets con un UserId de un User que no existe en la DB.`,
            action_status: 0,
            action_msg: "",
        };
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqAdminId);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqAdminId}" que realiza la request no es un admin.`);
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
        let allThePets = yield (0, petAuxFn_1.getAllPets)();
        let allTheUsers = yield (0, userAuxFn_1.getAllUsers)();
        let userIds = allTheUsers.map((user) => user.id);
        console.log(`userIds = `);
        console.log(userIds);
        let numberOfPetsPurged = 0;
        for (let i = 0; i < allThePets.length; i++) {
            if (!userIds.includes(allThePets[i].UserId)) {
                console.log(`Destruyendo Pet con id ${allThePets[i].id}`);
                yield allThePets[i].destroy();
                numberOfPetsPurged++;
            }
        }
        console.log(`Cantidad de mascotas purgadas: ${numberOfPetsPurged}`);
        yield models_1.default.Action.create(Object.assign(Object.assign({}, newAdminAction), { action_status: 200, action_msg: `Cantidad de mascotas purgadas: ${numberOfPetsPurged}` }));
        return res
            .status(200)
            .send(`Cantidad de mascotas destruidas: ${numberOfPetsPurged}`);
    }
    catch (error) {
        console.log(`Error en ${req.path}. ${error.message}`);
        return res.status(400).send("Lo siento. Hubo un error.");
    }
}));
router.post("/getAdminActions", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a admin/getAdminActions`);
    try {
        const passwordFromReq = req.body.password;
        const reqAdminId = req.auth.sub;
        let reqAdminIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdminOrSuperAdmin)(reqAdminId);
        if (!reqAdminIsAdmin) {
            return res
                .status(403)
                .send({ error: "No tenés permiso para realizar esta acción." });
        }
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send({ error: "Password inválida" });
        }
        const allTheAdminActions = yield models_1.default.Action.findAll();
        console.log(`Cantidad de Admin Actions fetcheadas de la DB: ${allTheAdminActions.length}`);
        return res.status(200).send(allTheAdminActions);
    }
    catch (error) {
        console.log(`Error en "admin/getAdminActions". ${error.message}`);
        return res.status(400).send({ error: "Algo salió mal." });
    }
}));
exports.default = router;
