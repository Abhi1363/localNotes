import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import authRoutes from "./auth/auth.js";
import "./auth/passport.js"; // Passport strategy
import Note from "./models/Note.js";
import MongoStore from "connect-mongo";

dotenv.config();
const app = express();

// Local MongoDB URI
const MONGO_URI = "mongodb://127.0.0.1:27017/notesapp";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected (localhost)"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // your Vite frontend
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: false, // use false for localhost (true only in production/https)
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);

// Middleware: Ensure Auth
const ensureAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  next();
};

// Routes
app.get("/notes", ensureAuth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.post("/notes", ensureAuth, async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim())
    return res.status(400).json({ message: "Note text is required" });
  try {
    const newNote = new Note({ text: text.trim(), user: req.user._id });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add note" });
  }
});

app.delete("/notes/:id", ensureAuth, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
