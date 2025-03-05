// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage.jsx';
import Contact from './pages/contact.jsx';
import Blog from './pages/blog.jsx';
import BlogDetail from './pages/blogdetails.jsx';
import Menu from './pages/menu.jsx';
import MealDetails from './pages/mealdetails.jsx';
import About from './pages/about.jsx';
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import GetStarted from "./pages/getstarted.jsx";
import Login from "./pages/login.jsx";
import SignUp from "./pages/signup.jsx";
import ForgetPassword from "./pages/forgetpassword.jsx";
import Dashboard from './pages/dashboard.jsx';
import { UserAuthContextProvider } from './contexts/UserAuthContext.jsx';
import './App.css'; // Import component-level styles

function App() {
  return (
    <UserAuthContextProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:id" element={<MealDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/getstarted" element={<GetStarted />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserAuthContextProvider>
  );
}

export default App;
