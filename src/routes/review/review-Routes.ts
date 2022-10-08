import { Router } from "express";
import db from "../../../models/index";
import { IReview } from "../../types/reviewTypes";
import { validateNewReview } from "../../validators/ReviewValidators";
import jwtCheck from "../../../config/jwtMiddleware";
import { getAllReviews } from "./reviewAuxFn";
import { isValidId } from "../../validators/GenericValidators";

const router = Router();

//------  RUTAS: -----------------------------------------------
router.get("/allReviews", async (req, res) => {
  console.log(`Entré a la ruta GET /reviews/allReviews`);
  try {
    let allReviews = await getAllReviews();
    return res.status(200).send(allReviews);
  } catch (error: any) {
    console.log(`Error en /reviews/allReviews`);
    return res.status(404).send(error.message);
  }
});

router.post("/newReview", jwtCheck, async (req: any, res) => {
  console.log(`Entré a la ruta POST /reviews/newReview`);
  try {
    console.log(`req.body = ${req.body}`);
    const idOfToken = req.auth?.sub;
    let { reviewed_id, reviewer_id, transaction_id } = req.body;

    if (!isValidId(reviewed_id)) {
      throw new Error(`El ID del reviewed_id "${reviewed_id}" no es válido`);
    }
    if (idOfToken !== reviewer_id) {
      throw new Error(
        `El id del reviewer es distinto al id del reviewer_id del body`
      );
    }
    const transaction = await db.Transaction.findOne({
      where: { id: transaction_id },
    });
    if (!transaction)
      throw new Error(`La transacción con id "${transaction_id}" no existe.`);
    if (
      (reviewer_id === transaction.user_offering_id &&
        reviewed_id === transaction.user_demanding_id) ||
      (reviewer_id === transaction.user_demanding_id &&
        reviewed_id === transaction.user_offering_id)
    ) {
      let validatedReview = validateNewReview(req.body);

      console.log(
        `req.body Validado. Continuando con los chequeos de los id de usuarios...`
      );

      if (reviewer_id === transaction.user_offering_id) {
        if (transaction.user_offering_check === "finalizado") {
          let newReview = await db.Review.create(validatedReview);
          let reviewedUser = await db.User.findByPk(reviewed_id);
          await newReview.setUser(reviewedUser);
          console.log(newReview);
          console.log(`Review creada y asociada al user ${reviewed_id}`);

          transaction.user_offering_check = "calificado";
          await transaction.save();
          return res.status(200).send(newReview);
        }
      }
      if (reviewer_id === transaction.user_demanding_id) {
        if (transaction.user_demanding_check === "finalizado") {
          let newReview = await db.Review.create(validatedReview);
          let reviewedUser = await db.User.findByPk(reviewed_id);
          await newReview.setUser(reviewedUser);
          console.log(`Review creada y asociada al user ${reviewed_id}`);
          transaction.user_demanding_check = "calificado";
          await transaction.save();
          console.log(`user_demanding_check cambiado a "calificado"`);
          console.log(`Retornando la nueva review...`);
          console.log(newReview);

          return res.status(200).send(newReview);
        }
      }
    }

    return res
      .status(404)
      .send({ msg: "Transacción no válida para estos usuarios." });
  } catch (error: any) {
    console.log(`Error en ruta /newReview.  ${error.message}`);
    return res.status(404).send(error.message);
  }
});

router.post("/getReviewsToUser", async (req, res) => {
  console.log(`En /reviews/getReviewsToUser`);
  console.log(`req.body = ${req.body}`);
  try {
    console.log(`user id = ${req.body.id}`);
    if (!req.body.id) {
      throw new Error(
        `el req.body.id "${req.body.id}" enviado por body es falso.`
      );
    }
    let userId = req.body.id;
    let reviewsToUser = await db.Review.findAll({
      where: {
        UserId: userId,
      },
    });
    console.log(`Devolviendo reviews hechas al user con id ${req.body.id}...`);
    return res.status(200).send(reviewsToUser);
  } catch (error: any) {
    console.log(`Error en /reviews/getReviewsOfUser. ${error.message}`);
    return res.status(404).send(error.message);
  }
});

export default router;
