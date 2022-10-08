import { ITransaction } from "../types/transactionTypes";
import {
  isEmptyString,
  isStringBetween1And101CharsLong,
  isStringBetween1And50CharsLong,
  isUndefinedOrNull,
  isValidId,
  isValidURL,
} from "./GenericValidators";
import { isValidString } from "./GenericValidators";

export function validateNewTransaction(obj: any): ITransaction {
  console.log(`validateNewTransaction...`);
  try {
    let transactionFromReqChecked: ITransaction = {
      user_offering_id: checkUserOfferingId(obj.user_offering_id),
      user_offering_name: checkUserName(obj.user_offering_name),
      user_demanding_id: checkUserDemandingId(obj.user_demanding_id),
      user_demanding_name: checkUserName(obj.user_demanding_name),
      status: checkStatus(obj.status),
      pet_id: checkPetId(obj.pet_id),
      pet_name: checkPetName(obj.pet_name),
      pet_image: checkPetImage(obj.pet_image),
      user_offering_check: checkUserOfferingCheck(obj.user_offering_check),
      user_demanding_check: checkUserDemandingCheck(obj.user_demanding_check),
    };
    console.log(
      `Validaciones de newTransaction realizadas. Retornando transactionFromReqChecked...`
    );
    return transactionFromReqChecked;
  } catch (error: any) {
    console.log(
      `Error en la function validateNewTransaction: ${error.message}`
    );
    throw new Error(
      `Error en la function validateNewTransaction: ${error.message}`
    );
  }
}

function checkPetImage(arg: any): string | undefined {
  if (isValidURL(arg)) {
    return arg;
  }
  if (isUndefinedOrNull(arg)) {
    return undefined;
  }
  throw new Error(
    `Error al validar la pet_image. Ingresó "${arg}" lo cual no pasó las validaciones.`
  );
}

function checkUserName(arg: string): string | undefined {
  if (isStringBetween1And50CharsLong(arg)) {
    return arg;
  }
  if (isUndefinedOrNull(arg)) {
    return undefined;
  } else {
    throw new Error(
      `Error al validar el User Name. Ingresó ${arg} y no es válido.`
    );
  }
}

// function isValidName(arg: any): boolean {}

function checkPetName(arg: any) {
  if (isStringBetween1And50CharsLong(arg)) {
    return arg;
  } else {
    throw new Error(
      `Error de validación de petName es function ValidateNewTransaction. El name de la mascota es ${arg} y debe ser un string con length mayor a 0 y menor a 51.`
    );
  }
}

function checkUserOfferingId(userOfferingFromReq: any) {
  if (isValidId(userOfferingFromReq)) {
    return userOfferingFromReq;
  } else {
    throw new Error(
      `El valor user_offering_id "${userOfferingFromReq}" no es válido.`
    );
  }
}

function checkUserDemandingId(userDemandingFromReq: any) {
  if (isValidId(userDemandingFromReq)) {
    return userDemandingFromReq;
  } else {
    throw new Error(
      `El valor user_demanding_id "${userDemandingFromReq}" no es válido.`
    );
  }
}

function checkPetId(petIdFromReq: any) {
  if (isValidId(petIdFromReq)) {
    return petIdFromReq;
  } else {
    throw new Error(`El pet id "${petIdFromReq}" no es válido.`);
  }
}

//! Tengo que mejorar esta validación! La dejo provisoria!!!!
function checkStatus(statusFromReq: any) {
  if (isValidId(statusFromReq)) {
    return statusFromReq;
  } else {
    throw new Error(`El status ingresado "${statusFromReq}" no es válido`);
  }
}

function checkUserOfferingCheck(userOfferingCheckFromReq: any) {
  if (isUndefinedOrNull(userOfferingCheckFromReq)) {
    return undefined;
  }
  if (isEmptyString(userOfferingCheckFromReq)) {
    return undefined;
  }
  if (isValidId(userOfferingCheckFromReq)) {
    return userOfferingCheckFromReq;
  }
  console.log(`Error en el checkUserOfferingCheck`);
  throw new Error(
    `El user_offering_check "${userOfferingCheckFromReq}"no es válido.`
  );
}

function checkUserDemandingCheck(userDemandingFromReq: any) {
  if (isUndefinedOrNull(userDemandingFromReq)) {
    return undefined;
  }
  if (isEmptyString(userDemandingFromReq)) {
    return undefined;
  }
  if (isValidId(userDemandingFromReq)) {
    return userDemandingFromReq;
  }
  console.log(`Error en el checkUserDemandingCheck`);
  throw new Error(
    `El user_offering_check "${userDemandingFromReq}"no es válido.`
  );
}
