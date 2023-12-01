import express, { Request, Response } from "express";
import user from "../middleware/user";
import auth from "../middleware/auth";

import {
  createNewUser,
  deleteUser,
  getAllUsers,
  getUser,
  loginUser,
  updateUser,
} from "../services/services.user";

export const router = express.Router();

//create a user
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ error: "please fill all the credentials" });
    }
    const userfeature = { ...req.body };
    const newUser = await createNewUser(userfeature);
    return res.status(200).json({ newUser });
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
});

// login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "please fill all the credentials" });
    }
    const user = await loginUser(email, password);
    res.cookie("token", user.token, { httpOnly: true, maxAge: 360000 });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: "something went wrong" });
  }
});

router.get("/logout", user, auth, async (_: Request, res: Response) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  return res.status(200).json({ success: true });
});

//get all user
router.get("/user", async (_: Request, res: Response) => {
  try {
    const user = await getAllUsers();
    return res.status(200).json({ user });
  } catch (error) {
    throw new Error("something went wrong");
  }
});

router.get("/me", user, auth, (_: Request, res: Response) => {
  return res.json(res.locals.user);
});

// get single user
router.get("/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUser(id);
  if (!user) {
    return res.status(404).json({ success: false, error: "no user found" });
  }
  return res.status(200).json({ success: true, user });
});

//  update user
router.put("/user/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userfeature = { ...req.body };
    const updatedUser = await updateUser(userfeature, id);
    return res.status(201).json({ updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
});

// delete user
router.delete("/user/:id", async (req: Request, _: Response) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
  } catch (error) {
    console.log(error);
  }
});
