import jwt from "jsonwebtoken";
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT
  );
};

const token = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};
export { token, generateToken };