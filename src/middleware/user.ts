import { Response, Request, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "../entities/user";  

export default async (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = req.cookies.token;
    if (!token) {return next();}  

    const jwtSecret = process.env.JWT_SECRET as Secret;

    const { email }: any = jwt.verify(token, jwtSecret);

    const user = await User.findOne({ where: { email } });
    res.locals.user = user;
    return next();
  } catch (error) {
    next(error);
  }
};