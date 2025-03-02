import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import Navbar from "./components/navbar"; // Import the Navbar
import Footer from "./components/footer"; // Import the Footer
import Homepage from "./components/homepage"; // Import the Homepage
import About from "./components/about";
import Contact from "./components/contact";
import Blog from "./components/blog";

function App() {
  return (
    <Router>
      {/* Navbar should be outside of Routes so it appears on all pages */}
      <Navbar />
      <div classname="main-content"> 
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
