"use client";

import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import { Gradient } from "@mui/icons-material";
import "@fontsource-variable/manrope";
import "@fontsource-variable/raleway";
import { IconButton } from "@mui/material";
import { VscClearAll } from "react-icons/vsc";
import { IoLogOutOutline } from "react-icons/io5";
import { FaAngleDoubleDown } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Gourmet Guide, your personal cooking assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(undefined);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

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
  const messagesContainer = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // scroll to bottom as message appears
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

  // fix general scroll issue on mobile
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();

    window.addEventListener("resize", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
    };
  }, []);

  // make scroll to bottom button appear if not at bottom
  useEffect(() => {
    if (!messagesContainer.current) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight, offsetHeight } =
        messagesContainer.current;

      // if scrolled more than 10 pixels from bottom, make button appear
      if (scrollHeight - 10 >= scrollTop + offsetHeight) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    messagesContainer.current.addEventListener("scroll", handleScroll);
    return () => {
      messagesContainer.current?.removeEventListener("scroll", handleScroll);
    };
  }, [messagesContainer.current]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(undefined);
      router.push("/auth"); // Redirect to /auth after logging out
    } catch (error) {
      console.error("Error logging out", error);
    }
  };
  const handleLogin = () => {
    setUser(undefined);
    router.push("/auth");
  };

  const isSmallScreen = useMediaQuery("(max-width:500px)");
  if (user === undefined) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundImage: "linear-gradient(#f3c5a1, #ffbea3)" }}
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
        sx={{ backgroundImage: "linear-gradient(#f3c5a1, #ffbea3)" }}
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
              overflow: "hidden",
            }}
          />

          <img
            src="/IceCreamDoodle.svg"
            alt="Ice Cream Doodle"
            style={{
              width: "80%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
              marginTop: "5%",
              marginBottom: "5%",
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
        p={2}
        spacing={3}
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
        bgcolor={"#f2d1b3"}
        width={isSmallScreen ? "100%" : "80%"}
        height={isSmallScreen ? "100%" : "95%"}
      >
        <Stack
          borderBottom={"0.5px solid rgba(128, 128, 128, 0.5)"}
          display="flex"
          flexDirection={"row"}
          justifyContent="space-between"
          alignItems="center"
          sx={{ paddingBottom: "0.5rem" }}
        >
          <Typography
            variant="h5"
            p={2}
            spacing={2}
            fontFamily={"Manrope Variable"}
          >
            Gourmet Guide
          </Typography>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            p={2}
          >
            <Box
              borderRadius={50}
              border="1px solid black"
              color="black"
              sx={{
                "&:hover": {
                  backgroundColor: "#f28c8c",
                  border: "1px solid #f28c8c",
                  color: "transparent",
                },
                transition: "background-color 0.3s, color 0.3s",
              }}
              mr={2}
            >
              <IconButton
                sx={{
                  color: "black",
                  "&:hover": {
                    color: "white",
                  },
                  transition: "background-color 0.3s, color 0.3s",
                }}
                onClick={() =>
                  setMessages([
                    {
                      role: "assistant",
                      content:
                        "Hi! I'm Gourmet Guide, your personal cooking assistant. How can I help you today?",
                    },
                  ])
                }
              >
                <VscClearAll />
              </IconButton>
            </Box>
            {user && (
              <Box
                borderRadius={50}
                border="1px solid black"
                color="black"
                sx={{
                  "&:hover": {
                    backgroundColor: "#2d3d8b",
                    border: "1px solid #2d3d8b",
                    color: "transparent",
                  },
                  transition: "background-color 0.3s, color 0.3s",
                }}
              >
                <IconButton
                  onClick={handleLogout}
                  bgcolor={"#7FBBCA"}
                  sx={{
                    color: "black",
                    "&:hover": {
                      color: "white",
                    },
                    transition: "background-color 0.3s, color 0.3s",
                  }}
                >
                  <IoLogOutOutline />
                </IconButton>
              </Box>
              //   <Button
              //     variant="contained"
              //     onClick={handleLogout}
              //     fontFamily={"Manrope Variable"}
              //     bgcolor={"#7FBBCA"}
              //     sx={{
              //       backgroundColor: "#5851d8",

              //       "&:hover": {
              //         backgroundColor: "#405de6",
              //         color: "#white",
              //       },
              //     }}
              //   >
              //     Logout
              //   </Button>
            )}
          </Box>
        </Stack>
        <Box
          position="relative"
          //   direction={"column"}
          flexGrow={1}
          overflow="hidden"
          maxHeight="100%"
          sx={{ marginTop: "0rem !important" }}
        >
          <Stack
            ref={messagesContainer}
            p={2}
            direction={"column"}
            overflow={"auto"}
            height="100%"
            sx={{
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#ACACAC",
              },
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
                sx={{ mb: "1rem" }}
              >
                <Box
                  bgcolor={
                    message.role === "assistant" ? "#833ab4" : "#e1306c "
                  }
                  color="white"
                  borderRadius={3}
                  maxWidth="80%"
                  p={2}
                  sx={{
                    "& ul, & ol": {
                      paddingLeft: "20px", // Adjust the indentation of lists
                      marginTop: 0,
                      marginBottom: 0,
                    },
                    "& ul": {
                      listStyleType: "disc", // Bullet points for unordered lists
                    },
                    "& ol": {
                      listStyleType: "decimal", // Numbering for ordered lists
                    },
                  }}
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
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  )}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
          {/* on click, scroll to bottom (aka messagesEndRef); hide if scrhollbar not there */}
          {isAtBottom && (
            <Box
              borderRadius={50}
              border="1px solid #F2E8CF"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              backgroundColor="#F2E8CF"
              sx={{
                position: "absolute",
                bottom: 15,
                right: 15,
                color: "black",
              }}
              size={15}
            >
              <IconButton
                onClick={scrollToBottom}
                sx={{
                  color: "black",
                }}
              >
                <FaAngleDoubleDown size={15} />
              </IconButton>
            </Box>
          )}
        </Box>
        <Stack
          direction={"row"}
          spacing={2}
          sx={{ marginTop: "0rem !important" }}
        >
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Box
            borderRadius={50}
            border="1px solid #2d3d8b"
            backgroundColor="#2d3d8b"
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
                border: "1px solid #2d3d8b",
              },
              transition: "background-color 0.3s, color 0.3s",
            }}
            size={25}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <IconButton
              onClick={sendMessage}
              disabled={isLoading}
              color={"#f2d1b3"}
              sx={{
                marginLeft: "0.5rem !important",
                color: "#f2d1b3",
                "&:hover": {
                  color: "#2d3d8b",
                },
                transition: "background-color 0.3s, color 0.3s",
              }}
            >
              <IoSend size={30} />
            </IconButton>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
