import { Op } from "sequelize";
import db from "../../../models";
import { Pet, Species } from "../../types/petTypes";

// ----- ------ ------ FUNCIONES AUXILIARES PARA LAS RUTAS: ------- -------- --------
export function mapSpecies() {
  try {
    let speciesArray = Object.values(Species);
    return speciesArray;
  } catch (error: any) {
    console.log(`Error en fn mapSpecies(). Error message: ${error.message}`);
    return error.message;
  }
}

export const getAllPets = async () => {
  const allPets = await db.Animal.findAll();
  // console.log(allPets);
  return allPets;
};

export async function getAllActivePets(): Promise<Pet[]> {
  let petsInOffer = await db.Animal.findAll({
    where: {
      postStatus: "activo",
    },
  });
  return petsInOffer;
}

export function excludePetsTransacted(array: Pet[]): Pet[] {
  console.log(`Excluyendo mascotas que han sido transacted...`);

  let filteredArray = array.filter((pet) => pet.postStatus === "activo");
  return filteredArray;
}

export async function getNumberOfPetsInDB(): Promise<number> {
  console.log("En la fn getNumberOfPetsInDB");

  let allPetsInDB = await getAllPets();
  let numberOfPetsInDB = allPetsInDB.length;
  console.log(`numberOfPetsInDB: ${numberOfPetsInDB}`);

  return numberOfPetsInDB;
}

export async function getPetById(id: string | undefined) {
  console.log(`fn getById; id: ${id}`);

  let petFoundById = await db.Animal.findByPk(id);
  console.log(`petFoundById: ${petFoundById}`);
  console.log(`${petFoundById?.name}`);
  return petFoundById;
}

export async function getAllDogs(): Promise<Pet[]> {
  console.log("entré a la fn getAllDogs");

  let allDogsFromDB = await db.Animal.findAll({
    where: {
      specie: "perro",
    },
  });
  console.log(`length de allDogsFromDB: ${allDogsFromDB.length}`);
  return allDogsFromDB;
}

export async function getAllCats(): Promise<Pet[]> {
  console.log("entré a la fn getAllCats");

  let allCatsFromDB = await db.Animal.findAll({
    where: {
      specie: "gato",
    },
  });
  console.log(`length de allCatsFromDB: ${allCatsFromDB.length}`);
  return allCatsFromDB;
}

export async function getAllOtherSpecie(): Promise<Pet[]> {
  console.log("entré a la fn getAllOtherSpecie");

  let allOtherSpeciesFromDB = await db.Animal.findAll({
    where: {
      specie: "otra especie",
    },
  });
  console.log(
    `length de allOtherSpeciesFromDB: ${allOtherSpeciesFromDB.length}`
  );
  return allOtherSpeciesFromDB;
}

export async function getAllLost(): Promise<Pet[]> {
  let allLostFromDB = await db.Animal.findAll({
    where: {
      status: "perdido",
    },
  });
  console.log(`length de allLostFromDB: ${allLostFromDB.length}`);
  return allLostFromDB;
}

export async function getAllFound(): Promise<Pet[]> {
  let allFoundFromDB = await db.Animal.findAll({
    where: {
      status: "encontrado",
    },
  });
  console.log(`length de allFoundFromDB: ${allFoundFromDB.length}`);
  return allFoundFromDB;
}

export async function getAllInAdoption(): Promise<Pet[]> {
  console.log("Entré a la ruta getAllInAdoption");

  let allInAdoptionFromDB = await db.Animal.findAll({
    where: {
      status: "en adopción",
    },
  });
  console.log(`length de allFoundFromDB: ${allInAdoptionFromDB.length}`);
  return allInAdoptionFromDB;
}

export async function getAllBy(input: any): Promise<Pet[]> {
  console.log(`En la function getAllByNameOrRace`);

  const searchedPets = await db.Animal.findAll({
    where: {
      name: {
        [Op.iLike]: "%" + input + "%",
      },
    },
  });
  const searchedPetsRace = await db.Animal.findAll({
    where: {
      race: {
        [Op.iLike]: "%" + input + "%",
      },
    },
  });
  const searchedPetsSpecie = await db.Animal.findAll({
    where: {
      specie: {
        [Op.iLike]: "%" + input + "%",
      },
    },
  });
  const searchedPetsGender = await db.Animal.findAll({
    where: {
      gender: {
        [Op.iLike]: "%" + input + "%",
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

export async function idExistsInDataBase(id: any): Promise<boolean> {
  console.log(`Chequeando si existe el user.id "${id}" en la DB...`);

  let userInDataBase = await db.User.findByPk(id);
  if (userInDataBase) {
    console.log(`Usuario con id ${id} encontrado en la DB`);
    return true;
  } else {
    return false;
  }
}
