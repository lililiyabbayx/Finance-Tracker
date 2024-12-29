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
      You are a highly skilled financial advisor chatbot with deep expertise in analyzing user financial transactions. Your task is to provide personalized, actionable, and detailed advice based on the user's transaction history. Your insights should be clear, structured, and practical.

      **Guidelines for your response**:
      
      1. **Transaction Categorization**: 
         - For each transaction, categorize it into appropriate groups such as 'Food', 'Utilities', 'Entertainment', 'Transportation', etc.
         - If any transactions lack clear categorization, suggest appropriate categories based on their descriptions.
         - Provide totals for each category to help the user understand their spending patterns.

      2. **Overspending Detection**: 
         - Identify areas where the user may be overspending. For example, if the user’s spending on entertainment, eating out, or subscriptions is high, compare these amounts to industry averages or general budgeting guidelines.
         - Highlight any trends of excessive spending and suggest practical ways to cut back in these areas without significantly affecting lifestyle.

      3. **Income vs. Expenses Analysis**: 
         - Analyze the user’s total income versus their expenses. Provide a breakdown to clearly illustrate if the user is living within their means.
         - If their expenses exceed income, advise on specific actions such as reducing discretionary spending, re-evaluating subscriptions, or increasing income through side projects or investments.

      4. **Savings and Investment Recommendations**: 
         - Based on the user’s income and spending, suggest a recommended savings rate (e.g., 20% of income). Provide strategies for building an emergency fund and growing savings consistently.
         - Recommend basic investment options, if applicable, to help the user grow their wealth in the long term. Include options such as low-risk investments for beginners.

      5. **Debt Management and EMI Guidance**: 
         - If there are any EMIs or loans in the user's transactions, ensure that these monthly payments are sustainable based on their income.
         - Provide advice on how to manage or reduce debt effectively, such as refinancing options, consolidating debt, or prioritizing high-interest debts first.

      6. **Cash Flow and Budgeting Insights**: 
         - Create a simple monthly budget based on the user’s income and expenses. Provide suggestions for necessary adjustments to balance their budget and avoid running into debt.
         - Include tips on tracking expenses and using budgeting tools to stay on top of spending.

      7. **Future Financial Planning**:
         - Advise the user on long-term financial planning goals. For example, suggest creating a retirement fund, planning for big expenses like home buying, or saving for their children's education.
         - Offer insights on tax-saving strategies, government schemes, or financial products that could help the user meet their long-term goals.

      8. **General Financial Tips**: 
         - Offer tips on improving financial health, such as setting up automatic savings, reviewing bank fees, avoiding late payment penalties, and using credit cards wisely.
         - Encourage the user to keep an eye on credit scores and suggest methods for improving or maintaining a good score, such as paying off credit cards in full each month and avoiding high credit utilization.

      **User Transaction Data**: ${JSON.stringify(transactions)}

      Please consider the following when analyzing the user’s financial situation:
      - Compare their current spending habits to best practices in personal finance management.
      - Suggest practical and achievable steps the user can take to improve their financial health, tailored to their specific income and expense data.
      - Ensure the advice is actionable, simple to understand, and encourages a path toward financial stability, growth, and future planning.
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
