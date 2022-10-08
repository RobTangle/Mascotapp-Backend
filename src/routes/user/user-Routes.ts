import { Router } from "express";
import db from "../../../models/index";
import { IPetOfUser, Pet } from "../../types/petTypes";
import { Op } from "sequelize";
import {
  IContactInfoOfOwner,
  IMultipleUserInfo,
  INewUser,
  ISomeUserInfo,
  IUserAttributes,
} from "../../types/userTypes";
import { IReview } from "../../types/reviewTypes";
// import { requiresAuth } from "express-openid-connect";
import jwtCheck from "../../../config/jwtMiddleware";
import { validateNewUser } from "../../validators/UserValidators";
import { ITransaction } from "../../types/transactionTypes";
import {
  emailExistsInDB,
  getAllReviewsRecived,
  getAllTransactions,
  getAllUsers,
  getParsedReviewsToOwner,
  getPostsOfUser,
  getSomeUserInfo,
  parsePetsPostedByUser,
} from "./userAuxFn";
const { GMAIL_PASS, GMAIL_USER } = process.env;

const router = Router();
const multiplierPoints = 1;

//! ----- MIDDLEWARE PARA AUTH : ------
const authCheck = (req: any, res: any, next: any) => {
  const { id } = req.body;
  if (!id) {
    res.send({ msg: "el usuario no existe" });
  } else {
    next(); //continuá al siguiente middleware, que sería el (req, res) => {} de la ruta
  }
};

// ----- ------ ------- RUTAS :  ------ ------- -------

//GET ALL USERS FROM DB:  //! Hay que dejarla comentada ( o borrarla) porque no es seguro poder tener toda la data de los users registrados:

