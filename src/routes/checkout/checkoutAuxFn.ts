import db from "../../../models";

// ---------- FUNCIONES AUXILIARES PARA LAS RUTAS: ------------
export const getAllDonations = async () => {
  console.log("en function getAllDonations");
  const allDonations = await db.Donation.findAll();
  return allDonations;
};
