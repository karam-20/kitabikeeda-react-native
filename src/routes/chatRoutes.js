import express from "express";
const router = express.Router();

const responses = [
  {
    keywords: ["hello", "hi", "hey"],
    reply: "Hello! 👋 How can I help you today?",
  },
  {
    keywords: ["how are you"],
    reply: "I'm just a bot, but I'm doing great! 😄",
  },
  {
    keywords: ["help", "support"],
    reply: "Sure! I'm here to help. What do you need support with?",
  },
  {
    keywords: ["bye", "goodbye", "see you"],
    reply: "Goodbye! 👋 Have a great day!",
  },
  { keywords: ["thanks", "thank you"], reply: "You're welcome! 😊" },
  { keywords: ["name"], reply: "I'm just a simple dummy bot." },
  {
    keywords: ["time"],
    reply: `The current time is ${new Date().toLocaleTimeString()}.`,
  },
  {
    keywords: ["date"],
    reply: `Today's date is ${new Date().toLocaleDateString()}.`,
  },
];

const fallback = "Sorry, I didn't understand that. Can you please rephrase?";

router.post("/", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ message: "Invalid message." });
  }

  const lower = message.toLowerCase();

  const match = responses.find((r) =>
    r.keywords.some((kw) => lower.includes(kw))
  );

  const reply = match ? match.reply : fallback;

  setTimeout(() => {
    res.json({ reply });
  }, 800);
});

export default router;
