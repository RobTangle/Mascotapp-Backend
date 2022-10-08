"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFullName = exports.checkThumbnail = exports.checkAditionalContactInfo = exports.checkEmail = exports.checkValidEmail = exports.checkCity = exports.checkUserName = exports.checkUserId = exports.validateNewUser = void 0;
const GenericValidators_1 = require("./GenericValidators");
function validateNewUser(newUserFromReq) {
    try {
        let userFromReqChecked = {
            id: checkUserId(newUserFromReq.id),
            email: checkValidEmail(newUserFromReq.email),
            name: checkUserName(newUserFromReq),
            city: checkCity(newUserFromReq.city),
            contact: checkAditionalContactInfo(newUserFromReq.contact),
            image: checkThumbnail(newUserFromReq.image),
            linkToDonate: newUserFromReq.linkToDonate, //VALIDAR ESTO.
        };
        return userFromReqChecked;
    }
    catch (error) {
        throw new Error(error.message);
    }
}
exports.validateNewUser = validateNewUser;
//CHECK USER ID
function checkUserId(idFromReq) {
    if ((0, GenericValidators_1.isStringBetween1And101CharsLong)(idFromReq)) {
        return idFromReq;
    }
    throw new Error(`El id ingresado "${idFromReq} no es un ID válido."`);
}
exports.checkUserId = checkUserId;
//CHECK USER NAME
function checkUserName(nameFromReq) {
    if ((0, GenericValidators_1.isStringBetween1And50CharsLong)(nameFromReq)) {
        return nameFromReq;
    }
    throw new Error(`El nombre ingresado "${nameFromReq}" no es válido.`);
}
exports.checkUserName = checkUserName;
//CHECK CITY
function checkCity(contactFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(contactFromReq) || (0, GenericValidators_1.isEmptyString)(contactFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isStringBetween1And101CharsLong)(contactFromReq)) {
        return contactFromReq;
    }
    throw new Error(`La ciudad ingresada "${contactFromReq}" no es válida.`);
}
exports.checkCity = checkCity;
//CHECK VALID EMAIL
function checkValidEmail(emailFromReq) {
    if (!(0, GenericValidators_1.isEmail)(emailFromReq)) {
        throw new Error(`El email ingresado "${emailFromReq}" no es válido.`);
    }
    return emailFromReq;
}
exports.checkValidEmail = checkValidEmail;
//CHECK EMAIL STRING | UNDEFINED
function checkEmail(emailFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(emailFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isEmail)(emailFromReq)) {
        return emailFromReq;
    }
    throw new Error(`El email ingresado "${emailFromReq}" no es un email válido para el registro.`);
}
exports.checkEmail = checkEmail;
//CHECK aditionalContactInfo
function checkAditionalContactInfo(aditionalContactInfoFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(aditionalContactInfoFromReq) ||
        (0, GenericValidators_1.isEmptyString)(aditionalContactInfoFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isStringBetween1And101CharsLong)(aditionalContactInfoFromReq)) {
        return aditionalContactInfoFromReq;
    }
    throw new Error(`La información de contacto adicional ingresada "${aditionalContactInfoFromReq}" no es válida. Por favor, o deje el input completamente vacío o ingrese una cadena de texto válida.`);
}
exports.checkAditionalContactInfo = checkAditionalContactInfo;
//CHECK THUMBNAIL / IMAGE:
function checkThumbnail(thumbnailFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(thumbnailFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isString)(thumbnailFromReq)) {
        return thumbnailFromReq;
    }
    throw new Error(`El thumbnail no es válido. Por favor, ingrese una cadena de texto, o deje el input completamente vacío.`);
}
exports.checkThumbnail = checkThumbnail;
//! HACER EN FUTURO PRÓXIMO:
// export function hasAnIlegalURL (argumento:any):boolean {
// }
// -------  EN DESUSO : -------------
// Check givenName + familyName:
function checkFullName(givenName, familyName) {
    let namesConcatenated = `${givenName} ${familyName}`;
    if ((0, GenericValidators_1.isUndefinedOrNull)(namesConcatenated)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isStringBetween1And101CharsLong)(namesConcatenated)) {
        return namesConcatenated;
    }
    throw new Error(`El nombre completo "${namesConcatenated}" no es un nombre válido. Debe tener un máximo de 100 characteres y ser una cadena de texto.`);
}
exports.checkFullName = checkFullName;
