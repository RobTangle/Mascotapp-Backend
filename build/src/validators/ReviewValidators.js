"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReviewedId = exports.validateNewReview = void 0;
const GenericValidators_1 = require("./GenericValidators");
function validateNewReview(reqBody) {
    try {
        let reviewFromReqChecked = {
            transaction_id: checkTransactionId(reqBody.transaction_id),
            reviewer_id: checkReviewerId(reqBody.reviewer_id),
            comments: checkComments(reqBody.comments),
            stars: checkStars(reqBody.stars),
        };
        return reviewFromReqChecked;
    }
    catch (error) {
        console.log(`Error en la function validateNewReview. ${error.message}`);
        throw new Error(`Error en la function validateNewReview. ${error.message}`);
    }
}
exports.validateNewReview = validateNewReview;
function isValidStarNumber(argumento) {
    let argToNumber = Number(argumento);
    if (Number.isInteger(argToNumber) && argToNumber <= 5 && argToNumber >= 1) {
        return true;
    }
    else {
        return false;
    }
}
function checkStars(starsFromReq) {
    if (isValidStarNumber(starsFromReq)) {
        return Number(starsFromReq);
    }
    else {
        throw new Error(`El número de calificación ingresado no es válido`);
    }
}
function checkComments(commentsFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(commentsFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isEmptyString)(commentsFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isValidString)(commentsFromReq) && commentsFromReq.length < 1000) {
        return commentsFromReq;
    }
    throw new Error(`El comentario ingresado no es válido. Asegúrese de que tenga menos de 1000 caracteres y que sea una cadena de texto o undefined`);
}
function checkReviewedId(reviewedIdFromReq) {
    if (!(0, GenericValidators_1.isValidString)(reviewedIdFromReq)) {
        throw new Error(`El reviewed Id "${reviewedIdFromReq}" ingresado no es válido.`);
    }
    else {
        return reviewedIdFromReq;
    }
}
exports.checkReviewedId = checkReviewedId;
function checkReviewerId(reviewerIdFromReq) {
    if (!(0, GenericValidators_1.isValidString)(reviewerIdFromReq)) {
        throw new Error(`El reviewer Id "${reviewerIdFromReq}" ingresado no es válido.`);
    }
    else {
        return reviewerIdFromReq;
    }
}
function checkTransactionId(transactionIdFromReq) {
    if (!(0, GenericValidators_1.isValidString)(transactionIdFromReq)) {
        throw new Error(`El transaction_id "${transactionIdFromReq}"no es válido.`);
    }
    else {
        return transactionIdFromReq;
    }
}
