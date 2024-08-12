"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Link,
} from "@mui/material";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { styled } from "@mui/material/styles";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { ThreeDots } from "react-loader-spinner";
import "@fontsource-variable/manrope";
import "@fontsource-variable/raleway";
import { Divider } from "@mui/material";

const CustomButton = styled(Button)`
  background: black;
  color: white;
  width: 100%;
  max-width: 500px;
  margin: 0.5rem 0;
  &:hover {
    background: #2d8b6d;
    color: white;
  }
  font-family: "Manrope Variable";
`;

const LoginCard = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  background: #f2d1b3;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0 1rem;
`;

const IconButtonStyled = styled(IconButton)`
  color: inherit;
  background: none;
  &:hover {
    background: none;
  }
`;

const PageContainer = styled(Box)`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(#f3c5a1, #ffbea3);
`;

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  "& .MuiInputLabel-root": {
    color: theme.palette.text.primary,
  },
  "& .MuiInputBase-root": {
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    "& fieldset": {
      borderColor: theme.palette.divider,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/");
      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (error) {
      console.error("Error registering", error);
    }
  };

  const handleGoogleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, googleProvider);
      router.replace("/");
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  };

  const handleGithubLogin = async () => {
    const githubProvider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, githubProvider);
      router.replace("/");
    } catch (error) {
      console.error("Error logging in with GitHub", error);
    }
  };

  if (loading) {
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

  return (
    <PageContainer>
      <LoginCard>
        <Typography variant="h4" gutterBottom fontFamily="Manrope Variable">
          {isRegistering ? "Register" : "Login"}
        </Typography>

        <Box mt={2} mb={2} display="flex" justifyContent="center" gap={2}>
          <Box
            borderRadius={50}
            border="1px solid black"
            // fill on hover
            sx={{
              "&:hover": {
                backgroundColor: "#F28C8C",
                border: "1px solid #F28C8C",
                color: "white",
              },
              transition: "background-color 0.3s, color 0.3s",
            }}
          >
            <IconButtonStyled onClick={handleGoogleLogin}>
              <GoogleIcon />
            </IconButtonStyled>
          </Box>
          <Box
            borderRadius={50}
            border="1px solid black"
            sx={{
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
              transition: "background-color 0.3s, color 0.3s",
            }}
          >
            <IconButtonStyled onClick={handleGithubLogin}>
              <GitHubIcon />
            </IconButtonStyled>
          </Box>
        </Box>
        <Divider
          sx={{
            width: "100%",
            mb: 2,
          }}
        >
          OR
        </Divider>
        <StyledTextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          fullWidth
        />
        <StyledTextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          type="password"
          fullWidth
        />
        <CustomButton onClick={isRegistering ? handleRegister : handleLogin}>
          {isRegistering ? "Register" : "Login"}
        </CustomButton>

        <Box mt={2}>
          {isRegistering ? (
            <Link
              href="#"
              onClick={() => setIsRegistering(false)}
              variant="body2"
              sx={{
                cursor: "pointer",
                textDecoration: "none",
                color: "primary.main",
              }}
              textAlign="center"
            >
              Already have an account? Login
            </Link>
          ) : (
            <Link
              href="#"
              onClick={() => setIsRegistering(true)}
              variant="body2"
              sx={{
                cursor: "pointer",
                textDecoration: "none",
                color: "primary.main",
              }}
              textAlign="center"
            >
              Don&apos;t have an account? Register
            </Link>
          )}
        </Box>
      </LoginCard>
    </PageContainer>
  );
}
