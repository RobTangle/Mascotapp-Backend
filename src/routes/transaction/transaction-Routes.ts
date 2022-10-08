import { Router } from "express";
import { Op } from "sequelize";
import db from "../../../models/index";
import { validateNewTransaction } from "../../validators/TransactionValidators";
import { ITransaction, transactionStatus } from "../../types/transactionTypes";
import { postStatus, Status } from "../../types/petTypes";
import jwtCheck from "../../../config/jwtMiddleware";
import { getAllTransactions, mailer } from "./transactionAuxFn";

const router = Router();

//------------- RUTAS: ---------------------------------------

router.get("/allTransactions", async (req, res) => {
  console.log(`Entré a la ruta /transactions/allTransactions`);
  try {
    let allTransactions = await getAllTransactions();
    return res.status(200).send(allTransactions);
  } catch (error: any) {
    console.log(`Error en /transactions/allTransactions`);
    return res.status(404).send(error.message);
  }
});

router.get("/transactionsCompleted", async (req, res) => {
  console.log(`Entré a la ruta /transactions/transactionsCompleted`);
  try {
    const transactionsCompleted = await db.Transaction.findAll({
      where: { status: "finalizado" },
    });
    return res.status(200).send(transactionsCompleted);
  } catch (error: any) {
    console.log(`Error en /transactions/transactionsCompleted`);
    return res.status(404).send(error.message);
  }
});

router.post("/postSuccess", jwtCheck, async (req: any, res) => {
  console.log(`Entré a la ruta /transactions/postsuccess`);
  try {
    const id = req.auth?.sub;
    // const { id } = req.body;
    const { petId } = req.body;
    const { id_demanding } = req.body; // el usuario selecciona al usuario con el que realizó existosamente la transacción

    const pet = await db.Animal.findOne({ where: { id: petId } });
    const userOffering = await db.User.findOne({ where: { id: id } });
    const userDemanding = await db.User.findOne({
      where: { id: id_demanding },
    });
    console.log(`pet name = ${pet?.name}`);
    console.log(`userOffering.name = ${userOffering?.name}`);
    console.log(`userDemanding.name = ${userDemanding?.name}`);

    if (!pet || !userOffering || !userDemanding) {
      console.log(
        +`Error en el chequeo de si alguna de las instancias buscadas en la DB es falsa. Alguna lo es`
      );
      throw new Error(`el pet, usserOffering o userDemanding es falso.`);
    }

    if (pet.UserId === id) {
      const multiplierPoints = await db.Multiplier.findOne({
        where: { id: 1 },
      });
      if (pet.status === Status.enAdopcion) {
        pet.withNewOwner = "true";
        pet.postStatus = postStatus.Success;
        await pet.save();

        console.log(multiplierPoints);
        userDemanding.isAdopter = userDemanding.isAdopter + 1;
        userDemanding.points = Math.ceil(
          userDemanding.points + 100 * multiplierPoints.number
        );
        await userDemanding.save();

        userOffering.gaveUpForAdoption = userOffering.gaveUpForAdoption + 1;
        userOffering.points = Math.ceil(
          userOffering.points + 100 * multiplierPoints.number
        );
        await userOffering.save();

        console.log("se acutalizo withNewOner y postStatus de la mascota");
      } else {
        pet.backWithItsOwner = "true";
        pet.postStatus = postStatus.Success;
        await pet.save();

        if (pet.status === "encontrado") {
          userDemanding.gotAPetBack = userDemanding.gotAPetBack + 1;
          userDemanding.points = Math.ceil(
            userDemanding.points + 25 * multiplierPoints.number
          );

          await userDemanding.save();

          userOffering.foundAPet = userOffering.foundAPet + 1;
          userOffering.points = Math.ceil(
            userOffering.points + 100 * multiplierPoints.number
          );
          await userOffering.save();
        } else {
          userDemanding.foundAPet = userDemanding.foundAPet + 1;
          userDemanding.points = Math.ceil(
            userDemanding.points + 100 * multiplierPoints.number
          );
          await userDemanding.save();

          userOffering.gotAPetBack = userOffering.gotAPetBack + 1;
          userOffering.points = Math.ceil(
            userOffering.points + 25 * multiplierPoints.number
          );
          await userOffering.save();
        }

        console.log("se acutalizo backWithItsOwner y postStatus de la mascota");
      }
      console.log(`En ELSE Z de no-adopción`);

      console.log(`user_demanding_id: ${id_demanding}`);
      console.log(`user_offering_id: ${id}`);
      console.log(`pet_id: ${petId}`);

      const transaction = await db.Transaction.findOne({
        where: {
          [Op.and]: [
            { user_offering_id: id },
            { user_demanding_id: id_demanding },
            { pet_id: petId },
          ],
        },
      });
      console.log("Transaction encontrada: ");
      console.log(transaction);

      transaction.status = transactionStatus.Success;
      if (transaction.user_demanding_check !== "calificado") {
        transaction.user_demanding_check = "finalizado";
      }
      if (transaction.user_offering_check !== "calificado") {
        transaction.user_offering_check = "finalizado";
      }
      await transaction.save();
      console.log("transactionStatus seteada a concretado");

      const transactionsToCancel = await db.Transaction.findAll({
        where: {
          [Op.and]: [
            { pet_id: petId },
            { user_demanding_id: { [Op.not]: id_demanding } },
          ],
        },
      });
      console.log("transacciones a cancelar");
      console.log(transactionsToCancel);

      for (const transaction of transactionsToCancel) {
        transaction.status = transactionStatus.Cancel;
        if (transaction.user_demanding_check !== "calificado") {
          transaction.user_demanding_check = "finalizado";
        }
        if (transaction.user_offering_check !== "calificado") {
          transaction.user_offering_check = "finalizado";
        }
        await transaction.save();
        console.log("transaction saved");
      }

      console.log("transacciones a cancelar, canceladas");
      return res.send({
        msg: "estados actualizados y transacciones canceladas",
      });
    }

    throw new Error(
      "No puedes modificar el estado de esta mascota porque no eres quién la publicó."
    );
  } catch (error: any) {
    console.log(`Error en /transactions/postSuccess. ${error.message}`);
    return res.status(404).send(error.message);
  }
});

