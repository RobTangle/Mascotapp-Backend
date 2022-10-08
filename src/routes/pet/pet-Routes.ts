import { Router } from "express";
import { Op } from "sequelize";
import db from "../../../models/index";
import {
  validateNewPet,
  validateUpdatedPet,
} from "../../validators/AnimalValidators";
import { Pet, postStatus, Species, updatedPet } from "../../types/petTypes";
// import { Ages, Genders, Pet, Species, Status } from "../types/petTypes";
import webPush from "../../../config/web_push";
import jwtCheck from "../../../config/jwtMiddleware";
import {
  excludePetsTransacted,
  getAllActivePets,
  getAllBy,
  getAllCats,
  getAllDogs,
  getAllFound,
  getAllInAdoption,
  getAllLost,
  getAllOtherSpecie,
  getNumberOfPetsInDB,
  getPetById,
  idExistsInDataBase,
  mapSpecies,
} from "./petAuxFn";

const router = Router();

// ----- ------ ------- RUTAS :  ------ ------- -------

// aca tiene que haber validador porque solo usuarios registrados pueden acceder a esta ruta
//POST A PET:
router.post("/postNewPet", jwtCheck, async (req: any, res) => {
  console.log(`Entré a users/postnewpet`);
  try {
    const id = req.auth?.sub;
    if (!id) {
      throw new Error(`El Id de usuario es inválido/falso`);
    }
    if (id) {
      //chequear si existe este id de usuario registrado en la DB
      let userIsRegistered = await idExistsInDataBase(id);
      if (!userIsRegistered) {
        throw new Error(`Usuario no registrado en la DataBase.`);
      }
      let validatedPet: Pet = validateNewPet(req.body.pet);
      console.log("SOY VALIDATED PET: ");
      console.log(validatedPet);
      let createdPet = await db.Animal.create(validatedPet);
      //asociar createdPet con el userID:
      let associatedPetWithUser = await createdPet.setUser(id);
      if (createdPet) {
        console.log(`Mascota creada con éxito y asociada al User con ${id}`);
        return res.status(200).send(associatedPetWithUser);
      } else {
        console.log(
          `createdPet es falsa... no se debe haber podido crear la el post new pet.`
        );
        return res.status(400).send({ msg: "No se pudo crear el post..." });
      }
    }
  } catch (error: any) {
    console.log(`Error en /postnewpet. ${error.message}`);
    console.log(`req.auth.sub de la request = '${req.auth?.sub}'`);
    return res.status(404).send(error.message);
  }
});

//PUT Update detalles de la mascota
router.put("/update", jwtCheck, async (req: any, res) => {
  console.log(`Entré a pets/update`);
  console.log(`req.body = ${req.body}`);

  try {
    const userId = req.auth?.sub;
    const { id } = req.body;

    console.log(`req.body.image = ${req.body?.image}`);
    let validatedPetFromReq: updatedPet = validateUpdatedPet(req.body);
    const newProfile = await db.Animal.update(validatedPetFromReq, {
      where: {
        id: id,
        UserId: userId,
      },
    });
    console.log(`Animal UPDATED. Datos de la mascota actualizada.`);

    return res.status(200).send(newProfile);
  } catch (error: any) {
    console.log(`Error en la ruta "/pets/update". ${error.message}`);
    return res.status(400).send(error.message);
  }
});

