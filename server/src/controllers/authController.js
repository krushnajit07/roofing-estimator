import jwt from "jsonwebtoken";

export const loginOwner = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (
      username !== adminUsername ||
      password !== adminPassword
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      {
        username,
        role: "owner",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};