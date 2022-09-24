import { Router } from "express";
import { Op } from "sequelize";
import db from "../../models/index";

const router = Router();

//-----  FUNCIONES AUXILIARES: -------------------------------
async function getAllTransactions() {
  try {
    let allTheTransactionsFromDB = await db.Transaction.findAll();
    return allTheTransactionsFromDB;
  } catch (error: any) {
    console.log(
      `Error en function getAllTransactions. Error message: ${error.message} `
    );
    throw new Error(error.message);
  }
}
//------  RUTAS: -----------------------------------------------
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
    console.log(
      `Devolviendo las transaciones con status "finalizado". Cantidad de transactionsCompletes = ${transactionsCompleted?.length}`
    );

    return res.status(200).send(transactionsCompleted);
  } catch (error: any) {
    console.log(`Error en /transactions/transactionsCompleted`);
    return res.status(404).send(error.message);
  }
});

router.post("/getUserTransactions", async (req, res) => {
  console.log(`Entré a la ruta /Transactions/getUserTransactions`);
  try {
    const { id } = req.body;

    const userTransactions = await db.Transaction.findAll({
      where: {
        [Op.or]: [{ user_offering_id: id }, { user_demanding_id: id }],
      },
    });
    console.log(`Devolviendo las UserTransactions...`);
    console.log(`UserTransactions.length = ${userTransactions?.length}`);

    return res.status(200).send(userTransactions);
  } catch (error: any) {
    console.log(`Error en /Transactions/allTransactions. ${error.message}`);
    return res.status(404).send(error.message);
  }
});

router.post("/newTransaction", async (req, res) => {
  console.log(`Entré a la ruta /Transactions/newTransaction`);
  try {
    const { id } = req.body;
    const { petId } = req.query;
    const userDemanding = await db.User.findOne({ where: { id: id } });
    const offeringPet = await db.Animal.findOne({ where: { id: petId } });
    const userOffering = await db.User.findOne({
      where: { id: offeringPet.UserId },
    });

    const newTransaction = await db.Transaction.create({
      user_offering_id: userOffering.id,
      user_demanding_id: userDemanding.id,
      status: "active",
      pet_id: petId,
      user_offering_check: null,
      user_demanding_check: null,
    });
    console.log(`Nueva transacción creada.`);
    return res
      .status(200)
      .send({ msg: "nueva transacción creada", newTransaction });
  } catch (error: any) {
    console.log(`Error en /Transactions/allTransactions. ${error.message}`);
    return res.status(404).send(error.message);
  }
});

router.put("/transactionCheck", async (req, res) => {
  console.log("en la ruta /Transactions/transactionCheck");
  try {
    const { transactionId } = req.query;
    const { id } = req.body;

    const transaction = await db.Transaction.findOne({
      where: { id: transactionId },
    });

    if (id === transaction.user_offering_id) {
      transaction.user_offering_check = "finalizado";
      await transaction.save();
      if (transaction.user_demanding_check !== null) {
        transaction.status = "finalizado";
        await transaction.save();
        console.log(`Transaction.status ahora es "finalizado".`);
      }
    }
    if (id === transaction.user_demanding_id) {
      transaction.user_demanding_check = "finalizado";
      await transaction.save();
      if (transaction.user_offering_check !== null) {
        transaction.status = "finalizado";
        await transaction.save();
        console.log(`Transaction.status ahora es "finalizado".`);
      }
    }

    res.status(200).send({ msg: "status checked" });
  } catch (error: any) {
    console.log(`Error en /Transactions/allTransactions`);
    return res.status(404).send(error.message);
  }
});

export default router;
