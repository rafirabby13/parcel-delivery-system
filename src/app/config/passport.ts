// import passport from "passport";

// import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
// import { envVars } from "./env";
// import { User } from "../modules/user/user.model";
// import { Role } from "../modules/user/user.interface";

// passport.use(new GoogleStrategy({
//     clientID: envVars.GOOGLE_CLIENT_ID,
//     clientSecret: envVars.GOOGLE_CLIENT_SECRET,
//     callbackURL: envVars.GOOGLE_CALLBACK_URL
//   },
//   async function(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
//     try {
//         const email = profile.emails?.[0].value
//         if (!email) {
//             return done(null, false, {message: "Email not found"})
//         }

//         let user = await User.findOne({email})

//         if (!user) {
//             user = await User.create({
//                 email,
//                 name: profile.displayName,
//                 picture: profile.photos?.[0].value,
//                 role: Role.SENDER,
//                 isVerified: true,
//                 auths:[
//                     {
//                         provider: "google",
//                         providerId: profile.id
//                     }
//                 ]
//             })
//         }
//     } catch (error) {
        
//     }
//   }
// ));