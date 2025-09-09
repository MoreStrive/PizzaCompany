import { Passport } from 'passport';
import dotenv from 'dotenv';
import { Request } from 'express';
import User from '@models/User';
import StaffSystem from '@models/StaffSystem';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import settings from '@configs/settings';

dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: settings.jwt.secret,
  passReqToCallback: true,
};

const userPassport = new Passport();
const actorPassport = new Passport();

const jwtStrategyForUser = new JwtStrategy(jwtOptions, async (req: Request, payload: { id: any }, next: any) => {
  try {
    const user = await User.findByPk(payload.id);
    if (user) {
      req.currentUser = user;
      next(null, user);
    } else {
      next(null, false);
    }
  } catch (error) {
    console.log(error);
  }
});

const jwtStrategyForCMS = new JwtStrategy(jwtOptions, async (req: Request, payload: { id: any }, next: any) => {
  try {
    const actor = await StaffSystem.findByPk(payload.id);
    if (actor) {
      req.currentActor = actor;
      next(null, actor);
    } else {
      next(null, false);
    }
  } catch (error) {
    console.log(error);
  }
});

userPassport.use(jwtStrategyForUser);
actorPassport.use(jwtStrategyForCMS);

export {
  userPassport,
  actorPassport,
};
