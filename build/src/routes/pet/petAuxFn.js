"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idExistsInDataBase = exports.getAllBy = exports.getAllInAdoption = exports.getAllFound = exports.getAllLost = exports.getAllOtherSpecie = exports.getAllCats = exports.getAllDogs = exports.getPetById = exports.getNumberOfPetsInDB = exports.excludePetsTransacted = exports.getAllActivePets = exports.getAllPets = exports.mapSpecies = void 0;
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../../../models"));
const petTypes_1 = require("../../types/petTypes");
// ----- ------ ------ FUNCIONES AUXILIARES PARA LAS RUTAS: ------- -------- --------
function mapSpecies() {
    try {
        let speciesArray = Object.values(petTypes_1.Species);
        return speciesArray;
    }
    catch (error) {
        console.log(`Error en fn mapSpecies(). Error message: ${error.message}`);
        return error.message;
    }
}
exports.mapSpecies = mapSpecies;
const getAllPets = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allPets = yield models_1.default.Animal.findAll();
        // console.log(allPets);
        return allPets;
    }
    catch (error) {
        console.log(error.message);
        return error;
    }
});
exports.getAllPets = getAllPets;
function getAllActivePets() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let petsInOffer = yield models_1.default.Animal.findAll({
                where: {
                    postStatus: "activo",
                },
            });
            return petsInOffer;
        }
        catch (error) {
            return error.message;
        }
    });
}
exports.getAllActivePets = getAllActivePets;
function excludePetsTransacted(array) {
    console.log(`Excluyendo mascotas que han sido transacted...`);
    try {
        let filteredArray = array.filter((pet) => pet.postStatus === "activo");
        return filteredArray;
    }
    catch (error) {
        return error.message;
    }
}
exports.excludePetsTransacted = excludePetsTransacted;
function getNumberOfPetsInDB() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("En la fn getNumberOfPetsInDB");
        try {
            let allPetsInDB = yield (0, exports.getAllPets)();
            let numberOfPetsInDB = allPetsInDB.length;
            console.log(`numberOfPetsInDB: ${numberOfPetsInDB}`);
            return numberOfPetsInDB;
        }
        catch (error) {
            console.log(`Error en la function getNumberOfPetsInDB. Error message: ${error.message}`);
            return error.message;
        }
    });
}
exports.getNumberOfPetsInDB = getNumberOfPetsInDB;
function getPetById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`fn getById; id: ${id}`);
        try {
            let petFoundById = yield models_1.default.Animal.findByPk(id);
            console.log(`petFoundById: ${petFoundById}`);
            console.log(`${petFoundById === null || petFoundById === void 0 ? void 0 : petFoundById.name}`);
            return petFoundById;
        }
        catch (error) {
            console.log(`Error en la function getPetById. Error message: ${error.message}`);
            return error.message;
        }
    });
}
exports.getPetById = getPetById;
function getAllDogs() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entré a la fn getAllDogs");
        try {
            let allDogsFromDB = yield models_1.default.Animal.findAll({
                where: {
                    specie: "perro",
                },
            });
            console.log(`length de allDogsFromDB: ${allDogsFromDB.length}`);
            return allDogsFromDB;
        }
        catch (error) {
            console.log(`Error en la function getAllDogs. Error: ${error.message}`);
            return error.message;
        }
    });
}
exports.getAllDogs = getAllDogs;
function getAllCats() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entré a la fn getAllCats");
        try {
            let allCatsFromDB = yield models_1.default.Animal.findAll({
                where: {
                    specie: "gato",
                },
            });
            console.log(`length de allCatsFromDB: ${allCatsFromDB.length}`);
            return allCatsFromDB;
        }
        catch (error) {
            console.log(`Error en la function getAllCats. Error message: ${error.message}`);
            return error.message;
        }
    });
}
exports.getAllCats = getAllCats;
function getAllOtherSpecie() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entré a la fn getAllOtherSpecie");
        try {
            let allOtherSpeciesFromDB = yield models_1.default.Animal.findAll({
                where: {
                    specie: "otra especie",
                },
            });
            console.log(`length de allOtherSpeciesFromDB: ${allOtherSpeciesFromDB.length}`);
            return allOtherSpeciesFromDB;
        }
        catch (error) {
            console.log(`Error en la function getAllOtherSpecie. Error message: ${error.message}`);
            return error.message;
        }
    });
}
exports.getAllOtherSpecie = getAllOtherSpecie;
function getAllLost() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entré a la fn getAllLost");
        try {
            let allLostFromDB = yield models_1.default.Animal.findAll({
                where: {
                    status: "perdido",
                },
            });
            console.log(`length de allLostFromDB: ${allLostFromDB.length}`);
            return allLostFromDB;
        }
        catch (error) {
            console.log(`Error en la function getAllLost. Error message: ${error.message}`);
            return error.message;
        }
    });
}
exports.getAllLost = getAllLost;
function getAllFound() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entré a la fn getAllFound");
        try {
            let allFoundFromDB = yield models_1.default.Animal.findAll({
                where: {
                    status: "encontrado",
                },
            });
            console.log(`length de allFoundFromDB: ${allFoundFromDB.length}`);
            return allFoundFromDB;
        }
        catch (error) {
            console.log(`Error en la function getAllFound. Error message: ${error.message}`);
            return error.message;
        }
    });
}
exports.getAllFound = getAllFound;
function getAllInAdoption() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Entré a la ruta getAllInAdoption");
        try {
            let allInAdoptionFromDB = yield models_1.default.Animal.findAll({
                where: {
                    status: "en adopción",
                },
            });
            console.log(`length de allFoundFromDB: ${allInAdoptionFromDB.length}`);
            return allInAdoptionFromDB;
        }
        catch (error) {
            console.log(`Error en la function getAllInAdoption. Error message: ${error.message}`);
            return error.message;
        }
    });
}
exports.getAllInAdoption = getAllInAdoption;
function getAllBy(input) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`En la function getAllByNameOrRace`);
        try {
            const searchedPets = yield models_1.default.Animal.findAll({
                where: {
                    name: {
                        [sequelize_1.Op.iLike]: "%" + input + "%",
                    },
                },
            });
            const searchedPetsRace = yield models_1.default.Animal.findAll({
                where: {
                    race: {
                        [sequelize_1.Op.iLike]: "%" + input + "%",
                    },
                },
            });
            const searchedPetsSpecie = yield models_1.default.Animal.findAll({
                where: {
                    specie: {
                        [sequelize_1.Op.iLike]: "%" + input + "%",
                    },
                },
            });
            const searchedPetsGender = yield models_1.default.Animal.findAll({
                where: {
                    gender: {
                        [sequelize_1.Op.iLike]: "%" + input + "%",
                    },
                },
            });
            const allPets = [
                ...searchedPets,
                ...searchedPetsGender,
                ...searchedPetsRace,
                ...searchedPetsSpecie,
            ];
            return allPets;
        }
        catch (error) {
            console.log(`Error en la function getAllByNameOrRace. Error message: ${error.message}`);
            return error.message;
        }
    });
}
exports.getAllBy = getAllBy;
function idExistsInDataBase(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Chequeando si existe el user.id "${id}" en la DB...`);
        try {
            let userInDataBase = yield models_1.default.User.findByPk(id);
            if (userInDataBase) {
                console.log(`Usuario con id ${id} encontrado en la DB`);
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.log(`Error en function idExistsInDataBase. ${error.message}`);
            return error.message;
        }
    });
}
exports.idExistsInDataBase = idExistsInDataBase;
