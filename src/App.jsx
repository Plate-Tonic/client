// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage.jsx';
import Contact from './pages/contact.jsx';
import Blog from './pages/blog.jsx';
import Menu from './pages/menu.jsx';
import About from './pages/about.jsx';
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import './App.css'; // Import component-level styles

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
