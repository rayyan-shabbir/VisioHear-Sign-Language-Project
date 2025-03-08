import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 9000;
const app = express();

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET_KEY
});

// CORS options for allowing requests from specific origins
const corsOptions = {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true, // Important for cookies
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies


// Global variable to hold the conversation history
let conversationHistory = [
    { role: "system", content: "You are a helpful assistant for Pkaistani Sign language website." },
];


app.post("/ask", async (req, res) => {
    const userMessage = req.body.message;

    // Update conversation history with the user's message
    conversationHistory.push({ role: "user", content: userMessage });

    try {
        // Request a completion from OpenAI based on the updated conversation history
        const completion = await openai.chat.completions.create({
            messages: conversationHistory,
            model: "ft:gpt-3.5-turbo-0125:personal:bestsherbot:9UcmEf02",
        });

        // Extract the response
        const botResponse = completion.choices[0].message.content;

        // Update conversation history with the assistant's response
        conversationHistory.push({ role: "assistant", content: botResponse });

        // Send the assistant's response back to the client
        res.json({ message: botResponse });

    } catch (error) {
        console.error("Error calling OpenAI: ", error);
        res.status(500).send("Error generating response from OpenAI");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
