import { INewUser } from "../types/userTypes";
import {
  isEmail,
  isEmptyString,
  isUndefinedOrNull,
  isStringBetween1And101CharsLong,
  isString,
  isStringBetween1And50CharsLong,
} from "./GenericValidators";

export function validateNewUser(newUserFromReq: INewUser): INewUser {
  try {
    let userFromReqChecked: INewUser = {
      id: checkUserId(newUserFromReq.id),
      email: checkValidEmail(newUserFromReq.email),
      name: checkUserName(newUserFromReq.name),
      city: checkCity(newUserFromReq.city),
      contact: checkAditionalContactInfo(newUserFromReq.contact),
      image: checkThumbnail(newUserFromReq.image),
      linkToDonate: newUserFromReq.linkToDonate, //VALIDAR ESTO.
    };
    return userFromReqChecked;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

//CHECK USER ID
export function checkUserId(idFromReq: any): string {
  if (isStringBetween1And101CharsLong(idFromReq)) {
    return idFromReq;
  }
  throw new Error(`El id ingresado "${idFromReq} no es un ID válido."`);
}

//CHECK USER NAME
export function checkUserName(nameFromReq: any): string {
  if (isStringBetween1And50CharsLong(nameFromReq)) {
    return nameFromReq;
  }
  throw new Error(`El nombre ingresado "${nameFromReq}" no es válido.`);
}

//CHECK CITY
export function checkCity(contactFromReq: any): string | undefined {
  if (isUndefinedOrNull(contactFromReq) || isEmptyString(contactFromReq)) {
    return undefined;
  }
  if (isStringBetween1And101CharsLong(contactFromReq)) {
    return contactFromReq;
  }
  throw new Error(`La ciudad ingresada "${contactFromReq}" no es válida.`);
}

//CHECK VALID EMAIL
export function checkValidEmail(emailFromReq: any): string {
  if (!isEmail(emailFromReq)) {
    throw new Error(`El email ingresado "${emailFromReq}" no es válido.`);
  }
  return emailFromReq;
}

//CHECK EMAIL STRING | UNDEFINED
export function checkEmail(emailFromReq: any): string | undefined {
  if (isUndefinedOrNull(emailFromReq)) {
    return undefined;
  }
  if (isEmail(emailFromReq)) {
    return emailFromReq;
  }
  throw new Error(
    `El email ingresado "${emailFromReq}" no es un email válido para el registro.`
  );
}

//CHECK aditionalContactInfo
export function checkAditionalContactInfo(
  aditionalContactInfoFromReq: any
): string | undefined {
  if (
    isUndefinedOrNull(aditionalContactInfoFromReq) ||
    isEmptyString(aditionalContactInfoFromReq)
  ) {
    return undefined;
  }
  if (isStringBetween1And101CharsLong(aditionalContactInfoFromReq)) {
    return aditionalContactInfoFromReq;
  }
  throw new Error(
    `La información de contacto adicional ingresada "${aditionalContactInfoFromReq}" no es válida. Por favor, o deje el input completamente vacío o ingrese una cadena de texto válida.`
  );
}

//CHECK THUMBNAIL / IMAGE:
export function checkThumbnail(thumbnailFromReq: any): string | undefined {
  if (isUndefinedOrNull(thumbnailFromReq)) {
    return undefined;
  }
  if (isString(thumbnailFromReq)) {
    return thumbnailFromReq;
  }
  throw new Error(
    `El thumbnail no es válido. Por favor, ingrese una cadena de texto, o deje el input completamente vacío.`
  );
}

//! HACER EN FUTURO PRÓXIMO:
// export function hasAnIlegalURL (argumento:any):boolean {
// }

// -------  EN DESUSO : -------------

// Check givenName + familyName:
export function checkFullName(
  givenName: any,
  familyName: any
): string | undefined {
  let namesConcatenated = `${givenName} ${familyName}`;
  if (isUndefinedOrNull(namesConcatenated)) {
    return undefined;
  }
  if (isStringBetween1And101CharsLong(namesConcatenated)) {
    return namesConcatenated;
  }
  throw new Error(
    `El nombre completo "${namesConcatenated}" no es un nombre válido. Debe tener un máximo de 100 characteres y ser una cadena de texto.`
  );
}
