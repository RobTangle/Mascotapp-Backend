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
exports.checkIfJWTisAdmin = exports.checkIfJWTisSuperAdmin = exports.checkIfJWTisAdminOrSuperAdmin = exports.getPostsOfUser = exports.getAllReviewsToUser = void 0;
const models_1 = __importDefault(require("../../../models"));
// -------- FUNCIONES AUXILIARES : ---------
// GET ALL REVIEWS TO USER by id
function getAllReviewsToUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let allReviewsToUser = yield models_1.default.Review.findAll({
                where: {
                    UserId: id,
                },
            });
            console.log(`reviews al User encontradas: ${allReviewsToUser.length}`);
            return allReviewsToUser;
        }
        catch (error) {
            console.log(`Error en function getAllReviewsToUser en /admin/`);
            throw new Error(`Error al buscar las reviews que el usuario recibió.`);
        }
    });
}
exports.getAllReviewsToUser = getAllReviewsToUser;
// GET POSTS OF USER by id
function getPostsOfUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`En getPostsOfUser...`);
        try {
            console.log(`id ingresado como argumento: ${id}`);
            let postsOfUser = yield models_1.default.Animal.findAll({
                where: {
                    UserId: id,
                },
            });
            console.log(`Encontrados ${postsOfUser === null || postsOfUser === void 0 ? void 0 : postsOfUser.length} posts con el id ingresado.`);
            return postsOfUser;
        }
        catch (error) {
            console.log(`Error en getPostsOfUser: ${error.message}`);
            throw new Error(`${error.message}`);
        }
    });
}
exports.getPostsOfUser = getPostsOfUser;
// AUX FN: CHECK IF USER IS ADMIN OR SUPER ADMIN
function checkIfJWTisAdminOrSuperAdmin(jwtId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Chequeando si el user id "${jwtId}" es admin o super admin.`);
        try {
            const userInDB = yield models_1.default.User.findByPk(jwtId);
            if (!userInDB) {
                throw new Error(`El usuario con id ${jwtId} no existe en la Data Base.`);
            }
            if (userInDB.isAdmin === true || userInDB.isSuperAdmin === true) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw new Error(`Error en function checkIfJWTisAdminOrSuperAdmin. ${error.message}`);
        }
    });
}
exports.checkIfJWTisAdminOrSuperAdmin = checkIfJWTisAdminOrSuperAdmin;
// AUX FN: CHECK IF USER IS SUPER ADMIN
function checkIfJWTisSuperAdmin(jwtId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Chequeando si user id ${jwtId} es SUPER ADMIN`);
        try {
            const userInDB = yield models_1.default.User.findByPk(jwtId);
            if (userInDB.isSuperAdmin === true) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.log(`Error en function checkIfJWTisSuperAdmin`);
            throw new Error(`Error en function checkIfJWTisSuperAdmin. ${error.message}`);
        }
    });
}
exports.checkIfJWTisSuperAdmin = checkIfJWTisSuperAdmin;
// AUX FN: CHECK IF LOGGED USER IS ADMIN
function checkIfJWTisAdmin(jwtId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Chequeando si el sub del JWT es un Admin`);
        try {
            let userAsAdmin = yield models_1.default.User.findByPk(jwtId);
            if (userAsAdmin.isAdmin === true) {
                console.log(`isAdmin === true`);
                return true;
            }
            else {
                console.log(`isAdmin !== true. El id ${jwtId} NO ES ADMIN`);
                return false;
            }
        }
        catch (error) {
            throw new Error("Error al chequear si el JWT sub es un admin");
        }
    });
}
exports.checkIfJWTisAdmin = checkIfJWTisAdmin;