router.post("/cancelPost", jwtCheck, async (req: any, res) => {
  console.log(`Entré a la ruta /transactions/cancelPost`);
  try {
    const id = req.auth?.sub;
    // const { id } = req.body;
    const { petId } = req.body;

    const pet = await db.Animal.findOne({ where: { id: petId } });
    const transactionsWithPetId = await db.Transaction.findAll({
      where: { pet_id: petId },
    });
    if (pet.UserId === id) {
      pet.postStatus = postStatus.Cancel;
      await pet.save();

      for (const transaction of transactionsWithPetId) {
        transaction.status = transactionStatus.Cancel;
        if (transaction.user_demanding_check !== "calificado") {
          transaction.user_demanding_check = "finalizado";
        }
        if (transaction.user_offering_check !== "calificado") {
          transaction.user_offering_check = "finalizado";
        }
        await transaction.save();
        console.log(`${transaction.id} status cancelada`);
        console.log("transaction status cancelado");
      }

      console.log(
        "se acutalizo postStatus a canceled y se cancelaron todas las transacciones de este pet"
      );

      return res
        .status(200)
        .send({ msg: "Se cancelo la transacción correctamente." });
    }
    throw new Error(
      "No puedes modificar el estado de esta mascota porque no eres quién la publicó."
    );
  } catch (error: any) {
    console.log(`Error en /Transactions/cancelPost. ${error.message}`);
    return res.status(404).send(error.message);
  }
});

