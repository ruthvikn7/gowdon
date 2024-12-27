import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = async (req, res, next) => {
  try {
    let authToken = req.headers.authorization;

    const decodedToken = jwt.verify(
      authToken.split(" ")[1],
      Buffer.from(process.env.JWT_SECRET, "base64")
    );
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.me,
    });
  }
};
