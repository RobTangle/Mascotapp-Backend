"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeID = exports.sanitize = exports.isValidId = exports.isUndefinedOrNull = exports.isStringBetween1And50CharsLong = exports.isStringBetween1And101CharsLong = exports.isEmptyString = exports.isValidString = exports.isString = exports.isEmail = exports.isValidURLImage = void 0;
// IS VALID URL:
function isValidURLImage(argumento) {
    if (typeof argumento !== "string") {
        return false;
    }
    return (argumento.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) !==
        null);
}
exports.isValidURLImage = isValidURLImage;
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
// SANITIZE STRING TO PROTECT HTML CODE
function sanitize(string) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;",
    };
    const reg = /[&<>"'/]/gi;
    return string.replace(reg, (match) => map[match]);
}
exports.sanitize = sanitize;
function sanitizeID(string) {
    if (typeof string !== "string") {
        console.log(`Error en sanitizeID. El typeof del id no es un string.`);
        throw new Error("El id debe ser un string.");
    }
    if (string.length > 50) {
        console.log("Error en sanitizeID. El string es demasiado largo.");
        throw new Error("El id es demasiado largo.");
    }
    const map = {
        "{": "",
        "}": "",
        "<": "",
        ">": "",
        "/": "",
        ".": "",
        ",": "",
        $: "",
        "%": "",
        "(": "",
        ")": "",
        "!": "",
        "|": "",
        "[": "",
        "]": "",
        "´": "",
        "`": "",
        "&": "",
        "'": "",
    };
    const reg = /[&<>'{},.$%()!´`\[\]/]/gi;
    return string.replace(reg, (match) => map[match]);
}
exports.sanitizeID = sanitizeID;
