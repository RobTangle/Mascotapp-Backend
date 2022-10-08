"use strict";
// ----- ------ ------ FUNCIONES AUXILIARES PARA LAS RUTAS: ------- -------- --------
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
exports.emailExistsInDB = exports.parseReviewsToOwner = exports.parseReviewerImage = exports.parseReviewerName = exports.getParsedReviewsToOwner = exports.getPostsOfUser = exports.parsePetsPostedByUser = exports.getSomeUserInfo = exports.getAllTransactions = exports.getAllReviewsRecived = exports.getAllUsers = void 0;
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../../../models"));
//!------------
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield models_1.default.User.findAll();
        // console.log(allUsers);
        return allUsers;
    }
    catch (error) {
        console.log(error.message);
        return error;
    }
});
exports.getAllUsers = getAllUsers;
const getAllReviewsRecived = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allReviews = yield models_1.default.Review.findAll({
            where: {
                UserId: userId,
            },
        });
        return allReviews;
    }
    catch (error) {
        console.log(error.message);
        return error;
    }
});
exports.getAllReviewsRecived = getAllReviewsRecived;
const getAllTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTransactions = yield models_1.default.Transaction.findAll({
            where: {
                [sequelize_1.Op.or]: [{ user_offering_id: userId }, { user_demanding_id: userId }],
            },
        });
        return allTransactions;
    }
    catch (error) {
        console.log(error.message);
        return error;
    }
});
exports.getAllTransactions = getAllTransactions;
// get Some User Info:
function getSomeUserInfo(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Ejecutando función auxiliar someUserInfo`);
        console.log(`userId = ${userId}`);
        try {
            let userInfo = yield models_1.default.User.findByPk(userId);
            if (userInfo) {
                let someUserInfo = {
                    name: userInfo.name,
                    city: userInfo.city,
                    image: userInfo.image,
                    contact: userInfo.contact,
                    isDonator: userInfo.isDonator,
                    isAdopter: userInfo.isAdopter,
                    gaveUpForAdoption: userInfo.gaveUpForAdoption,
                    foundAPet: userInfo.foundAPet,
                    gotAPetBack: userInfo.gotAPetBack,
                    points: userInfo.points,
                    linkToDonate: userInfo.linkToDonate,
                    endpoints: userInfo.endpoints,
                    isBanned: userInfo.isBanned,
                    isAdmin: userInfo.isAdmin,
                };
                console.log(`retornando someUserInfo: ${someUserInfo}`);
                return someUserInfo;
            }
            else {
                throw new Error(`usuario no encontrado`);
            }
        }
        catch (error) {
            console.log(`Error en la función auxiliar someUserInfo: ${error.message}`);
            return error.message;
        }
    });
}
exports.getSomeUserInfo = getSomeUserInfo;
//Parse Pets Posted By User ---> deja afuera el UserId
function parsePetsPostedByUser(petsPostedByUser) {
    console.log(`En function auxiliary parsePetsPostedByUser`);
    try {
        let parsedPets = petsPostedByUser.map((pet) => {
            return {
                id: pet.id,
                name: pet.name,
                city: pet.city,
                specie: pet.specie,
                race: pet.race,
                age: pet.age,
                gender: pet.gender,
                status: pet.status,
                vaccinationSchemeStatus: pet.vaccinationSchemeStatus,
                image: pet.image,
                comments: pet.comments,
                withNewOwner: pet.withNewOwner,
                backWithItsOwner: pet.backWithItsOwner,
                postStatus: pet.postStatus,
            };
        });
        console.log(`Retornando parsedPets. parsedPets.length = ${parsedPets.length}`);
        return parsedPets;
    }
    catch (error) {
        return error;
    }
}
exports.parsePetsPostedByUser = parsePetsPostedByUser;
//GET POSTS OF USER:
function getPostsOfUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Buscando los posteos de user con id: ${id}`);
        try {
            let postsOfUser = yield models_1.default.Animal.findAll({
                where: {
                    UserId: id,
                },
            });
            console.log(`${postsOfUser === null || postsOfUser === void 0 ? void 0 : postsOfUser.length} posts encontrados`);
            return postsOfUser;
        }
        catch (error) {
            return error.message;
        }
    });
}
exports.getPostsOfUser = getPostsOfUser;
function getParsedReviewsToOwner(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let reviewsToUser = yield models_1.default.Review.findAll({
                where: {
                    UserId: id,
                },
            });
            let parsedReviewsWithMoreData = yield parseReviewsToOwner(reviewsToUser);
            return parsedReviewsWithMoreData;
        }
        catch (error) {
            console.log(`Error en function getReviewsToOwner`);
            return error.message;
        }
    });
}
exports.getParsedReviewsToOwner = getParsedReviewsToOwner;
function parseReviewerName(reviewerName) {
    console.log(`Parseando reviewer name`);
    try {
        if (!reviewerName) {
            return "Anónimo";
        }
        else {
            return reviewerName;
        }
    }
    catch (error) {
        console.log(`Error en el parseReviewerName. ${error.message}`);
        return error.message;
    }
}
exports.parseReviewerName = parseReviewerName;
function parseReviewerImage(reviewerImage) {
    try {
        if (!reviewerImage) {
            return "https://www.utas.edu.au/__data/assets/image/0013/210811/varieties/profile_image.png";
        }
        else {
            return reviewerImage;
        }
    }
    catch (error) {
        console.log(`Error en la function parseReviewerImage. ${error.message}`);
        return error.message;
    }
}
exports.parseReviewerImage = parseReviewerImage;
function parseReviewsToOwner(arrayOfReviews) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Parseando las reviews...`);
        // console.log(arrayOfReviews);
        try {
            let parsedReviews = yield Promise.all(arrayOfReviews.map((review) => __awaiter(this, void 0, void 0, function* () {
                // console.log("review:");
                // console.log(review);
                let reviewer = yield models_1.default.User.findByPk(review.reviewer_id);
                // console.log(reviewer.name);
                // console.log(reviewer.image);
                return {
                    id: review.dataValues.id,
                    transaction_id: review.dataValues.transaction_id,
                    reviewer_id: review.dataValues.reviewer_id,
                    comments: review.dataValues.comments,
                    starts: review.dataValues.stars,
                    createdAt: review.dataValues.createdAt,
                    updatedAt: review.dataValues.updatedAt,
                    UserId: review.dataValues.UserId,
                    reviewer_name: parseReviewerName(reviewer === null || reviewer === void 0 ? void 0 : reviewer.name),
                    reviewer_image: parseReviewerImage(reviewer === null || reviewer === void 0 ? void 0 : reviewer.image),
                };
            })));
            console.log(`Devolviendo las parsedReviews:`);
            // console.log(parsedReviews);
            return parsedReviews;
        }
        catch (error) {
            console.log(`Error en el parseReviewsToOwner. ${error.message}`);
            return error.message;
        }
    });
}
exports.parseReviewsToOwner = parseReviewsToOwner;
// EMAIL EXISTS IN DATABASE:
function emailExistsInDB(emailFromReq) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Chequeando si el email "${emailFromReq} existe en la DB`);
        try {
            let userWithEmail = yield models_1.default.User.findOne({
                where: {
                    email: emailFromReq,
                },
            });
            if (userWithEmail) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.log(`Error en function emailExistsInDB`);
            return error.message;
        }
    });
}
exports.emailExistsInDB = emailExistsInDB;
