//-----  FUNCIONES AUXILIARES: -------------------------------

import db from "../../../models";

export async function getAllReviews() {
  try {
    let allTheReviewsFromDB = await db.Review.findAll();
    return allTheReviewsFromDB;
  } catch (error: any) {
    console.log(
      `Error en function getAllReviews. Error message: ${error.message} `
    );
    throw new Error(error.message);
  }
}
