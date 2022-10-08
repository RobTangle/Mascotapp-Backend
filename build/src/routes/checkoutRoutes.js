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
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "../../../config/config.js")[env];
const { GMAIL_PASS, GMAIL_USER, STRIPE_KEY } = process.env;
const express_1 = require("express");
const models_1 = __importDefault(require("../../models"));
const Stripe = require("stripe");
const router = (0, express_1.Router)();
let stripe;
stripe = new Stripe(STRIPE_KEY);
// ---------- FUNCIONES AUXILIARES PARA LAS RUTAS: ------------
const getAllDonations = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("en function getAllDonations");
    try {
        const allDonations = yield models_1.default.Donation.findAll();
        return allDonations;
    }
    catch (error) {
        console.log(error.message);
        return error;
    }
});
// ----------- RUTAS : --------------------------
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("EN LA RUTA POST DE CHECKOUT");
    console.log(req.body);
    try {
        const { id, amount, email } = req.body;
        let amountToDonate = amount / 100;
        const user = yield models_1.default.User.findOne({ where: { email: email } });
        const multiplierPoints = yield models_1.default.Multiplier.findByPk(1);
        user.points = Math.ceil(user.points + 10 * amountToDonate * multiplierPoints.number);
        yield user.save();
        //DONACIÓN
        const payment = yield stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Donation",
            payment_method: id,
            confirm: true,
        });
        console.log("payment: " + payment);
        const donation = yield models_1.default.Donation.create({
            id,
            amount: amountToDonate,
            email,
        });
        // MAILER
        const nodemailer = require("nodemailer");
        console.log(GMAIL_PASS, GMAIL_USER);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_PASS,
            },
        });
        const mailOptions = {
            from: "service.mascotapp@gmail.com",
            to: email,
            subject: "Donación recibida!",
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
                      <h1>Gracias por tu donación!</h1>
                      <p>Te damos profundas gracias desde Mascotapp por colaborar. Nuestro proyecto necesita de las financiación de los usuarios por lo cual tu aporte es muy importante.</p>
      
                      <div>Monto donado: ${amount / 100} USD</div><div>ID de la transferencia: ${id}</div>
                      <!-- Gracias -->
                      <p style="margin-bottom: 50px;"><i>Atentamente:</i><br>El equipo de Mascotapp</p>
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
      </html>`
            // `<div>${msgMail}</div><div>Monto donado: ${
            //   amount / 100
            // } USD</div><div>ID de la transferencia: ${id}</div>`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error)
                console.log(error);
            else
                console.log("Email enviado: " + info.response);
        });
        //CHECK USER
        if (user) {
            yield donation.setUser(user);
            console.log(`Donación asociada al user con id "${user.id}".`);
            yield models_1.default.User.update({ isDonator: "true" }, { where: { id: user.id } });
            return res.send({ msg: "Succesfull payment from", user });
        }
        else {
            console.log("donation: " + donation);
            return res.send({ msg: "Succesfull payment" });
        }
    }
    catch (err) {
        console.log("error en /checkout");
        return res.json({ msg: err.raw.message });
    }
}));
router.get("/balance", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ENTRE A LA RUTA BALANCE");
    try {
        let allTheDonations = yield getAllDonations();
        console.log("All the donations: " + allTheDonations);
        return res.status(200).send(allTheDonations);
    }
    catch (error) {
        console.log("error en /balance");
        return res.status(404).send(error.message);
    }
}));
exports.default = router;
