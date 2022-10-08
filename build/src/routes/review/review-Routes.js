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
const index_1 = __importDefault(require("../../../models/index"));
const ReviewValidators_1 = require("../../validators/ReviewValidators");
const jwtMiddleware_1 = __importDefault(require("../../../config/jwtMiddleware"));
const reviewAuxFn_1 = require("./reviewAuxFn");
const GenericValidators_1 = require("../../validators/GenericValidators");
const router = (0, express_1.Router)();
//------  RUTAS: -----------------------------------------------
router.get("/allReviews", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a la ruta GET /reviews/allReviews`);
    try {
        let allReviews = yield (0, reviewAuxFn_1.getAllReviews)();
        return res.status(200).send(allReviews);
    }
    catch (error) {
        console.log(`Error en /reviews/allReviews`);
        return res.status(404).send(error.message);
    }
}));
router.post("/newReview", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(`Entré a la ruta POST /reviews/newReview`);
    try {
        console.log(`req.body = ${req.body}`);
        const idOfToken = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.sub;
        let { reviewed_id, reviewer_id, transaction_id } = req.body;
        if (!(0, GenericValidators_1.isValidId)(reviewed_id)) {
            throw new Error(`El ID del reviewed_id "${reviewed_id}" no es válido`);
        }
        if (idOfToken !== reviewer_id) {
            throw new Error(`El id del reviewer es distinto al id del reviewer_id del body`);
        }
        const transaction = yield index_1.default.Transaction.findOne({
            where: { id: transaction_id },
        });
        if (!transaction)
            throw new Error(`La transacción con id "${transaction_id}" no existe.`);
        if ((reviewer_id === transaction.user_offering_id &&
            reviewed_id === transaction.user_demanding_id) ||
            (reviewer_id === transaction.user_demanding_id &&
                reviewed_id === transaction.user_offering_id)) {
            let validatedReview = (0, ReviewValidators_1.validateNewReview)(req.body);
            console.log(`req.body Validado. Continuando con los chequeos de los id de usuarios...`);
            if (reviewer_id === transaction.user_offering_id) {
                if (transaction.user_offering_check === "finalizado") {
                    let newReview = yield index_1.default.Review.create(validatedReview);
                    let reviewedUser = yield index_1.default.User.findByPk(reviewed_id);
                    yield newReview.setUser(reviewedUser);
                    console.log(newReview);
                    console.log(`Review creada y asociada al user ${reviewed_id}`);
                    transaction.user_offering_check = "calificado";
                    yield transaction.save();
                    return res.status(200).send(newReview);
                }
            }
            if (reviewer_id === transaction.user_demanding_id) {
                if (transaction.user_demanding_check === "finalizado") {
                    let newReview = yield index_1.default.Review.create(validatedReview);
                    let reviewedUser = yield index_1.default.User.findByPk(reviewed_id);
                    yield newReview.setUser(reviewedUser);
                    console.log(`Review creada y asociada al user ${reviewed_id}`);
                    transaction.user_demanding_check = "calificado";
                    yield transaction.save();
                    console.log(`user_demanding_check cambiado a "calificado"`);
                    console.log(`Retornando la nueva review...`);
                    console.log(newReview);
                    return res.status(200).send(newReview);
                }
            }
        }
        return res
            .status(404)
            .send({ msg: "Transacción no válida para estos usuarios." });
    }
    catch (error) {
        console.log(`Error en ruta /newReview.  ${error.message}`);
        return res.status(404).send(error.message);
    }
}));
router.post("/getReviewsToUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`En /reviews/getReviewsToUser`);
    console.log(`req.body = ${req.body}`);
    try {
        console.log(`user id = ${req.body.id}`);
        if (!req.body.id) {
            throw new Error(`el req.body.id "${req.body.id}" enviado por body es falso.`);
        }
        let userId = req.body.id;
        let reviewsToUser = yield index_1.default.Review.findAll({
            where: {
                UserId: userId,
            },
        });
        console.log(`Devolviendo reviews hechas al user con id ${req.body.id}...`);
        return res.status(200).send(reviewsToUser);
    }
    catch (error) {
        console.log(`Error en /reviews/getReviewsOfUser. ${error.message}`);
        return res.status(404).send(error.message);
    }
}));
exports.default = router;
