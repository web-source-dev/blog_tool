import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { CssBaseline } from '@mui/material';
import CreateBlog from './components/blog/CreateBlog';
import ManageBlog from './components/blog/ManageBlog';
const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
              <Route path="blog/create" element={
                      <CreateBlog />
                  } />
                  <Route path="blog/edit/:id" element={
                      <CreateBlog />
                  } />
                  <Route path="/" element={
                      <ManageBlog />
                  } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;