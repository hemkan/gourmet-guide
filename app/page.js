"use client";
import { useEffect, useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { auth } from '@/app/firebase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth State Changed:', user); // Debugging
      if (user) {
        setUser(user);
      } else {
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
      router.push('/auth'); // Redirect to /auth after logging out
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
    >
      <Typography variant="h1" align="center">
        Hello World
      </Typography>
      {user && (
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      )}
    </Box>
  );
}
