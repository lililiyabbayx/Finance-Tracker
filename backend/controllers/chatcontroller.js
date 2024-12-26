const mongoose = require("mongoose");
const Transaction = require("../model/transaction");
const fetch = require("node-fetch");

exports.chatbotResponse = async (req, res) => {
  const { messages } = req.body;
  const userId = req.user; // Get the user ID from the JWT payload, set by isAuth middleware

  console.log("User ID from JWT:", userId); // Debugging userId

  if (!userId) {
    return res.status(401).json({ message: "User ID not found in JWT token" });
  }

  try {
    // Fetch user transactions from the database by userId
    console.log("Fetching transactions for userId:", userId); // Debugging transaction fetch
    const transactions = await Transaction.find({ userId });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for this user." });
    }

    // Build the system prompt for the chatbot
    const systemPrompt = `
      You are a financial advisor chatbot. Analyze the user's transactions and provide personalized advice.
      User transactions: ${JSON.stringify(transactions)}
      Guidelines:
      1. Identify overspending areas.
      2. Suggest ways to improve savings.
      3. Recommend keeping EMIs under a safe income threshold.
    `;

    // Call the external chatbot API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-90b-vision-instruct:free", // Use your preferred model
          messages: [{ role: "system", content: systemPrompt }, ...messages],
        }),
      }
    );

    const data = await response.json();
    console.log("API Response:", data); // Debugging API response

    // Safely access the response message
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const reply = data.choices[0].message.content;
      return res.status(200).json({ reply });
    } else {
      return res
        .status(500)
        .json({ message: "Unexpected API response structure", data });
    }
  } catch (error) {
    console.error("Error generating response:", error);
    return res
      .status(500)
      .json({ message: "Error generating response", error });
  }
};
