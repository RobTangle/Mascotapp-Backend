"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNewComment = void 0;
const GenericValidators_1 = require("./GenericValidators");
function validateNewComment(reqBody) {
    try {
        let commentFromReqChecked = {
            nombre: checkNombre(reqBody.nombre),
            provincia: checkProvincia(reqBody.provincia),
            localidad: checkLocalidad(reqBody.localidad),
            fecha: checkFecha(reqBody.fecha),
            lugar: checkLugar(reqBody.lugar),
            condicion: checkCondicion(reqBody.condicion),
            comentarios: checkComentarios(reqBody.comentarios),
            hora: checkHora(reqBody.hora),
        };
        console.log(`Comentario validado!`);
        return commentFromReqChecked;
    }
    catch (error) {
        console.log(`Error al validar un nuevo comentario. ${error.message}`);
        return error.message;
    }
}
exports.validateNewComment = validateNewComment;
function checkHora(horaFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(horaFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isEmptyString)(horaFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isStringBetween1And101CharsLong)(horaFromReq)) {
        return horaFromReq;
    }
    console.log("Error en checkHora");
    throw new Error(`La hora ingresada "${horaFromReq}" no es válida.`);
}
function checkComentarios(comentariosFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(comentariosFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isEmptyString)(comentariosFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isString)(comentariosFromReq) && comentariosFromReq.length <= 1000) {
        return comentariosFromReq;
    }
    console.log(`Error en checkComentarios`);
    throw new Error("Error en checkComentarios. Ingrese un string entre 0 y 1000 caracteres.");
}
function checkCondicion(condicionFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(condicionFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isEmptyString)(condicionFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isStringBetween1And101CharsLong)(condicionFromReq)) {
        return condicionFromReq;
    }
    console.log(`Error en el checkCondicion.`);
    throw new Error(`Error al validar la condición de la mascota perdida`);
}
function checkLugar(lugarFromReq) {
    if ((0, GenericValidators_1.isStringBetween1And101CharsLong)(lugarFromReq)) {
        return lugarFromReq;
    }
    else {
        throw new Error(`Error al validar lugar. Ingrese una cadena de texto entre 1 y 100 caracteres de largo`);
    }
}
function checkNombre(nameFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(nameFromReq) || (0, GenericValidators_1.isEmptyString)(nameFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isStringBetween1And50CharsLong)(nameFromReq)) {
        return nameFromReq;
    }
    throw new Error(`El nombre ingresado "${nameFromReq}"no es válido`);
}
function checkProvincia(provinciaFromReq) {
    if ((0, GenericValidators_1.isStringBetween1And50CharsLong)(provinciaFromReq)) {
        return provinciaFromReq;
    }
    else {
        console.log(`Error al validar checkProvincia`);
        throw new Error(`La provincia ingresada no es válida. Ingrese una cadena de texto entre 1 y 50 caracteres.`);
    }
}
function checkLocalidad(localidadFromReq) {
    if ((0, GenericValidators_1.isStringBetween1And50CharsLong)(localidadFromReq)) {
        return localidadFromReq;
    }
    else {
        console.log(`Error al validar check localidad`);
        throw new Error(`La localidad ingresada no es válida. Ingrese una cadena de texto entre 1 y 50 caracteres.`);
    }
}
function checkFecha(fechaFromReq) {
    if ((0, GenericValidators_1.isStringBetween1And50CharsLong)(fechaFromReq)) {
        return fechaFromReq;
    }
    else {
        console.log(`Error al validar fecha`);
        throw new Error(`La fecha ingresada no es válida. Debe ser una cadena de texto entre 1 y 50 caracteres`);
    }
}
