// App.jsx

import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Homepage from './pages/homepage.jsx';
import Contact from './pages/contact.jsx';
import Blog from './pages/blog.jsx';
import BlogDetail from './pages/blogdetails.jsx';
import AddBlog from './pages/addnewblog.jsx';
import Menu from './pages/menu.jsx';
import MealDetails from './pages/mealdetails.jsx';
import AddMeal from './pages/addnewmeal.jsx';
import About from './pages/about.jsx';
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import GetStarted from "./pages/getstarted.jsx";
import Login from "./pages/login.jsx";
import SignUp from "./pages/signup.jsx";
import ForgetPassword from "./pages/forgetpassword.jsx";
import Dashboard from './pages/dashboard.jsx';
import TermsAndConditions from './pages/terms-and-conditions.jsx';
import { UserAuthContextProvider } from './contexts/UserAuthContext.jsx';
import './App.css'; 

// Ensure Scroll to Top on Route Change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Runs when the route changes

  return null; // No UI, just functionality
};

// Main App components
function App() {
  return (
    <UserAuthContextProvider>
      <Router>
      <ScrollToTop />
        <div className="app-container">
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/addnewblog" element={<AddBlog />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/meal/:mealId" element={<MealDetails />} />
              <Route path="/addnewmeal" element={<AddMeal />} />
              <Route path="/about" element={<About />} />
              <Route path="/getstarted" element={<GetStarted />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserAuthContextProvider>
  );
}

export default App;
