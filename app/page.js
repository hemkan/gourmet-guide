"use client";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import { Gradient } from "@mui/icons-material";
import "@fontsource-variable/manrope";
import "@fontsource-variable/raleway";
import { IconButton } from "@mui/material";
import { FaArrowCircleRight } from "react-icons/fa";

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
        // router.push("/auth");
        setUser(null);
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
  const handleLogin = () => {
    setUser(undefined);
    router.push("/auth");
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

  if (user === null) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={2}
        position="relative"
        sx={{ backgroundColor: "#ffbea3" }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontFamily="Manrope Variable"
          fontWeight={"bold"}
        >
          Welcome to Gourmet Guide
        </Typography>
        {/* background img */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <img
            src="/yellow-bg.svg"
            alt="yellow-bg"
            style={{
              width: "20rem",
              position: "absolute",
              zIndex: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />

          <img
            src="/IceCreamDoodle.svg"
            alt="Ice Cream Doodle"
            style={{
              width: "30rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          />
        </Box>
        <Typography
          variant="h6"
          textAlign="center"
          marginBottom={2}
          fontFamily={"Raleway Variable"}
        >
          Your personal cooking assistant to help you with your cooking needs.
        </Typography>

        <Button
          variant="contained"
          onClick={handleLogin}
          fontFamily="Manrope Variable"
          sx={{
            backgroundColor: "#42bb94",
            color: "white",
            "&:hover": {
              backgroundColor: "#2D8B6D",
              color: "#white",
            },
          }}
        >
          Get Started
        </Button>
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
      sx={{ backgroundImage: "linear-gradient(#f3c5a1, #ffbea3)" }}
    >
      <Stack
        direction={"column"}
        width="80%"
        height="95%"
        // border="0.5px solid gray"
        p={2}
        spacing={3}
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        bgcolor={"#f2d1b3"}
      >
        <Stack
          borderBottom={"0.5px solid #C4C4C4"}
          display="flex"
          flexDirection={"row"}
          justifyContent="space-between"
          alignItems="center"
          sx={{ paddingBottom: "0.5rem" }}
        >
          <Typography
            variant="h7"
            p={2}
            spacing={2}
            fontFamily={"Manrope Variable"}
          >
            Gourmet Guide
          </Typography>
          {user && (
            <Button
              variant="contained"
              onClick={handleLogout}
              fontFamily={"Manrope Variable"}
              bgcolor={"#7FBBCA"}
              sx={{
                backgroundColor: "#2D3D8B",

                "&:hover": {
                  backgroundColor: "#7F7FCA",
                  color: "#white",
                },
              }}
            >
              Logout
            </Button>
          )}
        </Stack>
        <Stack
          direction={"column"}
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
            marginTop: "0rem !important",
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
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <IconButton
            onClick={sendMessage}
            disabled={isLoading}
            sx={{
              marginLeft: "0.5rem !important",
            }}
          >
            <FaArrowCircleRight size={40} color="black" />
          </IconButton>
          {/* <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            fontFamily={"Manrope Variable"}
            bgcolor={"#7FBBCA"}
            sx={{
              backgroundColor: "black",

              "&:hover": {
                backgroundColor: "#FF71A3",
                color: "#white",
              },
            }}
          >
            Send
          </Button> */}
        </Stack>
      </Stack>
      {/* <Button
        variant="contained"
        color="primary"
        onClick={scrollToBottom}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        // if scroller is at the bottom, the button is disabled
      >
        Go Down
      </Button> */}
    </Box>
  );
}
