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
const express_1 = require("express");
const index_1 = __importDefault(require("../../../models/index"));
const AnimalValidators_1 = require("../../validators/AnimalValidators");
const petTypes_1 = require("../../types/petTypes");
// import { Ages, Genders, Pet, Species, Status } from "../types/petTypes";
const web_push_1 = __importDefault(require("../../../config/web_push"));
const jwtMiddleware_1 = __importDefault(require("../../../config/jwtMiddleware"));
const petAuxFn_1 = require("./petAuxFn");
const router = (0, express_1.Router)();
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
            let userIsRegistered = yield (0, petAuxFn_1.idExistsInDataBase)(id);
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
        let numberOfPetsInDB = yield (0, petAuxFn_1.getNumberOfPetsInDB)();
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
        let speciesArray = (0, petAuxFn_1.mapSpecies)();
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
        let allThePetsNotTransacted = yield (0, petAuxFn_1.getAllActivePets)();
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
        let dogsFromDB = yield (0, petAuxFn_1.getAllDogs)();
        console.log(`dogsFromDB.length = ${dogsFromDB.length}`);
        let notTransactedDogs = (0, petAuxFn_1.excludePetsTransacted)(dogsFromDB);
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
        let catsFromDB = yield (0, petAuxFn_1.getAllCats)();
        console.log(`catsFromDB.length = ${catsFromDB.length}`);
        let notTransactedCats = (0, petAuxFn_1.excludePetsTransacted)(catsFromDB);
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
        let otherSpeciesFromDB = yield (0, petAuxFn_1.getAllOtherSpecie)();
        console.log(`otherSpeciesFromDB.length = ${otherSpeciesFromDB.length}`);
        let notTransactedOtherSpec = (0, petAuxFn_1.excludePetsTransacted)(otherSpeciesFromDB);
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
        let allLostFromDB = yield (0, petAuxFn_1.getAllLost)();
        console.log(`allLostFromDB.length = ${allLostFromDB.length}`);
        let notTransactedLostPets = (0, petAuxFn_1.excludePetsTransacted)(allLostFromDB);
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
        let allFoundFromDB = yield (0, petAuxFn_1.getAllFound)();
        console.log(`allFoundFromDB.length = ${allFoundFromDB.length}`);
        let notTransactedFoundPets = (0, petAuxFn_1.excludePetsTransacted)(allFoundFromDB);
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
        let allInAdoptionDB = yield (0, petAuxFn_1.getAllInAdoption)();
        console.log(`allInAdoptionDB.length = ${allInAdoptionDB.length}`);
        let notTransactedInAdoptionPets = (0, petAuxFn_1.excludePetsTransacted)(allInAdoptionDB);
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
        let result = yield (0, petAuxFn_1.getAllBy)(input);
        let notTransactedResultPets = (0, petAuxFn_1.excludePetsTransacted)(result);
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
        let petFoundById = yield (0, petAuxFn_1.getPetById)(paramsID);
        return res.status(200).send(petFoundById);
    }
    catch (error) {
        console.log(`retornando error en GET pets/:id: ${error.message}`);
        return res.status(404).send(error.message);
    }
}));
exports.default = router;
