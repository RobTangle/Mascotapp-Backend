import { Router } from "express";
import db from "../../../models/index";
import { validateNewComment } from "../../validators/CommentValidators";
import { IComment, ICommentResponse } from "../../types/commentTypes";
import { IImage } from "../../types/imageTypes";

const router = Router();

//----- FUNCIONES AUXILIARES PARA LAS RUTAS: ------

// ---- RUTAS: ---------

router.post("/newComment", async (req, res) => {
  console.log(`Entré a la ruta /comments/newComment`);
  try {
    let petId = req.body.petId;
    console.log(`req.body.petId = ${petId}`);
    if (!petId) {
      throw new Error(`El petId es falso/undefined`);
    }

    let fotos;
    if (req.body.fotos) {
      fotos = req.body.fotos;
    }
    console.log(`fotos:`);
    console.log(fotos);

    let commentFromReq = validateNewComment(req.body);
    let newComment = await db.Comment.create(commentFromReq);
    let petAsociado = await db.Animal.findByPk(petId);
    await newComment.setAnimal(petAsociado);
    console.log(`Nuevo comentario creado y asociado a la mascota ${petId}`);
    if (Array.isArray(fotos) && fotos.length > 0) {
      for (const foto of fotos) {
        let newFoto: IImage = {
          url: foto.url,
          alt: foto.alt,
        };
        let imageCreated = await db.Image.create(newFoto);
        console.log(`Image creada con url ${foto.url}`);
        await imageCreated.setComment(newComment.id);
      }
    }
    console.log(
      `Retornando respuesta luego de haber creado un nuevo comentario..`
    );
    return res.status(200).send(newComment);
  } catch (error: any) {
    console.log(`Error en newComment: ${error.message}`);
    return res.status(404).send(`${error.message}`);
  }
});

router.get("/getComments", async (req, res) => {
  console.log(`Entré a /comments/getComments`);
  try {
    let petId = req.query.petId;
    // let petId = req.body.petId;
    console.log(`req.body.petId = ${petId}`);
    let allTheComments: ICommentResponse[] = await db.Comment.findAll({
      where: {
        AnimalId: petId,
      },
      include: [{ model: db.Image }],
    });
    console.log(
      `Cantidad de comentarios encontrados: ${allTheComments?.length}`
    );

    return res.status(200).send(allTheComments);
  } catch (error: any) {
    console.log(`Error en comments/getComments`);
    return res.status(404).send(error.message);
  }
});

export default router;
