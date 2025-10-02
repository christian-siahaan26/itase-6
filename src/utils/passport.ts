import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import { getErrorMessage } from "./error";

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { google_id: profile.id },
        });

        if (user) {
          return done(null, user);
        }

        const userEmail = profile.emails?.[0].value;
        if (!userEmail) {
            return done(new Error("Google account email not found."), false);
        }

        user = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        if (user) {
          const updatedUser = await prisma.user.update({
            where: { email: user.email },
            data: { google_id: profile.id },
          });
          return done(null, updatedUser);
        }

        const newUser = await prisma.user.create({
          data: {
            google_id: profile.id,
            email: userEmail,
            name: profile.displayName,
          },
        });

        return done(null, newUser);
      } catch (error) {
        return done(getErrorMessage(error), false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { user_id: id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});