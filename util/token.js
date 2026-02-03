import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const genToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRETE, {
    expiresIn: "7d",
  });
};

export default genToken;
