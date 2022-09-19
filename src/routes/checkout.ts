import { Router } from "express";
import db from "../../models";
const Stripe = require('stripe')
//const stripe = require('../app')
const router = Router();
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "../../../config/config.js")[env];
const { GMAIL_PASS, GMAIL_USER } = process.env

let stripe: any;
if(config.stripeKeyProd){
  stripe = new Stripe(process.env[config.stripeKeyProd])
} else {
  stripe = new Stripe(config.stripeKey)
}

const getAllDonations = async () => {
    console.log('en function getAllDonations')
    try {
      const allDonations = await db.Donation.findAll();
      return allDonations;
    } catch (error: any) {
      console.log(error.message);
      return error;
    }
  };

router.post('/', async (req, res) => {
    console.log('EN LA RUTA POST DE CHECKOUT')
    console.log(req.body)
    try {
        const { id, amount, email } = req.body
        
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Donation",
            payment_method: id,
            confirm: true
        })
        console.log('payment: '+ payment)
        const donation = await db.Donation.create({
            id,
            amount,
            email
        })
        const nodemailer = require('nodemailer')
        console.log(GMAIL_PASS, GMAIL_USER)
        const transporter = nodemailer.createTransport({
          service: 'gmail',
            auth: {
              user: GMAIL_USER,
              pass: GMAIL_PASS
            }
          })
        const msgMail = `Te damos profundas gracias desde Mascotapp por colaborar. Nuestro proyecto necesita de las financiación de los usuarios por lo cual tu aporte es muy importante.`
      
        const mailOptions = {
          from: 'service.mascotapp@gmail.com',
          to: email,
          subject: 'Donación recibida!',
          html: `<div>${msgMail}</div><div>Monto donado: ${amount / 100} USD</div><div>ID de la transferencia: ${id}</div>`
        }

        transporter.sendMail(mailOptions, function(error: any, info: any) {
          if(error) console.log(error)
          else console.log('Email enviado: ' + info.response)
        })

        console.log('donation: ' + donation)
        res.send({msg: 'Succesfull payment'})

    } catch(err: any){
        console.log('error en /checkout')
        res.json({msg: err.raw.message})
    }
})

router.get('/balance', async (req, res) => {
    console.log('ENTRE A LA RUTA BALANCE')
    try {
        let allTheDonations = await getAllDonations();
        console.log('All the donations: ' + allTheDonations)
        return res.status(200).send(allTheDonations);
      } catch (error: any) {
        console.log('error en /balance')
        return res.status(404).send(error.message);
      }
})
export default router;