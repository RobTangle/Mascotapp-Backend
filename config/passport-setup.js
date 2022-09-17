const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/config.js")[env];
require("dotenv").config();
import db from "../models/index";
// import {UserAttributes} from ("../src/types/userTypes")

// SERIALIZACIÓN Y DESERIALIZACIÓN:
//la serialización se hace cuando agarro de mi DB un id del user y lo quiero "serializar" para enviarle ese dato (cookie) al navegador para que el navegador lo tengo mientras navega por la página. Si en algún momento el cliente quiere usar alguna ruta del backend que requiere algún tipo de permiso/autenticación ya sea porque quiere ver información privada (datos de contacto de otros usuarios, su propio perfil, postear una mascota, etc.. cualquier acción que querramos que sólo pueda hacer un usuario registrado, y además con el permiso para hacer específicamente lo que quiera hacer), va a enviarme esa cookie al backend y yo voy a DESERIALIZAR esa cookie para ver si la data que tiene esa cookie le da autorización para hacer lo que quiere hacer (usar alguna ruta específica del backend, como ver datos de contacto de otro usuario, o postear una mascota).

passport.serializeUser((user, done) => {
  console.log("ESTOY EN EL SERIALIZE USER");
  //le paso el id que crea la DB, y NO la id de google.
  done(null, user.id);
});
// esta serializeUser se la meto adentro del try del passport callback function.
// el primer parámetro del done() es para manejar errores. Pero no deberían haber..
//! cuando un método done() se usa adentro del passport callback de acá abajo, lo que hace es ejercutar la función serializeUser de acá arriba, el cual recibe como argumento el user, y adentro de la función usa un done pero pasandole como argumento el user.id
passport.deserializeUser((id, done) => {
  console.log("ESTOY EN EL DESERIALIZE USER");
  // acá sólo recibimos como argumento el id, porque al momento de hacer la serialización y enviar la cookie, sólo enviamos el id serializado.
  // a continuación busco el User en la DB, según el id que nos pasaron mediante la cookie y nosotros deserializamos, y cuando encuentro el user en la DB, le paso ese user como argumento al done().
  db.User.findByPk(id).then((user) => {
    done(null, user);
    // lo que hace este done es meterle una key "user" al objeto req de la ruta app.get("/")
  });
});

if (env === "development") {
  console.log("EN AMBIENTE DE DEVELOPMENT EN PASSPORT-SETUP");
  passport.use(
    new GoogleStrategy(
      {
        //options for the strategy
        callbackURL: "/auth/google/redirect", //este es el redirect que seteo en la URI de redireccionamiento autorizado en console.cloud.google. Google me va a enviar no datos, si no un código por medio de la url query. Se va a ver algo así: www.localhost.com/auth/google/redirect?code=4lksadklaskldkjlsadksk.
        // Yo voy a agarrar ese código y se lo voy a intercambiar a google por datos del user profile. Y una vez que me trae esos datos, se ejecuta el passport callback function de esta función (segundo argumento)
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        // clientID: keys.google.clientID,
        // clientSecret: keys.google.clientSecret,
      },
      async (accessToken, refreshToken, profile, done) => {
        // passport callback function:
        try {
          console.log("passport callback function dispara!!!");
          console.log(profile);
          //check if user already exists in our db:
          let userEncontrado = await db.User.findOne({
            where: { googleId: profile.id },
          });
          if (userEncontrado) {
            //si tengo al user en mi db...:
            console.log(`EL USER YA EXISTE! ES ESTE: ${userEncontrado}`);
            //le meto la serialización para poder enviar la cookie con la data(user.id) serializada. La serialización se hace en la función serializeUser de arriba. El done acá adentro lo que hace es mandar el argumento currentUser como argumento de la función serializeUser, la cual hace otro done() pero con el user.id
            done(null, userEncontrado);
          } else {
            console.log("USER NO ENCONTRADO EN LA DB...");
            console.log("ESTOY EN EL ELSE DE PASSAPORT CALLBACK FN");
            //! crear un user nuevo:
            //  interface UserAttributes {
            //    id: string | undefined;
            //    googleId: string | undefined;
            //    displayName: string | undefined;
            //    email: string | undefined;
            //    name: string | undefined;
            //    postalCode: string | undefined;
            //    aditionalContactInfo: string | undefined;
            //    thumbnail: string | undefined;
            //  }
            //Acá podría hacer un: let validatedUser = validateUser(profile)
            let validatedUser = {
              id: profile.id,
              googleId: profile.id,
              displayName: profile.displayName,
              name: `${profile.name.givenName} ${profile.name.familyName}`,
              email: profile._json.email,
              thumbnail: profile._json.picture,
            };
            let newUser = await db.User.create(validatedUser);
            console.log(`NEW USER CREATED!!! : ${newUser}`);

            done(null, newUser);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    )
  );
} else {
  console.log("EN AMBIENTE NO ES DEVELOPMENT EN PASSPORT-SETUP");
  passport.use(
    new GoogleStrategy(
      {
        //options for the strategy
        callbackURL: "/auth/google/redirect", //este es el redirect que seteo en la URI de redireccionamiento autorizado en console.cloud.google. Google me va a enviar no datos, si no un código por medio de la url query. Se va a ver algo así: www.localhost.com/auth/google/redirect?code=4lksadklaskldkjlsadksk.
        // Yo voy a agarrar ese código y se lo voy a intercambiar a google por datos del user profile. Y una vez que me trae esos datos, se ejecuta el passport callback function de esta función (segundo argumento)
        clientID: process.env[config.clientID],
        clientSecret: process.env[config.clientSecret],
        // clientID: keys.google.clientID,
        // clientSecret: keys.google.clientSecret,
      },
      async (accessToken, refreshToken, profile, done) => {
        // passport callback function:
        try {
          console.log("passport callback function dispara!!!");
          console.log(profile);
          //check if user already exists in our db:
          let userEncontrado = await db.User.findOne({
            where: { googleId: profile.id },
          });
          if (userEncontrado) {
            //si tengo al user en mi db...:
            console.log(`EL USER YA EXISTE! ES ESTE: `);
            //le meto la serialización para poder enviar la cookie con la data(user.id) serializada. La serialización se hace en la función serializeUser de arriba. El done acá adentro lo que hace es mandar el argumento currentUser como argumento de la función serializeUser, la cual hace otro done() pero con el user.id
            console.log(userEncontrado);
            done(null, userEncontrado);
          } else {
            console.log("USER NO ENCONTRADO EN LA DB...");
            console.log("ESTOY EN EL ELSE DE PASSAPORT CALLBACK FN");
            //! crear un user nuevo:
            //  interface UserAttributes {
            //    id: string | undefined;
            //    googleId: string | undefined;
            //    displayName: string | undefined;
            //    email: string | undefined;
            //    name: string | undefined;
            //    postalCode: string | undefined;
            //    aditionalContactInfo: string | undefined;
            //    thumbnail: string | undefined;
            //  }
            //Acá podría hacer un: let validatedUser = validateUser(profile)
            let validatedUser = {
              id: profile.id,
              googleId: profile.id,
              displayName: profile.displayName,
              name: `${profile.name.givenName} ${profile.name.familyName}`,
              email: profile._json.email,
              thumbnail: profile._json.picture,
            };
            let newUser = await db.User.create(validatedUser);
            console.log(`NEW USER CREATED!!! : ${newUser}`);

            done(null, newUser);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    )
  );
}
