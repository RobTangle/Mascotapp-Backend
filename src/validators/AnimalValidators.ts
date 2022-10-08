import {
  Ages,
  Genders,
  Pet,
  postStatus,
  Species,
  Status,
  VaccinationStatus,
  updatedPet,
} from "../types/petTypes";
import {
  isString,
  isStringBetween1And101CharsLong,
  isUndefinedOrNull,
  isValidId,
  isValidURL,
  isEmptyString,
  isStringBetween1And50CharsLong,
} from "./GenericValidators";

//! VALIDAR TODO EL PET ENTERO:
// SI HAY UN ERROR, DEVOLVER UN ERROR.
// SI ESTÁ TODO OK, DEVOLVER EL OBJETO VALIDADO (pet nueva a crear)

export function validateNewPet(reqBody: any): Pet {
  try {
    let petFromReqChecked: Pet = {
      id: checkId(reqBody.id),
      name: checkName(reqBody.name),
      specie: checkSpecies(reqBody.specie),
      race: checkRace(reqBody.race),
      city: reqBody.city,
      age: checkAge(reqBody.age),
      gender: checkGender(reqBody.gender),
      status: checkStatus(reqBody.status),
      vaccinationSchemeStatus: checkVaccinationSchemeStatus(
        reqBody.vaccinationSchemeStatus
      ),
      image: checkImageURL(reqBody.image),
      backWithItsOwner: undefined,
      withNewOwner: undefined,
      comments: checkComments(reqBody.comments),
      postStatus: postStatus.Active,
    };
    return petFromReqChecked;
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}

export function validateUpdatedPet(petFromReq: any): updatedPet {
  console.log(`Validando el pet por req para el update de la pet`);
  try {
    let updatedPet: updatedPet = {
      name: checkName(petFromReq.name),
      specie: checkSpecies(petFromReq.specie),
      race: checkRace(petFromReq.race),
      city: checkCity(petFromReq.city),
      age: checkAge(petFromReq.age),
      gender: checkGender(petFromReq.gender),
      status: checkStatus(petFromReq.status),
      vaccinationSchemeStatus: checkVaccinationSchemeStatus(
        petFromReq.vaccinationSchemeStatus
      ),
      image: checkImageURL(petFromReq.image),
      comments: checkComments(petFromReq.comments),
    };

    return updatedPet;
  } catch (error: any) {
    console.log(`Error en function validateUpdatedPet. ${error.message}`);
    throw new Error(`${error.message}`);
  }
}

//! FUNCIONES VALIDADORAS DE PROPIEDADES que usa la función validateNewPet:

function checkCity(cityFromReq: any): string | undefined {
  try {
    if (isUndefinedOrNull(cityFromReq) || isEmptyString(cityFromReq)) {
      return undefined;
    }
    if (isStringBetween1And101CharsLong(cityFromReq)) {
      return cityFromReq;
    }
    throw new Error(`Error al validar la ciudad.`);
  } catch (error: any) {
    console.log(`Error en function checkCity. ${error.message}`);
    throw new Error(`${error.message}`);
  }
}

function isPostStatus(arg: any): boolean {
  return Object.values(postStatus).includes(arg);
}

function checkPostStatus(argumento: any): postStatus {
  if (!isPostStatus(argumento)) {
    throw new Error(`El postStatus ingrensado "${argumento}" no es válido.`);
  } else {
    return argumento;
  }
}

//------- function de prueba para //! SPECIE:
function isSpecies(argumento: any): boolean {
  return Object.values(Species).includes(argumento);
}
export function checkSpecies(speciesFromReq: any): Species {
  if (!isSpecies(speciesFromReq)) {
    throw new Error(`La especie introducida "${speciesFromReq}" no es válida.`);
  }
  return speciesFromReq;
}

//-----funciones de chequeo de //! STATUS:
function isStatus(argumento: any): boolean {
  return Object.values(Status).includes(argumento);
}
export function checkStatus(statusFromReq: any): Status {
  if (!isStatus(statusFromReq)) {
    throw new Error(`El status ingresado "${statusFromReq}" es inválido`);
  }
  return statusFromReq;
}

// OK ------ funciones de chequeo de gender:
function isGender(argumento: any): boolean {
  return Object.values(Genders).includes(argumento);
}
export function checkGender(genderFromReq: any): Genders | undefined {
  if (isUndefinedOrNull(genderFromReq)) {
    return undefined;
  }
  if (isGender(genderFromReq)) {
    return genderFromReq;
  }
  throw new Error(`El género ingresado "${genderFromReq}" es inválido`);
}

//-----funciones de chequeo de age:
function isAge(argumento: any): boolean {
  return Object.values(Ages).includes(argumento);
}

export function checkAge(ageFromReq: any): Ages | undefined {
  if (isUndefinedOrNull(ageFromReq)) {
    return undefined;
  }
  if (isAge(ageFromReq)) {
    return ageFromReq;
  }
  throw new Error(`La edad/age ingresada "${ageFromReq}" es inválido`);
}

//-----funciones de chequeo de race:
export function checkRace(raceFromReq: any): string | undefined {
  if (isUndefinedOrNull(raceFromReq)) {
    return undefined;
  }
  if (isStringBetween1And101CharsLong(raceFromReq)) {
    return raceFromReq;
  }
  throw new Error(`La raza/race ingresada "${raceFromReq} no es válida.`);
}

//----- funciones de chequeo de vaccinationSchemeStatus:
function isVaccSchemeStatus(argumento: any): boolean {
  return Object.values(VaccinationStatus).includes(argumento);
}

// CHECK VACCINATION SCHEME STATUS:
export function checkVaccinationSchemeStatus(
  vaccSchStatusFromReq: any
): VaccinationStatus | undefined {
  if (isUndefinedOrNull(vaccSchStatusFromReq)) {
    return undefined;
  }
  if (isVaccSchemeStatus(vaccSchStatusFromReq)) {
    return vaccSchStatusFromReq;
  }
  throw new Error(
    `Los datos de esquema de vacunación "${vaccSchStatusFromReq}" ingresados no son válidos.`
  );
}

// CHECK IMAGE URL:
export function checkImageURL(imageFromReq: any): string | undefined {
  if (isUndefinedOrNull(imageFromReq) || isEmptyString(imageFromReq)) {
    return undefined;
  }
  if (isValidURL(imageFromReq)) {
    return imageFromReq;
  }
  throw new Error(`la URL de imagen ingresada "${imageFromReq}" no es válida`);
}

// CHECK COMMENTS:
export function checkComments(commentsFromReq: any): string | undefined {
  if (isUndefinedOrNull(commentsFromReq)) {
    return undefined;
  }
  if (isEmptyString(commentsFromReq)) {
    return undefined;
  }
  if (
    isString(commentsFromReq) &&
    commentsFromReq.length >= 1 &&
    commentsFromReq.length < 3001
  ) {
    return commentsFromReq;
  }
  throw new Error(
    `El comentario ingresado no es válido. Ingrese únicamente texto de entre 1 y 3000 caracteres de largo.`
  );
}

// CHECK NAME:
export function checkName(nameFromReq: any): string | undefined {
  if (isUndefinedOrNull(nameFromReq) || isEmptyString(nameFromReq)) {
    return undefined;
  }
  if (isStringBetween1And50CharsLong(nameFromReq)) {
    return nameFromReq;
  }
  throw new Error(`El nombre/name ingresado "${nameFromReq}" no es válido`);
}

// CHECK ID:
export function checkId(idFromReq: any): string | undefined {
  if (isUndefinedOrNull(idFromReq)) {
    return undefined;
  }
  if (isValidId(idFromReq)) {
    return idFromReq;
  }
  throw new Error(`El id ingresado "${idFromReq}" no es válido.`);
}
