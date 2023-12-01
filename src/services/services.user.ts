import { AppDataSource } from "../dataSource";
import { User } from "../entities/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createNewUser = async (userfeature: any) => {
  try {
    const user = await findUserByEmail(userfeature.email);
    if (user) {
      return { success: false, error: "email is already taken" };
    }
    const newUser = await User.create(userfeature);
    await newUser.save();
    return { success: true, body: newUser };
  } catch (error) {
    console.log("error");
    return { success: false, error: error };
  }
};

export function generateJWT(payload: any) {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, secret, { expiresIn: "1d" });
}

export const loginUser = async (email: string, password: string) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return { success: false, error: "user with this email does not exist" };
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return {
        success: false,
        status: 400,
        error: "password did not match with this email",
      };
    }
    const token = generateJWT({ email });
    return { success: true, status: 200, message: "welcome", token: token };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });
  return user;
};
export const findUserById = async (id: number) => {
  const user = await User.findOne({
    where: {
      id: Number(id),
    },
  });
  return user;
};

export const getAllUsers = async () => {
  try {
    const user = await User.find();
    if (!user) {
      return { success: false, error: "no user found" };
    }
    return { success: true, body: user };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const getUser = async (id: any) => {
  try {
    const user = await findUserById(id);
    if (!user) {
      return { success: false, error: "no user found" };
    }
    return { success: true, body: user };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const updateUser = async (userfeature: any, id: any) => {
  try {
    const user = findUserById(id);
    if (!user) {
      return { success: false, error: "no user found" };
    }
    const updatedUser = AppDataSource.createQueryBuilder()
      .update(User)
      .set(userfeature)
      .where({ id: id })
      .execute();
    return { success: true, body: updatedUser };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const deleteUser = async (id: any) => {
  try {
    const user = await findUserById(id);
    if (!user) {
      return { success: false, error: "User not found" };
    }
    await User.remove(user);
    return { success: true, msg: `user with id ${id} was removed` };
  } catch (error) {
    console.log("something went wrong");
    return { success: false, error: "something went wrong" };
  }
};