import jwt from "jsonwebtoken";

export const requireOwnerAuth = (
  req,
  res,
  next
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const [scheme, token] =
      authHeader.split(" ");

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Owner access required.",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};