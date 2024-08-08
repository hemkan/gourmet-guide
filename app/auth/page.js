'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/app/firebase'
import { Box, Typography, TextField, Button, IconButton, Link } from '@mui/material'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { styled } from '@mui/material/styles'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'

const CustomButton = styled(Button)`
  background: black;
  color: white;
  width: 100%;
  max-width: 500px;
  &:hover {
    background: white;
    color: black;
  }
`;

const LoginCard = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(#F3C5A1, #F39C12);
`;

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  '& .MuiInputLabel-root': {
    color: theme.palette.text.primary,
  },
  '& .MuiInputBase-root': {
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function Auth() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace('/')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [router])

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.replace('/')
    } catch (error) {
      console.error('Error logging in', error)
    }
  }

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.replace('/')
    } catch (error) {
      console.error('Error registering', error)
    }
  }

  const handleGoogleLogin = async () => {
    const googleProvider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, googleProvider)
      router.replace('/')
    } catch (error) {
      console.error('Error logging in with Google', error)
    }
  }

  const handleGithubLogin = async () => {
    const githubProvider = new GithubAuthProvider()
    try {
      await signInWithPopup(auth, githubProvider)
      router.replace('/')
    } catch (error) {
      console.error('Error logging in with GitHub', error)
    }
  }

  return (
    <PageContainer>
      <LoginCard>
        <Typography variant="h5" gutterBottom>
          {isRegistering ? 'Register' : 'Login'}
        </Typography>
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
          {isRegistering ? 'Register' : 'Login'}
        </CustomButton>
        <Box mt={2}>
          {isRegistering ? (
            <Link
              href="#"
              onClick={() => setIsRegistering(false)}
              variant="body2"
              sx={{ cursor: 'pointer', textDecoration: 'none', color: 'primary.main' }}
            >
              Already have an account? Login
            </Link>
          ) : (
            <Link
              href="#"
              onClick={() => setIsRegistering(true)}
              variant="body2"
              sx={{ cursor: 'pointer', textDecoration: 'none', color: 'primary.main' }}
            >
              Don&apos;t have an account? Register
            </Link>
          )}
        </Box>
        <Box mt={2} display="flex" justifyContent="center" gap={2}>
          <IconButtonStyled onClick={handleGoogleLogin}>
            <GoogleIcon />
          </IconButtonStyled>
          <IconButtonStyled onClick={handleGithubLogin}>
            <GitHubIcon />
          </IconButtonStyled>
        </Box>
      </LoginCard>
    </PageContainer>
  )
}
