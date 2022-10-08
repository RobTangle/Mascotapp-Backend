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
const index_1 = __importDefault(require("../../../models/index"));
const transactionTypes_1 = require("../../types/transactionTypes");
const jwtMiddleware_1 = __importDefault(require("../../../config/jwtMiddleware"));
const users_1 = require("../users");
const petRoutes_1 = require("../petRoutes");
const adminAuxFn_1 = require("./adminAuxFn");
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
        let userToBeDeleted = yield index_1.default.User.findOne({
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
            return res
                .status(200)
                .send(`Usuario con email "${emailFromReq}" y id "${idFromReq}" eliminado.`);
        }
    }
    catch (error) {
        console.log(`Error en /admin/deleteUser. ${error.message}`);
        return res.status(404).send(error.message);
    }
}));
router.post("/cleanPostsOfUserId", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a la ruta /admin/cleanPostsOfUserId`);
    try {
        let passwordFromReq = req.body.password;
        const reqUserId = req.auth.sub;
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqUserId);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqUserId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqUserId}" que realiza la request no es un admin.`,
            });
        }
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            console.log(`La password de administrador ${passwordFromReq} no es válida`);
            return res
                .status(403)
                .send(`La password de administrador "${passwordFromReq}" no es válida`);
        }
        if (!req.body.userId) {
            throw new Error(`Debe ingresar un userId. Usted envió "${req.body.userId}"`);
        }
        console.log(`req.body.userId = ${req.body.userId}`);
        let userId = req.body.userId;
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
        return res
            .status(200)
            .send(`Número de posts destruidos: ${numberOfPostsDestroyed}`);
    }
    catch (error) {
        console.log(`Error en la ruta /admin/cleanPostsOfUserId. ${error.message}`);
        return res.status(404).send(error.message);
    }
}));
router.post("/cleanReviewsToUser", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`En ruta /admin/cleanReviewsToUser`);
    try {
        let passwordFromReq = req.body.password;
        const reqUserId = req.auth.sub;
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqUserId);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqUserId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqUserId}" que realiza la request no es un admin.`,
            });
        }
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send(`La password de administrador no es válida`);
        }
        let userId = req.body.userId;
        console.log(`userId recibido = ${userId}`);
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
        return res
            .status(200)
            .send(`Cantidad de reviews soft destroyed: ${reviewsErased}`);
    }
    catch (error) {
        console.log(`Error en /cleanReviewsToUser. ${error.message}`);
        return res.status(404).send(error.message);
    }
}));
// DELETE PETS WITH NO UserId
router.post("/deletePetsWithNoUserId", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`En ruta /admin/deletePetsWithNoUserId`);
    try {
        // CHEQUEAR SI EL REQ.AUTH.SUB EXISTE EN LA DB
        let passwordFromReq = req.body.password;
        const reqUserId = req.auth.sub;
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqUserId);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqUserId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqUserId}" que realiza la request no es un admin.`,
            });
        }
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send(`La password de administrador no es válida`);
        }
        let allThePetsWithNoUser = yield index_1.default.Animal.findAll({
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
        return res
            .status(200)
            .send(`Cantidad de Mascotas/Posts eliminados: ${petsDestroyed}.`);
    }
    catch (error) {
        console.log(`Error en /admin/deletePetsWithNoUserId. ${error.message}`);
    }
}));
router.post("/deletePet", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`En ruta /admin/deletePet`);
    try {
        const passwordFromReq = req.body.password;
        const reqUserId = req.auth.sub;
        const { petId } = req.body;
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send(`La password de administrador no es válida`);
        }
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqUserId);
        if (reqUserIsAdmin !== true) {
            return res
                .status(403)
                .send(`No es posible realizar esta acción porque usted no es un admin.`);
        }
        const pet = yield index_1.default.Animal.findOne({ where: { id: petId } });
        if (pet) {
            yield pet.destroy();
            return res.status(200).send("la publicación fue eliminada");
        }
        return res.status(200).send("la publicación no existe");
    }
    catch (error) {
        console.log(`Error en /admin/deletePets ${error.message}`);
    }
}));
// SET isAdmin a TRUE o FALSE. Sólo la puede usar el SUPER ADMIN.
router.put("/setIsAdmin", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a "admin/setIsAdmin"`);
    try {
        const jwtId = req.auth.sub;
        const passwordFromReq = req.body.password;
        const idOfUserToSetIsAdminProp = req.body.userToAffect_id;
        const newIsAdminValue = req.body.newIsAdminValue;
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            console.log(`La password ingresada "${passwordFromReq}" no es válida.`);
            return res
                .status(403)
                .send({ msg: `La password de administrador ingresada no es válida` });
        }
        const reqUserIsSuperAdmin = yield (0, adminAuxFn_1.checkIfJWTisSuperAdmin)(jwtId);
        if (!reqUserIsSuperAdmin) {
            return res.status(403).send({
                error: `Se debe tener rol de Super Admin para realizar esta acción.`,
            });
        }
        const userToSetIsAdmin = yield index_1.default.User.findByPk(idOfUserToSetIsAdminProp);
        if (!userToSetIsAdmin) {
            throw new Error(`No se encontró en la Data Base al usuario con el id ${idOfUserToSetIsAdminProp}`);
        }
        if (newIsAdminValue !== true && newIsAdminValue !== false) {
            throw new Error(`El valor de newIsAdminValue debe ser true o false (booleanos). Usted ingresó ${newIsAdminValue}, el cual no es correcto.`);
        }
        userToSetIsAdmin.isAdmin = newIsAdminValue;
        yield userToSetIsAdmin.save();
        console.log(`Usuario con id ${idOfUserToSetIsAdminProp} fue seteado a isAdmin = ${newIsAdminValue}.`);
        return res.status(200).send({
            msg: `Usuario con id ${idOfUserToSetIsAdminProp} fue seteado a isAdmin = ${newIsAdminValue}.`,
        });
    }
    catch (error) {
        console.log(`Error en ruta admin/setIsAdmin. ${error.message}`);
        return res.status(400).send({ error: `${error.message}` });
    }
}));
// SET IS SUPER ADMIN. SÓLO LA PUEDE USAR UN SUPER ADMIN.
router.put("/setIsSuperAdmin", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a "admin/setIsSuperAdmin"`);
    try {
        const jwtId = req.auth.sub;
        const passwordFromReq = req.body.password;
        const idOfUserToSetIsSuperAdminProp = req.body.userToAffect_id;
        const newIsSuperAdminValue = req.body.newIsSuperAdminValue;
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            console.log(`La password ingresada "${passwordFromReq}" no es válida.`);
            return res
                .status(403)
                .send({ msg: `La password de administrador ingresada no es válida` });
        }
        const reqUserIsSuperAdmin = yield (0, adminAuxFn_1.checkIfJWTisSuperAdmin)(jwtId);
        if (!reqUserIsSuperAdmin) {
            return res.status(403).send({
                error: `Se debe tener rol de Super Admin para realizar esta acción.`,
            });
        }
        const userToSetIsSuperAdmin = yield index_1.default.User.findByPk(idOfUserToSetIsSuperAdminProp);
        if (!userToSetIsSuperAdmin) {
            throw new Error(`No se encontró en la Data Base al usuario con el id ${idOfUserToSetIsSuperAdminProp}`);
        }
        if (newIsSuperAdminValue !== true && newIsSuperAdminValue !== false) {
            throw new Error(`El valor de newIsSuperAdmin debe ser true o false (booleanos). Usted ingresó ${newIsSuperAdminValue}, el cual no es correcto.`);
        }
        userToSetIsSuperAdmin.isSuperAdmin = newIsSuperAdminValue;
        yield userToSetIsSuperAdmin.save();
        console.log(`Usuario con id ${idOfUserToSetIsSuperAdminProp} fue seteado a isAdmin = ${newIsSuperAdminValue}.`);
        return res.status(200).send({
            msg: `Usuario con id ${idOfUserToSetIsSuperAdminProp} fue seteado a isAdmin = ${newIsSuperAdminValue}.`,
        });
    }
    catch (error) {
        console.log(`Error en ruta admin/setIsAdmin. ${error.message}`);
        return res.status(400).send({ error: `${error.message}` });
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
        return res.status(400).send({ error: `${error.message}`, msg: false });
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
        const multiplier = yield index_1.default.Multiplier.findAll();
        if (multiplier.length === 0) {
            yield index_1.default.Multiplier.create({ number: 1 });
            res.send("multiplicador creado");
        }
        res.send("el multiplicador ya existe");
    }
    catch (error) {
        console.log(`Error en /admin/changeMultiplier. ${error.message}`);
        return res.status(404).send(error.message);
    }
}));
router.post("/changeMultiplier", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a /admin/changeMultiplier`);
    try {
        // Agregar chequeo de si existe el req.auth.sub en la DB
        const { newMultiplier } = req.body;
        let passwordFromReq = req.body.password;
        const reqUserId = req.auth.sub;
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqUserId);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqUserId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqUserId}" que realiza la request no es un admin.`,
            });
        }
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send(`La password de administrador no es válida`);
        }
        const multiplier = yield index_1.default.Multiplier.findByPk(1);
        let newMultiplierToNumber = Number(newMultiplier);
        multiplier.number = newMultiplierToNumber;
        yield multiplier.save();
        res.send(`multiplicador cambiado. Valor actual = ${multiplier.number}`);
    }
    catch (error) {
        console.log(`Error en /admin/changeMultiplier. ${error.message}`);
        return res.status(404).send(error.message);
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
        let allActiveTransactions = yield index_1.default.Transaction.findAll({
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
        console.log(`Error en el /admin/mutateActiveToActivo`);
        return res.status(404).send(error.message);
    }
}));
router.post("/banUser", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`En ruta /banUser`);
    try {
        const { id } = req.body;
        let passwordFromReq = req.body.password;
        const reqUserId = req.auth.sub;
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqUserId);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqUserId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqUserId}" que realiza la request no es un admin.`,
            });
        }
        if (passwordFromReq !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send(`La password de administrador no es válida`);
        }
        const user = yield index_1.default.User.findByPk(id);
        if (user) {
            const ban = yield index_1.default.Ban.create({ id: id, email: user.email });
            user.isBanned = "true";
            yield user.save();
            console.log(`usuario baneado ${ban.email}`);
            return res.send(`usuario baneado ${ban.email}`);
        }
        return res.status(404).send("el usuario no existe");
    }
    catch (error) {
        console.log(`Error en /admin/banUser. ${error.message}`);
        return res.status(404).send(error.message);
    }
}));
//BORRAR PETS QUE TIENEN UN UserId de un User que no existe en la DB
router.delete("/purgePetsWithFalseUser", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a admin/purgePetsWithFalseUser`);
    try {
        const password = req.body.password;
        const reqUserId = req.auth.sub;
        const reqUserIsAdmin = yield (0, adminAuxFn_1.checkIfJWTisAdmin)(reqUserId);
        if (!reqUserIsAdmin) {
            console.log(`El usuario con id "${reqUserId}" que realiza la request no es un admin.`);
            return res.status(403).send({
                error: `El usuario con id "${reqUserId}" que realiza la request no es un admin.`,
            });
        }
        if (!password) {
            throw new Error(`La password enviada por body es "${password}"`);
        }
        if (password !== process.env.ADMIN_PASSWORD) {
            console.log(`La password "${password}" es inválida`);
            return res.status(401).send(`Password inválida.`);
        }
        let allThePets = yield (0, petRoutes_1.getAllPets)();
        let allTheUsers = yield (0, users_1.getAllUsers)();
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
        return res
            .status(200)
            .send(`Cantidad de mascotas destruidas: ${numberOfPetsPurged}`);
    }
    catch (error) {
        console.log(`Error en admin/purgePetsWithFalseUser. ${error.message}`);
        return res.status(400).send(error.message);
    }
}));
exports.default = router;
