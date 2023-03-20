import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./components/pages/Home/Home";
import RegistrationForm from "./components/pages/Registration/RegistrationForm";
import LoginForm from "./components/pages/Login/LoginForm";
import About from "./components/pages/About/About";
import Statistics from "./components/pages/Statistics/Statistics";
import VegetableSelection from "./components/pages/VegetableSelection/VegetableSelection";
import GenderSelection from "./components/pages/GenderSelection/GenderSelection";
import SignUpForm from "./components/pages/SignUpForm/SignUpForm";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inscription" element={<VegetableSelection />} />
          <Route path="/connexion" element={<RegistrationForm />} />
          <Route path="/quisommesnous" element={<About />} />
          <Route path="/statistiques" element={<Statistics />} />
          <Route path="/gender-selection" element={<GenderSelection />} />{" "}
          {/* Ajoutez cette ligne */}
          <Route path="/signup" element={<SignUpForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
