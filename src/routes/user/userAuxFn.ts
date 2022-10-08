// ----- ------ ------ FUNCIONES AUXILIARES PARA LAS RUTAS: ------- -------- --------

import { Op } from "sequelize";
import db from "../../../models";
import { IPetOfUser, Pet } from "../../types/petTypes";
import { ISomeUserInfo, IUserAttributes } from "../../types/userTypes";

//!------------

export const getAllUsers = async () => {
  try {
    const allUsers = await db.User.findAll();
    // console.log(allUsers);
    return allUsers;
  } catch (error: any) {
    console.log(error.message);
    return error;
  }
};

export const getAllReviewsRecived = async (userId: any) => {
  try {
    const allReviews = await db.Review.findAll({
      where: {
        UserId: userId,
      },
    });
    return allReviews;
  } catch (error: any) {
    console.log(error.message);
    return error;
  }
};

export const getAllTransactions = async (userId: any) => {
  try {
    const allTransactions = await db.Transaction.findAll({
      where: {
        [Op.or]: [{ user_offering_id: userId }, { user_demanding_id: userId }],
      },
    });
    return allTransactions;
  } catch (error: any) {
    console.log(error.message);
    return error;
  }
};

// get Some User Info:
export async function getSomeUserInfo(userId: any) {
  console.log(`Ejecutando función auxiliar someUserInfo`);
  console.log(`userId = ${userId}`);
  try {
    let userInfo: IUserAttributes = await db.User.findByPk(userId);
    if (userInfo) {
      let someUserInfo: ISomeUserInfo = {
        name: userInfo.name,
        city: userInfo.city,
        image: userInfo.image,
        contact: userInfo.contact,
        isDonator: userInfo.isDonator,
        isAdopter: userInfo.isAdopter,
        gaveUpForAdoption: userInfo.gaveUpForAdoption,
        foundAPet: userInfo.foundAPet,
        gotAPetBack: userInfo.gotAPetBack,
        points: userInfo.points,
        linkToDonate: userInfo.linkToDonate,
        endpoints: userInfo.endpoints,
        isBanned: userInfo.isBanned,
        isAdmin: userInfo.isAdmin,
      };
      console.log(`retornando someUserInfo: ${someUserInfo}`);
      return someUserInfo;
    } else {
      throw new Error(`usuario no encontrado`);
    }
  } catch (error: any) {
    console.log(`Error en la función auxiliar someUserInfo: ${error.message}`);
    return error.message;
  }
}

//Parse Pets Posted By User ---> deja afuera el UserId
export function parsePetsPostedByUser(petsPostedByUser: Pet[]): IPetOfUser[] {
  console.log(`En function auxiliary parsePetsPostedByUser`);
  try {
    let parsedPets: IPetOfUser[] = petsPostedByUser.map((pet) => {
      return {
        id: pet.id,
        name: pet.name,
        city: pet.city,
        specie: pet.specie,
        race: pet.race,
        age: pet.age,
        gender: pet.gender,
        status: pet.status,
        vaccinationSchemeStatus: pet.vaccinationSchemeStatus,
        image: pet.image,
        comments: pet.comments,
        withNewOwner: pet.withNewOwner,
        backWithItsOwner: pet.backWithItsOwner,
        postStatus: pet.postStatus,
      };
    });
    console.log(
      `Retornando parsedPets. parsedPets.length = ${parsedPets.length}`
    );
    return parsedPets;
  } catch (error: any) {
    return error;
  }
}

//GET POSTS OF USER:
export async function getPostsOfUser(id: any) {
  console.log(`Buscando los posteos de user con id: ${id}`);
  try {
    let postsOfUser = await db.Animal.findAll({
      where: {
        UserId: id,
      },
    });
    console.log(`${postsOfUser?.length} posts encontrados`);
    return postsOfUser;
  } catch (error: any) {
    return error.message;
  }
}

export async function getParsedReviewsToOwner(id: string) {
  try {
    let reviewsToUser = await db.Review.findAll({
      where: {
        UserId: id,
      },
    });
    let parsedReviewsWithMoreData = await parseReviewsToOwner(reviewsToUser);
    return parsedReviewsWithMoreData;
  } catch (error: any) {
    console.log(`Error en function getReviewsToOwner`);
    return error.message;
  }
}

export function parseReviewerName(reviewerName: any) {
  console.log(`Parseando reviewer name`);
  try {
    if (!reviewerName) {
      return "Anónimo";
    } else {
      return reviewerName;
    }
  } catch (error: any) {
    console.log(`Error en el parseReviewerName. ${error.message}`);
    return error.message;
  }
}

export function parseReviewerImage(reviewerImage: any) {
  try {
    if (!reviewerImage) {
      return "https://www.utas.edu.au/__data/assets/image/0013/210811/varieties/profile_image.png";
    } else {
      return reviewerImage;
    }
  } catch (error: any) {
    console.log(`Error en la function parseReviewerImage. ${error.message}`);
    return error.message;
  }
}

export async function parseReviewsToOwner(arrayOfReviews: any) {
  console.log(`Parseando las reviews...`);
  // console.log(arrayOfReviews);
  try {
    let parsedReviews = await Promise.all(
      arrayOfReviews.map(async (review: any) => {
        // console.log("review:");
        // console.log(review);
        let reviewer = await db.User.findByPk(review.reviewer_id);
        // console.log(reviewer.name);
        // console.log(reviewer.image);
        return {
          id: review.dataValues.id,
          transaction_id: review.dataValues.transaction_id,
          reviewer_id: review.dataValues.reviewer_id,
          comments: review.dataValues.comments,
          starts: review.dataValues.stars,
          createdAt: review.dataValues.createdAt,
          updatedAt: review.dataValues.updatedAt,
          UserId: review.dataValues.UserId,
          reviewer_name: parseReviewerName(reviewer?.name),
          reviewer_image: parseReviewerImage(reviewer?.image),
        };
      })
    );
    console.log(`Devolviendo las parsedReviews:`);
    // console.log(parsedReviews);
    return parsedReviews;
  } catch (error: any) {
    console.log(`Error en el parseReviewsToOwner. ${error.message}`);
    return error.message;
  }
}

// EMAIL EXISTS IN DATABASE:
export async function emailExistsInDB(emailFromReq: any): Promise<boolean> {
  console.log(`Chequeando si el email "${emailFromReq} existe en la DB`);
  try {
    let userWithEmail = await db.User.findOne({
      where: {
        email: emailFromReq,
      },
    });
    if (userWithEmail) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.log(`Error en function emailExistsInDB`);
    return error.message;
  }
}
