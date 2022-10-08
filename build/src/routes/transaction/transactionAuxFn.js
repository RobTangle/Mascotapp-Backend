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
exports.mailer = exports.getAllTransactions = void 0;
const models_1 = __importDefault(require("../../../models"));
const { GMAIL_PASS, GMAIL_USER } = process.env;
//-----  FUNCIONES AUXILIARES: -------------------------------
function getAllTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let allTheTransactionsFromDB = yield models_1.default.Transaction.findAll();
            return allTheTransactionsFromDB;
        }
        catch (error) {
            console.log(`Error en function getAllTransactions. Error message: ${error.message} `);
            throw new Error(error.message);
        }
    });
}
exports.getAllTransactions = getAllTransactions;
function mailer(userOffering, userDemanding, offeringPet) {
    return __awaiter(this, void 0, void 0, function* () {
        const nodemailer = require("nodemailer");
        console.log(GMAIL_PASS, GMAIL_USER);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_PASS,
            },
        });
        //Mail para el demanding
        let demandingMail = userDemanding.email;
        let offeringMail = userOffering.email;
        console.log(userDemanding.email, userOffering.email);
        //const msgMailDemanding = `Registramos que ${userOffering.name} quiere contactarte por ${offeringPet.name}. Te deseamos suerte en tu busqueda y te facilitamos los siguientes datos para contactarte con ${userOffering.name}. Un saludo de parte del equipo de Mascotapp`;
        const mailOptionsDemanding = {
            from: "service.mascotapp@gmail.com",
            to: demandingMail,
            subject: "Alguien está interesado en una mascota tuya",
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
                    <h1>Hemos registrado interes en una de tus publicacions</h1>
                    <p>Registramos que ${userOffering.name} quiere contactarte por ${offeringPet.name}. Te deseamos suerte en tu busqueda y te facilitamos los siguientes datos para contactarte con ${userOffering.name}. Un saludo de parte del equipo de Mascotapp</p>
                    <div>${userOffering.email}</div><div>${userOffering.contact}</div>
    
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
            //`<div>${msgMailDemanding}</div><div>${userOffering.email}</div><div>${userOffering.contact}</div>`,
        };
        transporter.sendMail(mailOptionsDemanding, function (error, info) {
            if (error)
                console.log(error);
            else
                console.log("Email enviado: " + info.response);
        });
        //Mail para el offering
        const msgMailOffering = `Registramos que qures contactarte con ${userDemanding.name} por ${offeringPet.name}. Te deseamos suerte en tu interacción y te facilitamos los siguientes datos para contactarte con ${userDemanding.name}. Un saludo de parte del equipo de Mascotapp.`;
        const mailOptionsOffering = {
            from: "service.mascotapp@gmail.com",
            to: offeringMail,
            subject: "Mucha suerte en tu busqueda",
            html: `<div>${msgMailOffering}</div><div>${userDemanding.email}</div><div>${userDemanding.contact}</div>`,
        };
        transporter.sendMail(mailOptionsOffering, function (error, info) {
            if (error)
                console.log(error);
            else
                console.log("Email enviado: " + info.response);
        });
    });
}
exports.mailer = mailer;
