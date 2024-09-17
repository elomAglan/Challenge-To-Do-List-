// src/components/SignIn.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Assurez-vous que le chemin est correct

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/tasks'); // Redirige vers la page des tâches après la connexion
    } catch (error) {
      setError('Failed to sign in. Please check your email and password.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5" component="h1" gutterBottom>
        Sign In
      </Typography>
      <form onSubmit={handleSignIn}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          style={{ marginTop: 16 }}
        >
          Sign In
        </Button>
      </form>
      <div style={{ marginTop: 16 }}>
      Don't have an account? <Link to="/"> Sign Up</Link>
        <br />
      </div>
    </Container>
  );
}

export default SignIn;
