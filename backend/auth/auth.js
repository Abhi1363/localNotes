import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";



import User from "../models/User.js";
import Note from "../models/Note.js";


dotenv.config(); 
const router = express.Router();

// --- Passport ---
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// --- Initialize Passport ---
router.use(passport.initialize());
router.use(passport.session());

// --- Routes ---

// Google Login
router.get("/auth/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"], 
    prompt: "select_account"
  })
);

// Google Callback
router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/notes`);
  }
);

router.get("/auth/user", (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Not logged in" });
  res.json(req.user);
});


router.get("/auth/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send("Error logging out");
    req.session.destroy();
    res.clearCookie("connect.sid");
   res.redirect(`${process.env.FRONTEND_URL}`);
  });
});




router.get("/notes", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  const notes = await Note.find({ user: req.user._id }).sort({ _id: -1 });
  res.json(notes);
});


router.post("/notes", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  try {
    const newNote = new Note({
      text: req.body.text,
      user: req.user._id
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/notes/:id", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  await Note.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
