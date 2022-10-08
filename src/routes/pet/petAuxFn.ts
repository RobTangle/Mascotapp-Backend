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
  try {
    const allPets = await db.Animal.findAll();
    // console.log(allPets);
    return allPets;
  } catch (error: any) {
    console.log(error.message);
    return error;
  }
};

export async function getAllActivePets(): Promise<Pet[]> {
  try {
    let petsInOffer = await db.Animal.findAll({
      where: {
        postStatus: "activo",
      },
    });
    return petsInOffer;
  } catch (error: any) {
    return error.message;
  }
}

export function excludePetsTransacted(array: Pet[]): Pet[] {
  console.log(`Excluyendo mascotas que han sido transacted...`);
  try {
    let filteredArray = array.filter((pet) => pet.postStatus === "activo");
    return filteredArray;
  } catch (error: any) {
    return error.message;
  }
}

export async function getNumberOfPetsInDB(): Promise<number> {
  console.log("En la fn getNumberOfPetsInDB");
  try {
    let allPetsInDB = await getAllPets();
    let numberOfPetsInDB = allPetsInDB.length;
    console.log(`numberOfPetsInDB: ${numberOfPetsInDB}`);

    return numberOfPetsInDB;
  } catch (error: any) {
    console.log(
      `Error en la function getNumberOfPetsInDB. Error message: ${error.message}`
    );
    return error.message;
  }
}

export async function getPetById(id: string | undefined) {
  console.log(`fn getById; id: ${id}`);
  try {
    let petFoundById = await db.Animal.findByPk(id);
    console.log(`petFoundById: ${petFoundById}`);
    console.log(`${petFoundById?.name}`);
    return petFoundById;
  } catch (error: any) {
    console.log(
      `Error en la function getPetById. Error message: ${error.message}`
    );
    return error.message;
  }
}

export async function getAllDogs(): Promise<Pet[]> {
  console.log("entré a la fn getAllDogs");
  try {
    let allDogsFromDB = await db.Animal.findAll({
      where: {
        specie: "perro",
      },
    });
    console.log(`length de allDogsFromDB: ${allDogsFromDB.length}`);
    return allDogsFromDB;
  } catch (error: any) {
    console.log(`Error en la function getAllDogs. Error: ${error.message}`);
    return error.message;
  }
}

export async function getAllCats(): Promise<Pet[]> {
  console.log("entré a la fn getAllCats");
  try {
    let allCatsFromDB = await db.Animal.findAll({
      where: {
        specie: "gato",
      },
    });
    console.log(`length de allCatsFromDB: ${allCatsFromDB.length}`);
    return allCatsFromDB;
  } catch (error: any) {
    console.log(
      `Error en la function getAllCats. Error message: ${error.message}`
    );

    return error.message;
  }
}

export async function getAllOtherSpecie(): Promise<Pet[]> {
  console.log("entré a la fn getAllOtherSpecie");
  try {
    let allOtherSpeciesFromDB = await db.Animal.findAll({
      where: {
        specie: "otra especie",
      },
    });
    console.log(
      `length de allOtherSpeciesFromDB: ${allOtherSpeciesFromDB.length}`
    );
    return allOtherSpeciesFromDB;
  } catch (error: any) {
    console.log(
      `Error en la function getAllOtherSpecie. Error message: ${error.message}`
    );
    return error.message;
  }
}

export async function getAllLost(): Promise<Pet[]> {
  console.log("entré a la fn getAllLost");
  try {
    let allLostFromDB = await db.Animal.findAll({
      where: {
        status: "perdido",
      },
    });
    console.log(`length de allLostFromDB: ${allLostFromDB.length}`);
    return allLostFromDB;
  } catch (error: any) {
    console.log(
      `Error en la function getAllLost. Error message: ${error.message}`
    );
    return error.message;
  }
}

export async function getAllFound(): Promise<Pet[]> {
  console.log("entré a la fn getAllFound");
  try {
    let allFoundFromDB = await db.Animal.findAll({
      where: {
        status: "encontrado",
      },
    });
    console.log(`length de allFoundFromDB: ${allFoundFromDB.length}`);
    return allFoundFromDB;
  } catch (error: any) {
    console.log(
      `Error en la function getAllFound. Error message: ${error.message}`
    );

    return error.message;
  }
}

export async function getAllInAdoption(): Promise<Pet[]> {
  console.log("Entré a la ruta getAllInAdoption");
  try {
    let allInAdoptionFromDB = await db.Animal.findAll({
      where: {
        status: "en adopción",
      },
    });
    console.log(`length de allFoundFromDB: ${allInAdoptionFromDB.length}`);
    return allInAdoptionFromDB;
  } catch (error: any) {
    console.log(
      `Error en la function getAllInAdoption. Error message: ${error.message}`
    );
    return error.message;
  }
}

export async function getAllBy(input: any): Promise<Pet[]> {
  console.log(`En la function getAllByNameOrRace`);

  try {
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
  } catch (error: any) {
    console.log(
      `Error en la function getAllByNameOrRace. Error message: ${error.message}`
    );
    return error.message;
  }
}

export async function idExistsInDataBase(id: any): Promise<boolean> {
  console.log(`Chequeando si existe el user.id "${id}" en la DB...`);
  try {
    let userInDataBase = await db.User.findByPk(id);
    if (userInDataBase) {
      console.log(`Usuario con id ${id} encontrado en la DB`);
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.log(`Error en function idExistsInDataBase. ${error.message}`);
    return error.message;
  }
}
