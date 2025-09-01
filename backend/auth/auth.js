import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));

// Google Callback
router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173/notes");
  }
);


router.get("/auth/user", (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Not logged in" });
  res.json(req.user);
});


router.get("/auth/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: "Logout failed" });

    req.session.destroy();
    res.clearCookie("connect.sid");

    res.json({ success: true });
  });
});


export default router;
