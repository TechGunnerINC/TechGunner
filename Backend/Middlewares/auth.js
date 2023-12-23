import { log } from "console";
import jwt from "jsonwebtoken";
const generateToken = (user, req, res) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT
  );
};

const token = (req, res, next) => {
  try {
    const authHeader = req.headers["Authorization"];

    if (authHeader) {
      const token = authHeader.split("Bearer ")[1];
      jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
          return res.status(403).redirect("auth/login");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).redirect("auth/login");
    }
  } catch (err) {
    console.error(err.message);
  }
};
export { token, generateToken };
