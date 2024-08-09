"use client";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the Headstarter Restaurant support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(undefined);
  const router = useRouter();

  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/auth");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      router.push("/auth"); // Redirect to /auth after logging out
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  if (user === undefined) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <ThreeDots
          visible={true}
          height="100"
          width="100"
          color="#000"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </Box>
    );
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={"column"}
        width="80%"
        height="95%"
        border="0.5px solid gray"
        p={2}
        spacing={3}
      >
        <Stack
          borderBottom={"0.5px solid gray"}
          display="flex"
          flexDirection={"row"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h7" p={2} spacing={2}>
            Headstarter Restaurant Support
          </Typography>
          {user && (
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Stack>
        <Stack
          direction={"column"}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#ACACAC",
            },
          }}
          p={2}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "secondary.main"
                }
                color="white"
                borderRadius={3}
                p={2}
              >
                {message.content === "" && message.role === "assistant" ? (
                  <ThreeDots
                    visible={true}
                    height="30"
                    width="30"
                    color="#fff"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  message.content
                )}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
