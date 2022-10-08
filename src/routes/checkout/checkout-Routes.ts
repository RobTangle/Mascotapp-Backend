const env = process.env.NODE_ENV || "development";
// const config = require(__dirname + "../../../config/config.js")[env];
const { GMAIL_PASS, GMAIL_USER, STRIPE_KEY } = process.env;
import { Router } from "express";
import db from "../../../models";
import { getAllDonations } from "./checkoutAuxFn";
const Stripe = require("stripe");
const router = Router();

let stripe: any;
stripe = new Stripe(STRIPE_KEY);

// ----------- RUTAS : --------------------------

router.post("/", async (req, res) => {
  console.log("EN LA RUTA POST DE CHECKOUT");
  console.log(req.body);
  try {
    const { id, amount, email } = req.body;

    let amountToDonate = amount / 100;

    const user: any = await db.User.findOne({ where: { email: email } });

    const multiplierPoints = await db.Multiplier.findByPk(1);
    user.points = Math.ceil(
      user.points + 10 * amountToDonate * multiplierPoints.number
    );
    await user.save();
    //DONACIÓN
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Donation",
      payment_method: id,
      confirm: true,
    });
    console.log("payment: " + payment);
    const donation = await db.Donation.create({
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
      
                      <div>Monto donado: ${
                        amount / 100
                      } USD</div><div>ID de la transferencia: ${id}</div>
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
      </html>`,
      // `<div>${msgMail}</div><div>Monto donado: ${
      //   amount / 100
      // } USD</div><div>ID de la transferencia: ${id}</div>`,
    };

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) console.log(error);
      else console.log("Email enviado: " + info.response);
    });
    //CHECK USER
    if (user) {
      await donation.setUser(user);
      console.log(`Donación asociada al user con id "${user.id}".`);

      await db.User.update({ isDonator: "true" }, { where: { id: user.id } });
      return res.send({ msg: "Succesfull payment from", user });
    } else {
      console.log("donation: " + donation);
      return res.send({ msg: "Succesfull payment" });
    }
  } catch (err: any) {
    console.log("error en /checkout");
    return res.json({ msg: err.raw.message });
  }
});

router.get("/balance", async (req, res) => {
  console.log("ENTRE A LA RUTA BALANCE");
  try {
    let allTheDonations = await getAllDonations();
    console.log("All the donations: " + allTheDonations);
    return res.status(200).send(allTheDonations);
  } catch (error: any) {
    console.log("error en /balance");
    return res.status(404).send(error.message);
  }
});

export default router;
