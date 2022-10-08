import { Router } from "express";
import db from "../../../models/index";
import { visitor } from "../../types/visitorTypes";
const { GMAIL_PASS, GMAIL_USER } = process.env;

const route = Router();

// -------- FUNCIONES AUXULIARES : -------------

// -------- RUTAS : ----------------------------------
route.get("/addVisitor", async (req: any, res) => {
  // console.log(`Entré a /visitor`);
  try {
    let newVisitor: visitor = {
      id: undefined,
    };
    let newVisit = await db.Visitor.create(newVisitor);
    // console.log(`Visita registrada en la DB`);
    return res.sendStatus(201);
  } catch (error: any) {
    console.log(`Error en /visitor/`);
    return error.message;
  }
});

route.get("/numbervisitors", async (req: any, res: any) => {
  console.log("Entré a /numbervisitors");
  try {
    let arrayVisitors = await db.Visitor.findAll();
    let numberOfVisitors = arrayVisitors.length;
    res.status(200).send(`${numberOfVisitors}`);
  } catch (error: any) {
    console.log(`Error en visitors/numberVisitors. ${error.message}`);

    res.status(404).send(error.message);
  }
});

route.post("/mailAdmin", async (req, res) => {
  console.log(`Entré a visitor/mailAdmin`);

  try {
    const { email, comment } = req.body;
    console.log(`req.body.email = ${email}`);
    console.log(`req.body.comment = ${comment}`);

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
      to: "service.mascotapp@gmail.com",
      subject: "Consulta sobre la página",
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
                <h1>Llegó la siguiente consulta desde el mail ${email}</h1>
                <p>${comment}
                </p>

                <!-- Gracias -->
                <p>Gracias por tu tiempo.</p>
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
    };

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) console.log(error);
      else console.log("Email enviado: " + info.response);
    });
  } catch (error: any) {
    console.log(`Error en /mailAdmin. ${error.message}`);
    return res.status(404).send(error);
  }
});
export default route;
