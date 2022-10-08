"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("../../../models/index"));
const CommentValidators_1 = require("../../validators/CommentValidators");
const router = (0, express_1.Router)();
//----- FUNCIONES AUXILIARES PARA LAS RUTAS: ------
// ---- RUTAS: ---------
router.post("/newComment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let commentFromReq = (0, CommentValidators_1.validateNewComment)(req.body);
        let newComment = yield index_1.default.Comment.create(commentFromReq);
        let petAsociado = yield index_1.default.Animal.findByPk(petId);
        yield newComment.setAnimal(petAsociado);
        console.log(`Nuevo comentario creado y asociado a la mascota ${petId}`);
        if (Array.isArray(fotos) && fotos.length > 0) {
            for (const foto of fotos) {
                let newFoto = {
                    url: foto.url,
                    alt: foto.alt,
                };
                let imageCreated = yield index_1.default.Image.create(newFoto);
                console.log(`Image creada con url ${foto.url}`);
                yield imageCreated.setComment(newComment.id);
            }
        }
        console.log(`Retornando respuesta luego de haber creado un nuevo comentario..`);
        return res.status(200).send(newComment);
    }
    catch (error) {
        console.log(`Error en newComment: ${error.message}`);
        return res.status(404).send(`${error.message}`);
    }
}));
router.get("/getComments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Entré a /comments/getComments`);
    try {
        let petId = req.query.petId;
        // let petId = req.body.petId;
        console.log(`req.body.petId = ${petId}`);
        let allTheComments = yield index_1.default.Comment.findAll({
            where: {
                AnimalId: petId,
            },
            include: [{ model: index_1.default.Image }],
        });
        console.log(`Cantidad de comentarios encontrados: ${allTheComments === null || allTheComments === void 0 ? void 0 : allTheComments.length}`);
        return res.status(200).send(allTheComments);
    }
    catch (error) {
        console.log(`Error en comments/getComments`);
        return res.status(404).send(error.message);
    }
}));
exports.default = router;
