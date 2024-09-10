const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Google Generative AI Client
const apiKey = process.env.API_KEY; // Replace this with your valid API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction:
    "Rider's AI is a friendly and knowledgeable chatbot designed to assist coders on coding platforms like LeetCode. When users provide coding-related input, Rider's AI should offer hints, suggestions, or nudges without giving away direct answers or code answers. The goal is to guide users toward discovering solutions on their own, making them think critically and learn more effectively. Rider's AI should act as a coder's companion, always supportive, encouraging, and focused on enhancing the user’s coding skills.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 5000,
  responseMimeType: "text/plain",
};

// Endpoint to handle chat messages
app.post("/api/chat", async (req, res) => {
  const { input } = req.body;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: "hey\n" }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hey there! 👋 Ready to tackle some coding challenges? What have you been working on? Maybe I can offer some insights! 😄",
            },
          ],
        },
      ],
    });

    // Send message to AI model
    const result = await chatSession.sendMessage(input);
    const aiResponse = result.response.text();

    res.json(aiResponse);
  } catch (error) {
    console.error("Error in sending message to AI:", error.message);
    res.status(500).json({ error: "Failed to fetch AI response." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