// GET NUMBER OF PETS IN DB:
router.get("/numberOfPetsInDB", async (req, res) => {
  console.log("En route pets/numberOfPetsInDB");
  try {
    let numberOfPetsInDB = await getNumberOfPetsInDB();
    let numberOfPetsInDBtoString = `${numberOfPetsInDB}`;
    return res.status(200).send(numberOfPetsInDBtoString);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

//GET ALL SPECIES:
router.get("/especies", async (_req, res) => {
  console.log("entré al GET pets/especies");
  try {
    let speciesArray = mapSpecies();
    console.log(`species Array = ${speciesArray}`);
    return res.status(200).send(speciesArray);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

//GET ALL PETS:
router.get("/", async (_req, res) => {
  console.log("entré al GET pets/ ");
  try {
    let allThePetsNotTransacted = await getAllActivePets();
    // console.log(allThePets);
    return res.status(200).send(allThePetsNotTransacted);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

//GET ALL DOGS
router.get("/perros", async (req, res) => {
  console.log(`Entré al GET pets/perros`);
  try {
    let dogsFromDB = await getAllDogs();
    console.log(`dogsFromDB.length = ${dogsFromDB.length}`);
    let notTransactedDogs = excludePetsTransacted(dogsFromDB);
    return res.status(200).send(notTransactedDogs);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

//GET ALL CATS
router.get("/gatos", async (req, res) => {
  console.log(`Entré al GET pets/gatos`);
  try {
    let catsFromDB = await getAllCats();
    console.log(`catsFromDB.length = ${catsFromDB.length}`);
    let notTransactedCats = excludePetsTransacted(catsFromDB);
    return res.status(200).send(notTransactedCats);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

//GET ALL OTHER SPECIES
router.get("/otra", async (req, res) => {
  console.log(`Entré al GET pets/otra`);
  try {
    let otherSpeciesFromDB = await getAllOtherSpecie();
    console.log(`otherSpeciesFromDB.length = ${otherSpeciesFromDB.length}`);
    let notTransactedOtherSpec = excludePetsTransacted(otherSpeciesFromDB);
    return res.status(200).send(notTransactedOtherSpec);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

//GET ALL LOST
router.get("/perdido", async (req, res) => {
  console.log(`Entré al GET pets/perdido`);
  try {
    let allLostFromDB = await getAllLost();
    console.log(`allLostFromDB.length = ${allLostFromDB.length}`);
    let notTransactedLostPets = excludePetsTransacted(allLostFromDB);
    return res.status(200).send(notTransactedLostPets);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

//GET ALL FOUND
router.get("/encontrado", async (req, res) => {
  console.log(`Entré al GET pets/encontrado`);
  try {
    let allFoundFromDB = await getAllFound();
    console.log(`allFoundFromDB.length = ${allFoundFromDB.length}`);
    let notTransactedFoundPets = excludePetsTransacted(allFoundFromDB);
    return res.status(200).send(notTransactedFoundPets);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

//GET ALL IN ADOPTION
router.get("/adopcion", async (req, res) => {
  console.log(`Entré al GET pets/adopcion`);
  try {
    let allInAdoptionDB = await getAllInAdoption();
    console.log(`allInAdoptionDB.length = ${allInAdoptionDB.length}`);
    let notTransactedInAdoptionPets = excludePetsTransacted(allInAdoptionDB);
    return res.status(200).send(notTransactedInAdoptionPets);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

router.get("/search", async (req, res) => {
  console.log(`Entré al GET pets/search`);
  try {
    const { input } = req.query;
    console.log(`input = ${input}`);
    let result = await getAllBy(input);
    let notTransactedResultPets = excludePetsTransacted(result);
    return res.status(200).send(notTransactedResultPets);
  } catch (error: any) {
    console.log(
      `Hubo un error ruta GET pets/search. Error message: ${error.message}`
    );
    return error.message;
  }
});

router.get("/success", async (req, res) => {
  console.log(`Entré al GET pets/success`);
  try {
    const pets = await db.Animal.findAll({
      where: { postStatus: postStatus.Success },
    });
    return res.send(pets);
  } catch (error: any) {
    console.log(`retornando error en GET pets/success ${error.message}`);
    return res.status(404).send(error.message);
  }
});

router.get("/successAdoptions", async (req, res) => {
  console.log(`Entré al GET pets/successAdoptions`);
  try {
    const pets = await db.Animal.findAll({ where: { withNewOwner: "true" } });
    res.send(pets);
  } catch (error: any) {
    console.log(
      `retornando error en GET pets/successAdoptions ${error.message}`
    );
    return res.status(404).send(error.message);
  }
});

router.get("/successFound", async (req, res) => {
  console.log(`Entré al GET pets/successFound`);
  try {
    const pets = await db.Animal.findAll({
      where: { backWithItsOwner: "true" },
    });
    res.send(pets);
  } catch (error: any) {
    console.log(`retornando error en GET pets/successFound ${error.message}`);
    return res.status(404).send(error.message);
  }
});

router.post("/subscribe", async (req, res) => {
  console.log(`Entré a pets/subscribe`);
  try {
    const { subscription, id } = req.body;
    const string = JSON.stringify(subscription);
    const update = await db.User.update(
      { endpoints: string },
      { where: { id: id } }
    );
    console.log("soy subscription y id ", subscription, id);
    return res.status(200).send("Subscripción creada correctamente");
  } catch (error: any) {
    console.log(`Error en pets/subscribe. ${error.message}`);
    return res.status(400).send(error.message);
  }
});

router.post("/desubscribe", async (req, res) => {
  console.log("estoy en /desubscribe");
  try {
    const { id } = req.body;
    const usuario = await db.User.update(
      { endpoints: null },
      { where: { id: id } }
    );
    console.log(`El endpoint del usuario con id ${id} ha sido seteado a null.`);
    res.status(200).send(`Subscripción borrada exitosamente ${usuario}`);
  } catch (error: any) {
    console.log("fallo /desubscribe");
    return res.status(400).send(error.message);
  }
});

router.post("/notify", async (req, res) => {
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
    const allUsers = await db.User.findAll();
    const cityUsers = await allUsers.filter((e: any) => e.city == city);
    const endpointsArray = await cityUsers.map((e: any) => e.endpoints);
    const endpointsPurgados = await endpointsArray.filter(
      (e: any) => e !== null
    );
    const endpointsParsed = await endpointsPurgados.map((e: any) =>
      JSON.parse(e)
    );
    endpointsParsed.map((s: any) => webPush.sendNotification(s, string));
    console.log(`al final de /notify...`);
    res.status(200).json();
  } catch (error: any) {
    console.log(`Error en users/notify. ${error.message}`);
  }
});

//GET BY ID:
router.get("/:id", async (req, res) => {
  console.log(`Entré al GET pets/:id con params.id = ${req?.params?.id}`);
  try {
    let paramsID = req.params.id;
    let petFoundById = await getPetById(paramsID);
    return res.status(200).send(petFoundById);
  } catch (error: any) {
    console.log(`retornando error en GET pets/:id: ${error.message}`);
    return res.status(404).send(error.message);
  }
});

export default router;
