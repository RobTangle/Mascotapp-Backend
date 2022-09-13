import { Router } from "express";
import db from "../../models/index";
import { validateNewPet } from "../auxiliary/AnimalValidators";
import { Pet } from "../types/petTypes";
// import { Ages, Genders, Pet, Species, Status } from "../types/petTypes";

const router = Router();

// ----- ------ ------ FUNCIONES AUXILIARES PARA LAS RUTAS: ------- -------- --------

const getAllPets = async () => {
  try {
    const allPets = await db.Animal.findAll();
    // console.log(allPets);
    return allPets;
  } catch (error: any) {
    console.log(error.message);
    return error;
  }
};

// ----- ------ ------- RUTAS :  ------ ------- -------

router.get("/", async (_req, res) => {
  console.log("entré al get de pets!");

  try {
    let allThePets = await getAllPets();
    // console.log(allThePets);

    return res.status(200).send(allThePets);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

router.post("/", async (req, res) => { // aca tiene que haber validador porque solo usuarios registrados pueden acceder a esta ruta
  console.log("entré al POST de Animal!");
  try {
    let validatedPet: Pet = validateNewPet(req.body);
    console.log("SOY VALIDATED PET: ");
    console.log(validatedPet);

    let createdPet = await db.Animal.create(validatedPet);
    return res.status(200).send(createdPet);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

export default router;
