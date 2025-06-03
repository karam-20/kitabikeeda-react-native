import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token)
      return res
        .status(401)
        .json({ message: "Access denied, no token provided" });

    // decode the toke
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user
    const user = await User.findOne(decoded.userId).select(-password);

    if (!user) return res.status(401).json({ message: "Token is not valid" });

    req.user = user;
    next();
  } catch (error) {
     return res
        .status(401)
        .json({ message: "Token is not valid" });
  }
};