//! DEPRECATED
router.post("/getUserTransactions", jwtCheck, async (req: any, res) => {
  console.log(`Entré a la ruta /Transactions/getUserTransactions`);
  try {
    const id = req.auth?.sub;
    // const { id } = req.body;
    const userTransactions = await db.Transaction.findAll({
      where: {
        [Op.or]: [{ user_offering_id: id }, { user_demanding_id: id }],
      },
    });

    return res.status(200).send(userTransactions);
  } catch (error: any) {
    console.log(`Error en /Transactions/allTransactions. ${error.message}`);
    return res.status(404).send(error.message);
  }
});

router.post("/newTransaction", jwtCheck, async (req: any, res) => {
  console.log(`Entré a la ruta /Transactions/newTransaction`);
  try {
    const id = req.auth?.sub;
    // const { id } = req.body;
    const { petId } = req.query;
    if (!id || !petId) {
      console.log(`req.body.id  o  req.query.petId  es falso/undefined.`);
      throw new Error(`req.body.id  o  req.query.petId  es falso/undefined.`);
    }
    const prevTransaction = await db.Transaction.findOne({
      where: { [Op.and]: [{ pet_id: petId }, { user_demanding_id: id }] },
    });

    if (prevTransaction) {
      console.log(`esta transacción ya existe por lo que no se creará`);
      return res.send({ msg: "transacción ya existente" });
    }
    const userDemanding = await db.User.findOne({ where: { id: id } });
    const offeringPet = await db.Animal.findOne({ where: { id: petId } });
    const userOffering = await db.User.findOne({
      where: { id: offeringPet.UserId },
    });
    if (!userDemanding || !offeringPet || !userOffering) {
      console.log(
        `Error al buscar por ID alguna de las instancias de userDemanding, offeringPet o userOffering. Tirando error...`
      );
      throw new Error(
        `userDemanding || offeringPet || userOffering  no se encontró en la DB.`
      );
    }
    if (userDemanding.id === userOffering.id) {
      console.log(
        `ID de usuario ofertante y demandante son iguales!!!! Error!`
      );
      throw new Error(
        `El id del userDemanding y el userOffering son iguales. No es posible crear una transacción entre el mismo usuario.`
      );
    }

    const newTransaction: ITransaction = {
      user_offering_id: userOffering.id,
      user_offering_name: userOffering.name,
      user_demanding_id: userDemanding.id,
      user_demanding_name: userDemanding.name,
      status: transactionStatus.Active,
      pet_id: offeringPet.id,
      pet_name: offeringPet.name,
      pet_image: offeringPet.image,
      user_offering_check: undefined,
      user_demanding_check: undefined,
    };
    let validatedTransactionObj: ITransaction =
      validateNewTransaction(newTransaction);
    let createdTransaction = await db.Transaction.create(
      validatedTransactionObj
    );
    console.log(`Nueva transacción creada.`);

    //mailer
    await mailer(userDemanding, userOffering, offeringPet);

    return res
      .status(200)
      .send({ msg: "nueva transacción creada", createdTransaction });
  } catch (error: any) {
    console.log(`Error en /Transactions/allTransactions. ${error.message}`);
    return res.status(404).send(error.message);
  }
});

router.put("/transactionCheck", jwtCheck, async (req: any, res) => {
  console.log("en la ruta /Transactions/transactionCheck");
  try {
    const { transactionId } = req.query;
    const id = req.auth?.sub;
    // const { id } = req.body;

    const transaction = await db.Transaction.findOne({
      where: { id: transactionId },
    });

    if (id === transaction.user_offering_id) {
      transaction.user_offering_check = "finalizado";
      await transaction.save();
    }
    if (id === transaction.user_demanding_id) {
      transaction.user_demanding_check = "finalizado";
      await transaction.save();
    }

    res.status(200).send({ msg: "status checked" });
  } catch (error: any) {
    console.log(`Error en /Transactions/allTransactions`);
    return res.status(404).send(error.message);
  }
});

export default router;
