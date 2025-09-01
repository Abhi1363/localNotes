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


const MONGO_URI = "mongodb://1362003abhi:Abhi1363@cluster0-shard-00-00.znatey4.mongodb.net:27017,cluster0-shard-00-01.znatey4.mongodb.net:27017,cluster0-shard-00-02.znatey4.mongodb.net:27017/notesapp?ssl=true&replicaSet=atlas-bc5wvr-shard-0&authSource=admin&retryWrites=true&w=majority";



mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

app.use(cors({
  origin: process.env.FRONTEND_URL,  
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI, 
    collectionName: "sessions",
  }),
  cookie: { 
    secure: process.env.NODE_ENV === "production", 
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", authRoutes);

const ensureAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  next();
};

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
  if (!text || !text.trim()) return res.status(400).json({ message: "Note text is required" });
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
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
