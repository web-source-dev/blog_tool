import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { CssBaseline } from '@mui/material';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminOverview from './components/admin/Overview';
import AdminBlogs from './components/admin/Blogs';
import CreateBlog from './components/blog/CreateBlog';
import ManageBlog from './components/blog/ManageBlog';
import AdminNewsletter from './components/admin/Newsletter';
const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
        
            <Route
              path="/*"
              element={
                  <AdminDashboard />
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="blog/create" element={
                      <CreateBlog />
                  } />
                  <Route path="blog/edit/:id" element={
                      <CreateBlog />
                  } />
                  <Route path="blog/manage" element={
                      <ManageBlog />
                  } />
            </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;