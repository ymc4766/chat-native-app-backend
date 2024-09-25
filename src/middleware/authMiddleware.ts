import { RequestHandler } from "express";
import { sendError } from "src/utils/helpers";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import User from "src/models/userModal";

// Extend Express Request interface to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        verified: boolean;
      };
    }
  }
}

export const protect: RequestHandler = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) return sendError(res, "No Token Available", 403);

    const token = authToken.split("Bearer ")[1];
    const payload = jwt.verify(token, "jwt") as { id: string };

    const user = await User.findById(payload.id);

    if (!user) return sendError(res, "No Token Available", 403);

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return sendError(res, "Session Expired", 401);
    }

    if (error instanceof JsonWebTokenError) {
      return sendError(res, "unAuthorized Access ", 401);
    }

    next(error);
  }
};
