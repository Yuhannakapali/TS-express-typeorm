import { Request, Response, NextFunction } from "express";
import { User } from "../entities/user";

export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = await res.locals.user;
    if (!user) throw new Error("unauthenticated");
    return next();
  } catch (error) {
    return res.status(404).json({ error: "Unauthenticated" });
  }
};
