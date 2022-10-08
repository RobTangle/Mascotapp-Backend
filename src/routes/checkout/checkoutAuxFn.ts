import db from "../../../models";

// ---------- FUNCIONES AUXILIARES PARA LAS RUTAS: ------------
export const getAllDonations = async () => {
  console.log("en function getAllDonations");
  try {
    const allDonations = await db.Donation.findAll();
    return allDonations;
  } catch (error: any) {
    console.log(error.message);
    return error;
  }
};
