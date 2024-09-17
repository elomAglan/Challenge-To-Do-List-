// src/App.js
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import TaskList from './components/TaskList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container component="main" maxWidth="xs">
          <Typography variant="h2" component="h1" gutterBottom>
            <h3 style={{ textAlign: 'center' }}>To-Do List</h3>
          </Typography>
          <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/tasks" element={<TaskList />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
