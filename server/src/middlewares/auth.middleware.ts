import prisma from '../config/prisma';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

const JWT_SECRET = process.env.JWT_SECRET;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new Strategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      done(null, user || false);
    } catch (error) {
      console.error(error);
      done(error, false);
    }
  })
);

export const jwtMiddleware = passport.authenticate('jwt', { session: false });
