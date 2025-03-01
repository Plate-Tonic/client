import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import Navbar from "./components/navbar"; // Import the Navbar
import Footer from "./components/footer"; // Import the Footer
import Homepage from "./components/homepage"; // Import the Homepage

function App() {
  return (
    <Router>
      {/* Navbar should be outside of Routes so it appears on all pages */}
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
