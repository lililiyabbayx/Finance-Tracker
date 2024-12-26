import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  LinearProgress,
} from "@mui/material";
import { useSendChatMessageMutation } from "@/states/chatApi"; // Import the mutation hook
import { ChatMessage } from "@/states/types"; // Import the correct ChatMessage type

const ChatInterface: React.FC<{ userId: string }> = ({ userId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! How can I assist you with your finances today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [sendChatMessage, { isLoading }] = useSendChatMessageMutation(); // Use the mutation hook

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: message }; // Explicitly type the user message
    setMessages((prev) => [...prev, userMessage]);

    try {
      console.log("Sending request with messages:", messages);
      // Using the mutation hook to send the chat message and await the response
      const { reply } = await sendChatMessage({
        userId,
        messages: [...messages, userMessage],
      }).unwrap();

      console.log("Response from backend:", reply);  // Log the reply to check if it's correct

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);  // Log the error
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error fetching response" },
      ]);
    } finally {
      setMessage("");
    }
  };

  return (
    <Box>
      <Stack spacing={2}>
        {messages.map((msg, i) => (
          <Box
            key={i}
            style={{ textAlign: msg.role === "user" ? "right" : "left" }}
          >
            <Typography
              variant="body1"
              style={{
                display: "inline-block",
                padding: "8px",
                borderRadius: "4px",
                backgroundColor: msg.role === "user" ? "#1976d2" : "#f0f0f0",
                color: msg.role === "user" ? "#fff" : "#000",
              }}
            >
              {msg.content}
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Stack>
      {isLoading && <LinearProgress />} {/* Show loading progress bar */}
      <TextField
        fullWidth
        multiline
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
      />
      <Button variant="contained" onClick={handleSend} disabled={isLoading}>
        {" "}
        {/* Disable button while loading */}
        Send
      </Button>
    </Box>
  );
};

export default ChatInterface;
