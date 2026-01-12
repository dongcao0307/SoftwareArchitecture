const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const ACCESS_SECRET = "access_secret_key";
const REFRESH_SECRET = "refresh_secret_key";

// Fake user
const user = {
  id: 1,
  username: "dong",
  role: "USER"
};

// 🔐 LOGIN
app.post("/login", (req, res) => {
  const accessToken = jwt.sign(user, ACCESS_SECRET, {
    expiresIn: "1m"
  });

  const refreshToken = jwt.sign(user, REFRESH_SECRET, {
    expiresIn: "7d"
  });

  res.json({ accessToken, refreshToken });
});
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
app.get("/tickets", authenticateToken, (req, res) => {
  res.json({
    message: "Danh sách vé",
    user: req.user
  });
});
app.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = jwt.sign(user, ACCESS_SECRET, {
      expiresIn: "1m"
    });

    res.json({ accessToken: newAccessToken });
  });
});
app.listen(4000, () => {
  console.log("Server is running on port 3000");
});