router.get("/", jwtCheck, async (req, res) => {
  console.log("entré al get de Users!");

  try {
    let allTheUsers = await getAllUsers();
    // console.log(allTheUsers);

    return res.status(200).send(allTheUsers);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

// GET NUMBER OF USERS IN DB:
router.get("/numberOfUsersInDB", async (req, res) => {
  console.log("Entré a la route /numberOfUsersInDB");
  try {
    let allUsersInDB = await getAllUsers();
    let numberOfUsersInDB = allUsersInDB.length;
    let numberOfUsersInDBtoString = `${numberOfUsersInDB}`;
    return res.status(200).send(numberOfUsersInDBtoString);
  } catch (error: any) {
    return res.status(404).send(error.message);
  }
});

// GET CONTACT INFO / PET ID
router.get("/contactinfo/:petid", async (req, res) => {
  console.log(`Entré a la ruta /users/contactinfo/:petid`);
  console.log(`:petid = ${req.params.petid}`);
  try {
    let petID = req.params.petid;
    let petInDB = await db.Animal.findByPk(petID);
    let ownerID = petInDB?.UserId;
    let ownerInDB: IUserAttributes = await db.User.findByPk(ownerID);
    if (!ownerInDB) {
      throw new Error(
        `Usuario dueño de la mascota no fue encontrado en la Data Base.`
      );
    }
    let reviewsToOwner = await getParsedReviewsToOwner(ownerID);
    let contactInfoOfOwner: IContactInfoOfOwner = {
      //displayName: ownerInDB.displayName,
      name: ownerInDB.name,
      email: ownerInDB.email,
      city: ownerInDB.city,
      image: ownerInDB.image,
      contact: ownerInDB.contact,
      isDonator: ownerInDB.isDonator,
      linkToDonate: ownerInDB.linkToDonate,
      reviews: [...reviewsToOwner],
    };
    console.log(`contactInfoOfOwner = ${contactInfoOfOwner}`);
    return res.status(200).send(contactInfoOfOwner);
  } catch (error: any) {
    console.log(`error en /contactinfo/:petid = ${error.message}`);
    return res.status(404).send(error.message);
  }
});

// GET(post) ALL PETS OF USER ID:
router.get("/getallpetsofuser", jwtCheck, async (req: any, res) => {
  console.log(`Entré a la ruta "/users/getallpetsofuser".`);
  // console.log(req.body);

  try {
    let userId = req.auth?.sub;
    console.log(`user ID por auth.sub = ${userId}`);

    if (!userId) {
      console.log(
        `Error en /users/getallpetsofuser. El req.body.id es falso/undefined`
      );
      throw new Error(
        `Error en /users/getallpetsofuser. El req.oidc.sub es falso/undefined`
      );
    }
    // let id = req.body.id;
    let petsPostedByUser: Pet[] = await db.Animal.findAll({
      where: {
        UserId: userId,
      },
    });

    if (petsPostedByUser?.length > 0) {
      let parsedPetsPostedByUser: IPetOfUser[] =
        parsePetsPostedByUser(petsPostedByUser);
      return res.status(200).send(parsedPetsPostedByUser);
    } else {
      console.log(
        `Retornando petsPostedByUser con .length <= 0. Su length es ${petsPostedByUser?.length}`
      );
      return res.status(200).send(petsPostedByUser);
    }
  } catch (error: any) {
    console.log(`error en el /users/getallpetsofusers: ${error.message}`);
    return res.status(404).send(error.message);
  }
});

router.delete("/deletePet", jwtCheck, async (req: any, res) => {
  console.log(`En la ruta users/deletePet.`);
  console.log(`petId = ${req.query?.petId}`);
  // console.log(req.body);
  console.log(`req.auth.sub = ${req.auth?.sub}`);
  try {
    let petId = req.query.petId;
    let userId = req.auth?.sub;
    if (!petId || !userId) {
      throw new Error(`El petId y/o userId son falsos.`);
    }
    //buscar instancia de mascota en DB:

    let petToDeleteInDB = await db.Animal.findByPk(petId);
    if (petToDeleteInDB.UserId == userId) {
      //borrar instancia de la DB:
      await db.Transaction.destroy({ where: { pet_id: petId } });

      await petToDeleteInDB.destroy();
      console.log(`pet with id ${petId} ...  soft-destroyed`);
      return res.status(200).send({ msg: "Mascota borrada" });
    } else {
      //retornar que no coincide el petToDelete.UserId con el req.auth.sub
      return res
        .status(400)
        .send(`El ID del cliente no coincide con el UserId de la mascota.`);
    }
  } catch (error: any) {
    console.log(`Hubo un error en el users/deletepet = ${error.message}`);
    return res.status(404).send(error.message);
  }
});

router.post("/newuser", jwtCheck, async (req: any, res) => {
  console.log(`Entré en /user/newUser`);
  try {
    const id = req.auth?.sub;
    if (!id) {
      throw new Error(`El id por token "${id}" es falso`);
    }

    const { email, name, city, contact, image, linkToDonate } = req.body;

    const isBanned = await db.Ban.findOne({ where: { email: email } });
    if (isBanned) {
      throw new Error(`El email ${email} esta registrado como baneado.`);
    }

    let emailExisteEnLaDB = await emailExistsInDB(email);
    if (emailExisteEnLaDB) {
      throw new Error(
        `El email ${email} ya está registrado. Por favor, use otro email para el registro.`
      );
    }

    const newUserFromReq: INewUser = {
      id: req.auth.id,
      email: email,
      name: name,
      contact: contact,
      city: city,
      image: image,
      linkToDonate: linkToDonate,
    };

    const validatedNewUser = validateNewUser(newUserFromReq);
    console.log(`New User: ${validatedNewUser}`);
    let newUserCreated = await db.User.create(validatedNewUser);
    if (newUserCreated) {
      console.log(`Nuevo usuario creado con email ${newUserCreated.email}:`);
      return res.status(200).send(newUserCreated);
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(404).send(error.message);
  }
});

router.get("/exists", jwtCheck, async (req: any, res) => {
  console.log(`Entré al GET users/exists`);

  try {
    const id = req.auth?.sub;
    console.log(`Buscando si existe el usuario con id ${id}`);
    let user = await db.User.findByPk(id);
    //chequeo si está baneado:
    let userBanned = await db.Ban.findByPk(id);
    if (userBanned) {
      console.log(`El usuario con id ${id} se encuentra baneado`);
      return res.status(200).send({ msg: "banned" });
    }
    if (!user) {
      console.log(`Usuario con id: ${id} no encontrado`);
      return res.send({ msg: false });
    } else {
      console.log(`Usuario con id: ${id} encontrado.`);
      return res.send({ msg: true });
    }
  } catch (error: any) {
    console.log(`Error en users/exists. ${error.message}`);
    return res.status(404).send(error);
  }
});

router.put("/update", jwtCheck, async (req: any, res) => {
  console.log(`Entré a users/update`);
  console.log(`Me llegó por body: `);
  console.log(req.body);
  try {
    const id = req.auth?.sub;
    if (!id) {
      throw new Error(`El id del token "${id}" no es válido.`);
    }
    // const { image, contact, city, email, name, linkToDonate } = req.body;
    let updatedNewProfileFromReq: INewUser = {
      id: id,
      ...req.body,
    };
    let validatedNewProfile = validateNewUser(updatedNewProfileFromReq);
    const newProfile = await db.User.update(validatedNewProfile, {
      where: {
        id: id,
      },
    });

    console.log(`Perfil de usuario actualizado: `);
    console.log(newProfile);
    return res.status(200).send(newProfile);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/getMultipleUserInfo", jwtCheck, async (req: any, res) => {
  console.log(`Entré a la ruta /users/getMultipleUserInfo`);
  console.log(`req.auth.sub = ${req.auth?.sub}`);
  try {
    if (req.auth?.sub) {
      let userId = req.auth.sub;
      let someUserInfo: ISomeUserInfo = await getSomeUserInfo(userId); //obj con props
      let userReviewsRecived: IReview[] = await getAllReviewsRecived(userId); //arreglo de objs
      let userTransactions: ITransaction[] = await getAllTransactions(userId); //arreglo de objs
      let postsOfUser: Pet[] = await getPostsOfUser(userId); //arreglo de objs
      console.log(`Devolviendo multipleUserInfo...`);
      //! TODO ESTO PODRÏA ESTAR ADENTRO DE UN Promise.all() ?? Sería mejor?
      const multipleUserInfo: IMultipleUserInfo = {
        userProps: { ...someUserInfo },
        reviews: [...userReviewsRecived],
        transactions: [...userTransactions],
        posts: [...postsOfUser],
      };
      return res.status(200).send(multipleUserInfo);
    } else {
      throw new Error(`El id '${req.auth.sub}' es falso.`);
    }
  } catch (error: any) {
    console.log(`Error en /users/getMultipleUserInfo. ${error.message}`);
    return res.status(400).send(error.message);
  }
});

router.get("/ranking", async (req, res) => {
  console.log(`Estoy en /users/ranking.`);
  try {
    let allTheUsers: IUserAttributes[] = await getAllUsers();

    const ranking = allTheUsers.sort(function (a: any, b: any) {
      return b.points - a.points;
    });

    const topTen = ranking.slice(0, 9);

    res.status(200).send(topTen);
  } catch (error: any) {
    console.log(`Error en /users/ranking. ${error.message}`);
    return res.status(400).send(error.message);
  }
});

router.get("/points", jwtCheck, async (req: any, res) => {
  console.log(`Estoy en /users/points.`);
  try {
    const id = req.auth?.sub;
    const user: IUserAttributes = await db.User.findOne({ where: { id: id } });
    if (user) {
      return res.status(200).send({ points: user.points });
    }
    console.log(`No se encontró al usuario por id`);
    return res.status(200).send("no existe el usuario");
  } catch (error: any) {
    console.log(`Error en /users/points ${error.message}`);
    return res.status(400).send(error.message);
  }
});

router.get("/rankingGaveAdoption", async (req, res) => {
  console.log(`Estoy en /users/rankingGaveAdoption.`);
  try {
    let allTheUsers = await getAllUsers();

    const ranking = allTheUsers.sort(function (a: any, b: any) {
      return b.gaveUpForAdoption - a.gaveUpForAdoption;
    });

    const topTen = ranking.slice(0, 9);

    res.status(200).send(topTen);
  } catch (error: any) {
    console.log(`Error en /users/rankingGaveAdoption. ${error.message}`);
    return res.status(400).send(error.message);
  }
});

router.post("/buyProducts", jwtCheck, async (req: any, res) => {
  console.log(`Estoy en /users/buyProducts.`);
  try {
    const { name, items, totalPoints, mail, direccion } = req.body;
    let userID = req.auth?.sub;
    const user = await db.User.findOne({ where: { id: userID } });
    if (user) {
      console.log(user, totalPoints, items);
      user.points = user.points - totalPoints;
      await user.save();

      const nodemailer = require("nodemailer");
      console.log(GMAIL_PASS, GMAIL_USER);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_PASS,
        },
      });

      const msgMail = `Hola ${name} estamos preparando tu compra para enviarla a ${direccion}. Te daremos aviso cuando el producto esté en camino.`;

      const mailOptions = {
        from: "service.mascotapp@gmail.com",
        to: mail,
        subject: "Tu compra está siendo preparada",
        html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      
          <style>
              p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Roboto', sans-serif !important;}
              h1{ font-size: 30px !important;}
              h2{ font-size: 25px !important;}
              h3{ font-size: 18px !important;}
              h4{ font-size: 16px !important;}
              p, a{font-size: 15px !important;}
              .imag{
                  width: 20px;
                  height: 20px;
              }
              .contA{
                  margin: 0px 5px 0 5px;
              }
          </style>
      </head>
      <body>
          <div style="width: 100%; background-color: #e3e3e3;">
              <div style="padding: 20px 10px 20px 10px;">
      
                  <div style="background-color: #ffffff; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                      <h1>Registramos tu compra🙌🙌🙌</h1>
                      <p>Hola ${name} estamos preparando tu compra para enviarla a ${direccion}. Te daremos aviso cuando el producto esté en camino.</p>
      
                      <div>Productos: ${items.map((i: any) => {
                        return i.title;
                      })}</div>
                        <div>Puntos: ${totalPoints}</div>
                      <!-- Gracias -->
                      <p style="margin-bottom: 50px;"><i>Atentamente:</i><br>El equipo de Mascotapp❤️❤️❤️</p>
                  </div>
                  <!-- Contenido principal -->
      
                  <!-- Footer -->
                  <div style="background-color: #282828; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                      <!-- Redes sociales -->
                      <a href="https://github.com/laureanomarenco/mascotapps-front" class="contA">GitHub</a>
                      <a href="https://mascotapps.vercel.app/" class="contA">Mascotapp</a>
                  </div>
              </div>
          </div>
      </body>
      </html>`,
        // `<div>${msgMail}</div><div>Productos: ${items.map((i: any) => {
        //   return i.title;
        // })}</div><div>Puntos: ${totalPoints}</div><div>Muchas gracias de parte del equipo de mascotapp.</div>`
      };

      transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) console.log(error);
        else console.log("Email enviado: " + info.response);
      });

      return res.status(200).send("compra realizada exitosamente");
    }
    console.log(`El usuario con id "${userID} no existe"`);

    return res.status(404).send("el usuario no existe");
  } catch (error: any) {
    console.log(`Error en /users/buyProducts. ${error.message}`);
    return res.status(400).send(error.message);
  }
});

// DONATE POINTS:
router.post("/donatePoints", jwtCheck, async (req: any, res) => {
  console.log(`Estoy en /users/donatePoints.`);
  try {
    const id = req.auth?.sub;
    if (!id) {
      throw new Error(`El req.auth.sub es falso`);
    }
    const { idToDonate, pointsToDonate } = req.body;
    const user = await db.User.findOne({ where: { id: id } });
    const userToDonate = await db.User.findOne({ where: { id: idToDonate } });

    if (user && userToDonate && user.points >= pointsToDonate) {
      user.points = user.points - parseInt(pointsToDonate);
      await user.save();

      userToDonate.points = userToDonate.points + parseInt(pointsToDonate);
      await userToDonate.save();

      console.log(
        `Se donaron ${pointsToDonate} mascopoints al usuario con name "${userToDonate.name}"`
      );
      return res.status(200).send({
        msg: `¡Has donado ${pointsToDonate} mascopoints a ${userToDonate.name}! Gracias por usar Mascotapp 🐶`,
      });
    }
    console.log("No se donó. Algo falló en el if anterior.");
    return res.status(409).send({
      msg: "Lo siento. Algo salió mal. Es posible que el usuario al que quiere donarle ya no exista más.",
    });
  } catch (error: any) {
    console.log(`Error en /users/donatePoints. ${error.message}`);
    return res.status(400).send({ msg: "Lo siento. Hubo un error." });
  }
});

export default router;
