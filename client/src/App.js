import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./components/pages/Home/Home";
import RegistrationForm from "./components/pages/Registration/RegistrationForm";
import About from "./components/pages/About/About";
import Statistics from "./components/pages/Statistics/Statistics";
import VegetableSelection from "./components/pages/VegetableSelection/VegetableSelection";
import GenderSelection from "./components/pages/GenderSelection/GenderSelection";
import SignUpForm from "./components/pages/SignUpForm/SignUpForm";
import Profile from './components/pages/Profile/Profile';
import MapPage from './components/pages/MapPage/MapPage';
import Messages from './components/pages/Messages/Messages';
import Header2 from "./components/Header2/Header2";

import Matchs from "./components/pages/Matchs/Matchs";
import Search from "./components/pages/Search/Search";
import Singles from "./components/pages/Singles/Singles";
import MatchGeo from "./components/pages/MatchGeo/MatchGeo";
import Modifprofil from "./components/pages/Modifprofil/Modifprofil";
import RDVCarte from "./components/pages/RDVCarte/RDVCarte";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
       
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/inscription" element={<VegetableSelection />} />
          <Route path="/connexion" element={<RegistrationForm />} />
          <Route path="/quisommesnous" element={<About />} />
          <Route path="/statistiques" element={<Statistics />} />
          <Route
            path="/gender-selection/:vegetableChoice"
            element={<GenderSelection />}
          />
          <Route path="/signup/:vegetableGender" element={<SignUpForm />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/profil/:email" element={<Profile />} />
          <Route path="/messages/:email" element={<Messages/>} />

          <Route path="/matchs/:email" element={<Matchs/>} />
          <Route path="/search/:email" element={<Search/>} />
          <Route path="/singles/:email" element={<Singles/>} />
          <Route path="/matchgeo/:email" element={<MatchGeo/>} />
          <Route path="/modifprofil/:email" element={<Modifprofil/>} />
          <Route path="/rdvCarte/:userContact" element={<RDVCarte/>} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
