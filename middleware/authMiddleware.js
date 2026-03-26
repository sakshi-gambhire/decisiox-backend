import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  console.log("JWT_SECRET (VERIFY):", process.env.JWT_SECRET);
  console.log("HEADERS:", req.headers);
  

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("NO AUTH HEADER");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  console.log("TOKEN:", token);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED USER:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ EXPORT BOTH WAYS
export default authMiddleware;
export const verifyToken = authMiddleware;