//---------   MASCOTA: -----------------------------------

export enum Ages {
  Cachorro = "muy joven",
  Joven = "joven",
  Adulto = "adulto",
  Viejo = "viejo",
  Desconocido = "desconocido",
}

export enum Genders {
  Hembra = "hembra",
  Macho = "macho",
}

export enum Species {
  Perro = "perro",
  Gato = "gato",
  Ave = "ave",
  Reptil = "reptíl",
  Roedor = "roedor",
  Otra = "otra especie",
}

export enum Status {
  Perdido = "perdido",
  Encontrado = "encontrado",
  enAdopcion = "en adopción",
}

export enum postStatus {
  Active = "activo",
  Cancel = "cancelado",
  Success = "concretado",
}

// El tamaño depende de la raza. Aunque si es raza "otro" o "mestizo", no podríamos definir el tamaño.
// Cómo hacemos para poder filtrar por tamaño en perros? Para gatos no importa.

//Crear una interface para perros y otra para gatos y otra para "otros"?
export enum Size {
  Chico = "chico",
  Mediano = "mediano",
  Grande = "grande",
  MuyGrande = "muy grande",
}

// export type VaccinationSchemeStatus = "completo" | "incompleto" | "desconocido";

export enum VaccinationStatus {
  Completo = "completo",
  Incompleto = "incompleto",
  Desconocido = "desconocido",
}

export type NewPetEntry = Omit<Pet, "id">;

export interface Pet {
  id: string | undefined; //! Le damos la opción al cliente de setear su id al string q quiera
  name: string | undefined;
  specie: Species; //! OBLIGATORIO
  race: string | undefined;
  city: string | undefined;
  age: Ages | undefined;
  gender: Genders | undefined;
  status: Status; //! OBLIGATORIO
  vaccinationSchemeStatus: VaccinationStatus | undefined;
  image: string | undefined;
  comments: string | undefined;
  withNewOwner: undefined | true;
  backWithItsOwner: undefined | true;
  postStatus: undefined | postStatus;
}

export interface IPetOfUser {
  id: string | undefined;
  name: string | undefined;
  city: string | undefined;
  specie: Species;
  race: string | undefined;
  age: Ages | undefined;
  gender: Genders | undefined;
  status: Status;
  vaccinationSchemeStatus: VaccinationStatus | undefined;
  image: string | undefined;
  comments: string | undefined;
  withNewOwner: undefined | true;
  backWithItsOwner: undefined | true;
  postStatus: undefined | postStatus;
}

export interface updatedPet {
  name: string | undefined;
  specie: Species; //! OBLIGATORIO
  race: string | undefined;
  city: string | undefined;
  age: Ages | undefined;
  gender: Genders | undefined;
  status: Status; //! OBLIGATORIO
  vaccinationSchemeStatus: VaccinationStatus | undefined;
  image: string | undefined;
  comments: string | undefined;
}
