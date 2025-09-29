import { verify } from "crypto";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

export const generateToken = (user_id: string, email: string): string => {
  const payload = { user_id, email };
  const options = { expiresIn: 3600 };

  return jwt.sign(payload, SECRET_KEY, options);
};

export const verifyToken = (
  token: string
): { user_id: string; email: string } | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as {
      user_id: string;
      email: string;
    };

    return {
      ...decoded,
    };
  } catch (error) {
    return null;
  }
};
