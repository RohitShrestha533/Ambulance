import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Token is not valid" });
    }

    req.admin = decoded;
    next();
  });
};

export { checkAuth };
