"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidId = exports.isUndefinedOrNull = exports.isStringBetween1And50CharsLong = exports.isStringBetween1And101CharsLong = exports.isEmptyString = exports.isValidString = exports.isString = exports.isEmail = exports.isValidURL = void 0;
// IS VALID URL:
function isValidURL(argumento) {
    if (typeof argumento !== "string") {
        return false;
    }
    return (argumento.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) !==
        null);
}
exports.isValidURL = isValidURL;
//IS EMAIL:
function isEmail(argumento) {
    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])");
    return regex.test(argumento);
}
exports.isEmail = isEmail;
// IS STRING:
function isString(argumento) {
    if (typeof argumento !== "string") {
        return false;
    }
    return true;
}
exports.isString = isString;
// IS VALID STRING:
function isValidString(argumento) {
    if (typeof argumento === "string" && argumento.length > 0) {
        return true;
    }
    else {
        return false;
    }
}
exports.isValidString = isValidString;
// IS EMPTY STRING:
function isEmptyString(argumento) {
    if (typeof argumento === "string" && argumento.length === 0) {
        return true;
    }
    else {
        return false;
    }
}
exports.isEmptyString = isEmptyString;
// funcion auxiliar para chequear strings y su largo
function isStringBetween1And101CharsLong(argumento) {
    if (typeof argumento === "string" &&
        argumento.length >= 1 &&
        argumento.length <= 100) {
        return true;
    }
    return false;
}
exports.isStringBetween1And101CharsLong = isStringBetween1And101CharsLong;
function isStringBetween1And50CharsLong(argumento) {
    if (typeof argumento === "string" &&
        argumento.length > 0 &&
        argumento.length <= 50) {
        return true;
    }
    else {
        return false;
    }
}
exports.isStringBetween1And50CharsLong = isStringBetween1And50CharsLong;
// is UNDEFINEDorNULL:
function isUndefinedOrNull(argumento) {
    if (argumento === undefined || argumento === null) {
        return true;
    }
    return false;
}
exports.isUndefinedOrNull = isUndefinedOrNull;
// IS VALID ID
function isValidId(argumento) {
    if (typeof argumento === "string" &&
        argumento.length >= 1 &&
        argumento.length <= 50) {
        return true;
    }
    return false;
}
exports.isValidId = isValidId;
