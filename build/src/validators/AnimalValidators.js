"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkId = exports.checkName = exports.checkComments = exports.checkImageURL = exports.checkVaccinationSchemeStatus = exports.checkRace = exports.checkAge = exports.checkGender = exports.checkStatus = exports.checkSpecies = exports.validateUpdatedPet = exports.validateNewPet = void 0;
const petTypes_1 = require("../types/petTypes");
const GenericValidators_1 = require("./GenericValidators");
//! VALIDAR TODO EL PET ENTERO:
// SI HAY UN ERROR, DEVOLVER UN ERROR.
// SI ESTÁ TODO OK, DEVOLVER EL OBJETO VALIDADO (pet nueva a crear)
function validateNewPet(reqBody) {
    try {
        let petFromReqChecked = {
            id: checkId(reqBody.id),
            name: checkName(reqBody.name),
            specie: checkSpecies(reqBody.specie),
            race: checkRace(reqBody.race),
            city: reqBody.city,
            age: checkAge(reqBody.age),
            gender: checkGender(reqBody.gender),
            status: checkStatus(reqBody.status),
            vaccinationSchemeStatus: checkVaccinationSchemeStatus(reqBody.vaccinationSchemeStatus),
            image: checkImageURL(reqBody.image),
            backWithItsOwner: undefined,
            withNewOwner: undefined,
            comments: checkComments(reqBody.comments),
            postStatus: petTypes_1.postStatus.Active,
        };
        return petFromReqChecked;
    }
    catch (error) {
        throw new Error(`${error.message}`);
    }
}
exports.validateNewPet = validateNewPet;
function validateUpdatedPet(petFromReq) {
    console.log(`Validando el pet por req para el update de la pet`);
    try {
        let updatedPet = {
            name: checkName(petFromReq.name),
            specie: checkSpecies(petFromReq.specie),
            race: checkRace(petFromReq.race),
            city: checkCity(petFromReq.city),
            age: checkAge(petFromReq.age),
            gender: checkGender(petFromReq.gender),
            status: checkStatus(petFromReq.status),
            vaccinationSchemeStatus: checkVaccinationSchemeStatus(petFromReq.vaccinationSchemeStatus),
            image: checkImageURL(petFromReq.image),
            comments: checkComments(petFromReq.comments),
        };
        return updatedPet;
    }
    catch (error) {
        console.log(`Error en function validateUpdatedPet. ${error.message}`);
        throw new Error(`${error.message}`);
    }
}
exports.validateUpdatedPet = validateUpdatedPet;
//! FUNCIONES VALIDADORAS DE PROPIEDADES que usa la función validateNewPet:
function checkCity(cityFromReq) {
    try {
        if ((0, GenericValidators_1.isUndefinedOrNull)(cityFromReq) || (0, GenericValidators_1.isEmptyString)(cityFromReq)) {
            return undefined;
        }
        if ((0, GenericValidators_1.isStringBetween1And101CharsLong)(cityFromReq)) {
            return cityFromReq;
        }
        throw new Error(`Error al validar la ciudad.`);
    }
    catch (error) {
        console.log(`Error en function checkCity. ${error.message}`);
        throw new Error(`${error.message}`);
    }
}
function isPostStatus(arg) {
    return Object.values(petTypes_1.postStatus).includes(arg);
}
function checkPostStatus(argumento) {
    if (!isPostStatus(argumento)) {
        throw new Error(`El postStatus ingrensado "${argumento}" no es válido.`);
    }
    else {
        return argumento;
    }
}
//------- function de prueba para //! SPECIE:
function isSpecies(argumento) {
    return Object.values(petTypes_1.Species).includes(argumento);
}
function checkSpecies(speciesFromReq) {
    if (!isSpecies(speciesFromReq)) {
        throw new Error(`La especie introducida "${speciesFromReq}" no es válida.`);
    }
    return speciesFromReq;
}
exports.checkSpecies = checkSpecies;
//-----funciones de chequeo de //! STATUS:
function isStatus(argumento) {
    return Object.values(petTypes_1.Status).includes(argumento);
}
function checkStatus(statusFromReq) {
    if (!isStatus(statusFromReq)) {
        throw new Error(`El status ingresado "${statusFromReq}" es inválido`);
    }
    return statusFromReq;
}
exports.checkStatus = checkStatus;
// OK ------ funciones de chequeo de gender:
function isGender(argumento) {
    return Object.values(petTypes_1.Genders).includes(argumento);
}
function checkGender(genderFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(genderFromReq)) {
        return undefined;
    }
    if (isGender(genderFromReq)) {
        return genderFromReq;
    }
    throw new Error(`El género ingresado "${genderFromReq}" es inválido`);
}
exports.checkGender = checkGender;
//-----funciones de chequeo de age:
function isAge(argumento) {
    return Object.values(petTypes_1.Ages).includes(argumento);
}
function checkAge(ageFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(ageFromReq)) {
        return undefined;
    }
    if (isAge(ageFromReq)) {
        return ageFromReq;
    }
    throw new Error(`La edad/age ingresada "${ageFromReq}" es inválido`);
}
exports.checkAge = checkAge;
//-----funciones de chequeo de race:
function checkRace(raceFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(raceFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isStringBetween1And101CharsLong)(raceFromReq)) {
        return raceFromReq;
    }
    throw new Error(`La raza/race ingresada "${raceFromReq} no es válida.`);
}
exports.checkRace = checkRace;
//----- funciones de chequeo de vaccinationSchemeStatus:
function isVaccSchemeStatus(argumento) {
    return Object.values(petTypes_1.VaccinationStatus).includes(argumento);
}
// CHECK VACCINATION SCHEME STATUS:
function checkVaccinationSchemeStatus(vaccSchStatusFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(vaccSchStatusFromReq)) {
        return undefined;
    }
    if (isVaccSchemeStatus(vaccSchStatusFromReq)) {
        return vaccSchStatusFromReq;
    }
    throw new Error(`Los datos de esquema de vacunación "${vaccSchStatusFromReq}" ingresados no son válidos.`);
}
exports.checkVaccinationSchemeStatus = checkVaccinationSchemeStatus;
// CHECK IMAGE URL:
function checkImageURL(imageFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(imageFromReq) || (0, GenericValidators_1.isEmptyString)(imageFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isValidURL)(imageFromReq)) {
        return imageFromReq;
    }
    throw new Error(`la URL de imagen ingresada "${imageFromReq}" no es válida`);
}
exports.checkImageURL = checkImageURL;
// CHECK COMMENTS:
function checkComments(commentsFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(commentsFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isEmptyString)(commentsFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isString)(commentsFromReq) &&
        commentsFromReq.length >= 1 &&
        commentsFromReq.length < 3001) {
        return commentsFromReq;
    }
    throw new Error(`El comentario ingresado no es válido. Ingrese únicamente texto de entre 1 y 3000 caracteres de largo.`);
}
exports.checkComments = checkComments;
// CHECK NAME:
function checkName(nameFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(nameFromReq) || (0, GenericValidators_1.isEmptyString)(nameFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isStringBetween1And50CharsLong)(nameFromReq)) {
        return nameFromReq;
    }
    throw new Error(`El nombre/name ingresado "${nameFromReq}" no es válido`);
}
exports.checkName = checkName;
// CHECK ID:
function checkId(idFromReq) {
    if ((0, GenericValidators_1.isUndefinedOrNull)(idFromReq)) {
        return undefined;
    }
    if ((0, GenericValidators_1.isValidId)(idFromReq)) {
        return idFromReq;
    }
    throw new Error(`El id ingresado "${idFromReq}" no es válido.`);
}
exports.checkId = checkId;
