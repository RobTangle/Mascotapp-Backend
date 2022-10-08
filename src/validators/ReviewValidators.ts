import { IReview } from "../types/reviewTypes";
import {
  isEmptyString,
  isUndefinedOrNull,
  isValidString,
} from "./GenericValidators";

export function validateNewReview(reqBody: any): IReview {
  try {
    let reviewFromReqChecked: IReview = {
      transaction_id: checkTransactionId(reqBody.transaction_id),
      reviewer_id: checkReviewerId(reqBody.reviewer_id),
      comments: checkComments(reqBody.comments),
      stars: checkStars(reqBody.stars),
    };
    return reviewFromReqChecked;
  } catch (error: any) {
    console.log(`Error en la function validateNewReview. ${error.message}`);
    throw new Error(`Error en la function validateNewReview. ${error.message}`);
  }
}

function isValidStarNumber(argumento: any): boolean {
  let argToNumber = Number(argumento);
  if (Number.isInteger(argToNumber) && argToNumber <= 5 && argToNumber >= 1) {
    return true;
  } else {
    return false;
  }
}

function checkStars(starsFromReq: any): number {
  if (isValidStarNumber(starsFromReq)) {
    return Number(starsFromReq);
  } else {
    throw new Error(`El número de calificación ingresado no es válido`);
  }
}

function checkComments(commentsFromReq: any) {
  if (isUndefinedOrNull(commentsFromReq)) {
    return undefined;
  }
  if (isEmptyString(commentsFromReq)) {
    return undefined;
  }
  if (isValidString(commentsFromReq) && commentsFromReq.length < 1000) {
    return commentsFromReq;
  }
  throw new Error(
    `El comentario ingresado no es válido. Asegúrese de que tenga menos de 1000 caracteres y que sea una cadena de texto o undefined`
  );
}

export function checkReviewedId(reviewedIdFromReq: any) {
  if (!isValidString(reviewedIdFromReq)) {
    throw new Error(
      `El reviewed Id "${reviewedIdFromReq}" ingresado no es válido.`
    );
  } else {
    return reviewedIdFromReq;
  }
}

function checkReviewerId(reviewerIdFromReq: any) {
  if (!isValidString(reviewerIdFromReq)) {
    throw new Error(
      `El reviewer Id "${reviewerIdFromReq}" ingresado no es válido.`
    );
  } else {
    return reviewerIdFromReq;
  }
}

function checkTransactionId(transactionIdFromReq: any) {
  if (!isValidString(transactionIdFromReq)) {
    throw new Error(`El transaction_id "${transactionIdFromReq}"no es válido.`);
  } else {
    return transactionIdFromReq;
  }
}
