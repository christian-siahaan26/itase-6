// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: '/api/auth/google/callback', // Sesuaikan dengan route Anda
//       scope: ['profile', 'email'],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Cari user berdasarkan google_id
//         let user = await prisma.user.findUnique({
//           where: { google_id: profile.id },
//         });

//         if (user) {
//           return done(null, user); // User ditemukan, langsung login
//         }

//         // Jika tidak ada, cari berdasarkan email
//         user = await prisma.user.findUnique({
//           where: { email: profile.emails?.[0].value },
//         });

//         if (user) {
//           // User dengan email ini sudah ada (mungkin daftar via email/pass)
//           // Tautkan akunnya dengan google_id
//           const updatedUser = await prisma.user.update({
//             where: { email: user.email },
//             data: { google_id: profile.id },
//           });
//           return done(null, updatedUser);
//         }

//         // Jika user benar-benar baru, buat user baru
//         const newUser = await prisma.user.create({
//           data: {
//             google_id: profile.id,
//             email: profile.emails?.[0].value!,
//             name: profile.displayName,
//             // Anda bisa menambahkan foto profil dari `profile.photos?.[0].value` jika ada di schema
//           },
//         });

//         return done(null, newUser);
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );

// // Ini opsional, hanya jika Anda menggunakan session-based auth
// passport.serializeUser((user: any, done) => {
//   done(null, user.user_id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { user_id: id } });
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });