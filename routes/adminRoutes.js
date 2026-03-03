const express = require("express");
const router = express.Router();

/* LOGIN */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // Hardcoded credentials - ideally should be from database
  if (email === "admin@gmail.com" && password === "123456") {
    req.session.admin = { 
      email,
      loginTime: new Date().toISOString()
    };
    
    return res.json({ 
      message: "Login Successful",
      admin: { email } // Don't send sensitive data
    });
  }

  res.status(401).json({ message: "Invalid Credentials" });
});

/* CHECK AUTH */
router.get("/check-auth", (req, res) => {
  if (req.session?.admin) {
    return res.json({ 
      authenticated: true,
      admin: { email: req.session.admin.email }
    });
  }
  res.status(401).json({ authenticated: false });
});

/* LOGOUT */
router.post("/logout", (req, res) => {
  if (!req.session?.admin) {
    return res.status(400).json({ message: "No active session" });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    
    res.clearCookie("nexa.sid", {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;