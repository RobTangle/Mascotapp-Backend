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
exports.getAllPets = void 0;
const express_1 = require("express");
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../../models/index"));
const AnimalValidators_1 = require("../auxiliary/AnimalValidators");
const petTypes_1 = require("../types/petTypes");
// import { Ages, Genders, Pet, Species, Status } from "../types/petTypes";
const web_push_1 = __importDefault(require("../../config/web_push"));
const jwtMiddleware_1 = __importDefault(require("../../config/jwtMiddleware"));
const router = (0, express_1.Router)();
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
const getAllPets = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allPets = yield index_1.default.Animal.findAll();
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
            let petsInOffer = yield index_1.default.Animal.findAll({
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
function getPetById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`fn getById; id: ${id}`);
        try {
            let petFoundById = yield index_1.default.Animal.findByPk(id);
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
function getAllDogs() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entré a la fn getAllDogs");
        try {
            let allDogsFromDB = yield index_1.default.Animal.findAll({
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
function getAllCats() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entré a la fn getAllCats");
        try {
            let allCatsFromDB = yield index_1.default.Animal.findAll({
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
function getAllOtherSpecie() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entré a la fn getAllOtherSpecie");
        try {
            let allOtherSpeciesFromDB = yield index_1.default.Animal.findAll({
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
function getAllLost() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entré a la fn getAllLost");
        try {
            let allLostFromDB = yield index_1.default.Animal.findAll({
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
function getAllFound() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entré a la fn getAllFound");
        try {
            let allFoundFromDB = yield index_1.default.Animal.findAll({
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
function getAllInAdoption() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Entré a la ruta getAllInAdoption");
        try {
            let allInAdoptionFromDB = yield index_1.default.Animal.findAll({
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
function getAllBy(input) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`En la function getAllByNameOrRace`);
        try {
            const searchedPets = yield index_1.default.Animal.findAll({
                where: {
                    name: {
                        [sequelize_1.Op.iLike]: "%" + input + "%",
                    },
                },
            });
            const searchedPetsRace = yield index_1.default.Animal.findAll({
                where: {
                    race: {
                        [sequelize_1.Op.iLike]: "%" + input + "%",
                    },
                },
            });
            const searchedPetsSpecie = yield index_1.default.Animal.findAll({
                where: {
                    specie: {
                        [sequelize_1.Op.iLike]: "%" + input + "%",
                    },
                },
            });
            const searchedPetsGender = yield index_1.default.Animal.findAll({
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
function idExistsInDataBase(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Chequeando si existe el user.id "${id}" en la DB...`);
        try {
            let userInDataBase = yield index_1.default.User.findByPk(id);
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
// ----- ------ ------- RUTAS :  ------ ------- -------
// aca tiene que haber validador porque solo usuarios registrados pueden acceder a esta ruta
//POST A PET:
router.post("/postNewPet", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(`Entré a users/postnewpet`);
    try {
        const id = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.sub;
        if (!id) {
            throw new Error(`El Id de usuario es inválido/falso`);
        }
        if (id) {
            //chequear si existe este id de usuario registrado en la DB
            let userIsRegistered = yield idExistsInDataBase(id);
            if (!userIsRegistered) {
                throw new Error(`Usuario no registrado en la DataBase.`);
            }
            let validatedPet = (0, AnimalValidators_1.validateNewPet)(req.body.pet);
            console.log("SOY VALIDATED PET: ");
            console.log(validatedPet);
            let createdPet = yield index_1.default.Animal.create(validatedPet);
            //asociar createdPet con el userID:
            let associatedPetWithUser = yield createdPet.setUser(id);
            if (createdPet) {
                console.log(`Mascota creada con éxito y asociada al User con ${id}`);
                return res.status(200).send(associatedPetWithUser);
            }
            else {
                console.log(`createdPet es falsa... no se debe haber podido crear la el post new pet.`);
                return res.status(400).send({ msg: "No se pudo crear el post..." });
            }
        }
    }
    catch (error) {
        console.log(`Error en /postnewpet. ${error.message}`);
        console.log(`req.auth.sub de la request = '${(_b = req.auth) === null || _b === void 0 ? void 0 : _b.sub}'`);
        return res.status(404).send(error.message);
    }
}));
//PUT Update detalles de la mascota
router.put("/update", jwtMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    console.log(`Entré a pets/update`);
    console.log(`req.body = ${req.body}`);
    try {
        const userId = (_c = req.auth) === null || _c === void 0 ? void 0 : _c.sub;
        const { id } = req.body;
        console.log(`req.body.image = ${(_d = req.body) === null || _d === void 0 ? void 0 : _d.image}`);
        let validatedPetFromReq = (0, AnimalValidators_1.validateUpdatedPet)(req.body);
        const newProfile = yield index_1.default.Animal.update(validatedPetFromReq, {
            where: {
                id: id,
                UserId: userId,
            },
        });
        console.log(`Animal UPDATED. Datos de la mascota actualizada.`);
        return res.status(200).send(newProfile);
    }
    catch (error) {
        console.log(`Error en la ruta "/pets/update". ${error.message}`);
        return res.status(400).send(error.message);
    }
}));
// GET NUMBER OF PETS IN DB:
router.get("/numberOfPetsInDB", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("En route pets/numberOfPetsInDB");
    try {
        let numberOfPetsInDB = yield getNumberOfPetsInDB();
        let numberOfPetsInDBtoString = `${numberOfPetsInDB}`;
        return res.status(200).send(numberOfPetsInDBtoString);
    }
    catch (error) {
        return res.status(404).send(error.message);
    }
}));
//GET ALL SPECIES:
router.get("/especies", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("entré al GET pets/especies");
    try {
        let speciesArray = mapSpecies();
        console.log(`species Array = ${speciesArray}`);
        return res.status(200).send(speciesArray);
    }
    catch (error) {
        return res.status(404).send(error.message);
    }
}));
//GET ALL PETS:
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("entré al GET pets/ ");
    try {
        let allThePetsNotTransacted = yield getAllActivePets();
        // console.log(allThePets);
        return res.status(200).send(allThePetsNotTransacted);
    }
    catch (error) {
        return res.status(404).send(error.message);
    }
}));
//GET ALL DOGS
router.get("/perros", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré al GET pets/perros`);
    try {
        let dogsFromDB = yield getAllDogs();
        console.log(`dogsFromDB.length = ${dogsFromDB.length}`);
        let notTransactedDogs = excludePetsTransacted(dogsFromDB);
        return res.status(200).send(notTransactedDogs);
    }
    catch (error) {
        return res.status(404).send(error.message);
    }
}));
//GET ALL CATS
router.get("/gatos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré al GET pets/gatos`);
    try {
        let catsFromDB = yield getAllCats();
        console.log(`catsFromDB.length = ${catsFromDB.length}`);
        let notTransactedCats = excludePetsTransacted(catsFromDB);
        return res.status(200).send(notTransactedCats);
    }
    catch (error) {
        return res.status(404).send(error.message);
    }
}));
//GET ALL OTHER SPECIES
router.get("/otra", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré al GET pets/otra`);
    try {
        let otherSpeciesFromDB = yield getAllOtherSpecie();
        console.log(`otherSpeciesFromDB.length = ${otherSpeciesFromDB.length}`);
        let notTransactedOtherSpec = excludePetsTransacted(otherSpeciesFromDB);
        return res.status(200).send(notTransactedOtherSpec);
    }
    catch (error) {
        return res.status(404).send(error.message);
    }
}));
//GET ALL LOST
router.get("/perdido", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré al GET pets/perdido`);
    try {
        let allLostFromDB = yield getAllLost();
        console.log(`allLostFromDB.length = ${allLostFromDB.length}`);
        let notTransactedLostPets = excludePetsTransacted(allLostFromDB);
        return res.status(200).send(notTransactedLostPets);
    }
    catch (error) {
        return res.status(404).send(error.message);
    }
}));
//GET ALL FOUND
router.get("/encontrado", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré al GET pets/encontrado`);
    try {
        let allFoundFromDB = yield getAllFound();
        console.log(`allFoundFromDB.length = ${allFoundFromDB.length}`);
        let notTransactedFoundPets = excludePetsTransacted(allFoundFromDB);
        return res.status(200).send(notTransactedFoundPets);
    }
    catch (error) {
        return res.status(404).send(error.message);
    }
}));
//GET ALL IN ADOPTION
router.get("/adopcion", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré al GET pets/adopcion`);
    try {
        let allInAdoptionDB = yield getAllInAdoption();
        console.log(`allInAdoptionDB.length = ${allInAdoptionDB.length}`);
        let notTransactedInAdoptionPets = excludePetsTransacted(allInAdoptionDB);
        return res.status(200).send(notTransactedInAdoptionPets);
    }
    catch (error) {
        return res.status(404).send(error.message);
    }
}));
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré al GET pets/search`);
    try {
        const { input } = req.query;
        console.log(`input = ${input}`);
        let result = yield getAllBy(input);
        let notTransactedResultPets = excludePetsTransacted(result);
        return res.status(200).send(notTransactedResultPets);
    }
    catch (error) {
        console.log(`Hubo un error ruta GET pets/search. Error message: ${error.message}`);
        return error.message;
    }
}));
router.get("/success", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré al GET pets/success`);
    try {
        const pets = yield index_1.default.Animal.findAll({
            where: { postStatus: petTypes_1.postStatus.Success },
        });
        return res.send(pets);
    }
    catch (error) {
        console.log(`retornando error en GET pets/success ${error.message}`);
        return res.status(404).send(error.message);
    }
}));
router.get("/successAdoptions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré al GET pets/successAdoptions`);
    try {
        const pets = yield index_1.default.Animal.findAll({ where: { withNewOwner: "true" } });
        res.send(pets);
    }
    catch (error) {
        console.log(`retornando error en GET pets/successAdoptions ${error.message}`);
        return res.status(404).send(error.message);
    }
}));
router.get("/successFound", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré al GET pets/successFound`);
    try {
        const pets = yield index_1.default.Animal.findAll({
            where: { backWithItsOwner: "true" },
        });
        res.send(pets);
    }
    catch (error) {
        console.log(`retornando error en GET pets/successFound ${error.message}`);
        return res.status(404).send(error.message);
    }
}));
router.post("/subscribe", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a pets/subscribe`);
    try {
        const { subscription, id } = req.body;
        const string = JSON.stringify(subscription);
        const update = yield index_1.default.User.update({ endpoints: string }, { where: { id: id } });
        console.log("soy subscription y id ", subscription, id);
        return res.status(200).send("Subscripción creada correctamente");
    }
    catch (error) {
        console.log(`Error en pets/subscribe. ${error.message}`);
        return res.status(400).send(error.message);
    }
}));
router.post("/desubscribe", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("estoy en /desubscribe");
    try {
        const { id } = req.body;
        const usuario = yield index_1.default.User.update({ endpoints: null }, { where: { id: id } });
        console.log(`El endpoint del usuario con id ${id} ha sido seteado a null.`);
        res.status(200).send(`Subscripción borrada exitosamente ${usuario}`);
    }
    catch (error) {
        console.log("fallo /desubscribe");
        return res.status(400).send(error.message);
    }
}));
router.post("/notify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré en "/pets/notify"`);
    try {
        console.log(`req.body.name = ${req.body.name}`);
        console.log(`req.body.city = ${req.body.city}`);
        const { name, city } = req.body;
        const payload = {
            title: name,
            text: "Animal perdido por tu zona, ¿lo has visto?",
        };
        const string = JSON.stringify(payload);
        const allUsers = yield index_1.default.User.findAll();
        const cityUsers = yield allUsers.filter((e) => e.city == city);
        const endpointsArray = yield cityUsers.map((e) => e.endpoints);
        const endpointsPurgados = yield endpointsArray.filter((e) => e !== null);
        const endpointsParsed = yield endpointsPurgados.map((e) => JSON.parse(e));
        endpointsParsed.map((s) => web_push_1.default.sendNotification(s, string));
        console.log(`al final de /notify...`);
        res.status(200).json();
    }
    catch (error) {
        console.log(`Error en users/notify. ${error.message}`);
    }
}));
//GET BY ID:
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    console.log(`Entré al GET pets/:id con params.id = ${(_e = req === null || req === void 0 ? void 0 : req.params) === null || _e === void 0 ? void 0 : _e.id}`);
    try {
        let paramsID = req.params.id;
        let petFoundById = yield getPetById(paramsID);
        return res.status(200).send(petFoundById);
    }
    catch (error) {
        console.log(`retornando error en GET pets/:id: ${error.message}`);
        return res.status(404).send(error.message);
    }
}));
exports.default = router;
