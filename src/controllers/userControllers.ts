import { RequestHandler } from "express";
import User from "models/userModal";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import AuthVerificationModalToken from "models/authVerificationToken";
import { sendError } from "utils/helpers";

export const registerUser: RequestHandler = async (req, res, next) => {
  const { email, name, password } = req.body;

  // if (!name) return sendError(res, "name is Missing !", 422);
  // if (!email) return sendError(res, "Email is Missing !", 422);
  // if (!password) return sendError(res, "Password is Missing !", 422);

  const existUser = await User.findOne({ email });
  if (existUser) return sendError(res, "user Already Exist", 422);

  const user = await User.create({ email, name, password });

  //generate and store verification token
  const token = crypto.randomBytes(36).toString("hex");
  await AuthVerificationModalToken.create({ owner: user._id, token });

  // send the link the user
  const link = `http://localhost:8000/verify?id=${user._id}&token=${token}`;

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f1229bc25550a2",
      pass: "4d07ec344a0ee9",
    },
  });

  await transport.sendMail({
    from: "no-reply@gmail.com",
    to: user.email,
    html: `<h1>Please  <a href=${link}>click here</a> to Verify your Account</h1>`,
  });
  res.send({ message: "Check your Mail inbox" });

  //   res.json(user);
};

export const verifyEmail: RequestHandler = async (req, res) => {
  const { id, token } = req.body;

  const authToken = await AuthVerificationModalToken.findOne({ owner: id });
  if (!authToken) return sendError(res, "No token Found ", 403);

  const isMatched = await authToken.compareToken(token);
  if (!isMatched) return sendError(res, "No token Found ", 403);

  await User.findByIdAndUpdate(id, { verified: true });
  await AuthVerificationModalToken.findByIdAndDelete(authToken._id);

  res.json({ message: "Your Email is Verified :) " });
};

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return sendError(res, "try with Right Credentials", 403);

  const isMatched = await user.comparePassword(password);
  if (!isMatched) return sendError(res, "try with Right credentials", 403);

  const payload = { id: user._id };
  const accessToken = jwt.sign(payload, "jwt", { expiresIn: "15min" });
  const refreshToken = jwt.sign(payload, "jwt");

  if (!user.token) user.tokens = [refreshToken];
  else user.token.push(refreshToken);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      email: user.email,
      name: user.name,
      verified: user.verified,
    },
    tokens: { refresh: refreshToken, access: accessToken },
  });
};

export const sendProfile: RequestHandler = async (req, res) => {};

export const allUsers: RequestHandler = async (req, res) => {
  const users = await User.find({});

  res.json({ message: "All users ", count: users.length, users });
};
