import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header2 from "./../../Header2/Header2";
import relationshipIcon1 from "../../../images/aubergine.png";
import relationshipIcon2 from "../../../images/carrote.png";
import relationshipIcon3 from "../../../images/piment.png";
import relationshipIcon4 from "../../../images/poivron.png";
import genderIcon1 from "../../../images/homme.png";
import genderIcon2 from "../../../images/femme.png";
import genderIcon3 from "../../../images/bi.png";
import "./Search.css";
import "rc-slider/assets/index.css";
import axios from "axios"
import { useNavigate } from "react-router-dom";

function Search() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [relationship, setRelationship] = useState([]);
  const [gender, setGender] = useState("");
  const [user,setUser] = useState({});
  const [distance, setDistance] = useState(user.distanceMax || 50);
  const [ageRange, setAgeRange] = useState([25, 45]);
  
  const toggleRelationship = (value) => {
    if (relationship.includes(value)) {
      setRelationship(relationship.filter((rel) => rel !== value));
    } else {
      setRelationship([...relationship, value]);
    }
  };
  useEffect(() => {
    axios.post('http://localhost:5000/recupProfile', {email : email})
        .then((response) => {
          setUser(response.data);  
          setDistance(response.data.distanceMax); // Définir la distance initiale
          setAgeRange ([response.data.minAge, response.data.maxAge]);
        })
        .catch((error) => {
          console.log(error);
    });
}, [email])

  return (
    <div>
      <Header2 activePage="search" email={email} />
      <div className="search">
        <div className="search-card">
          <h1>Mes paramètres de recherche</h1>
          <div>
            <h2>Choix de relation</h2>
            <div className="relationship">
              <img
                src={relationshipIcon1}
                alt="relationshipIcon1"
                className={relationship.includes("Aubergine") ? "selected" : ""}
                onClick={() => toggleRelationship("Aubergine")}
                style={{
                  border: relationship.includes("Aubergine") ? "2px solid green" : "",
                }}
              />
              <img
                src={relationshipIcon2}
                alt="relationshipIcon2"
                className={relationship.includes("Carotte") ? "selected" : ""}
                onClick={() => toggleRelationship("Carotte")}
                style={{
                  border: relationship.includes("Carotte") ? "2px solid green" : "",
                }}
              />
              <img
                src={relationshipIcon3}
                alt="relationshipIcon3"
                className={relationship.includes("Piment rouge") ? "selected" : ""}
                onClick={() => toggleRelationship("Piment rouge")}
                style={{
                  border: relationship.includes("Piment rouge") ? "2px solid green" : "",
                }}
              />
              <img
                src={relationshipIcon4}
                alt="relationshipIcon4"
                className={relationship.includes("Poivron Jaune") ? "selected" : ""}
                onClick={() => toggleRelationship("Poivron Jaune")}
                style={{
                  border: relationship.includes("Poivron Jaune") ? "2px solid green" : "",
                }}
              />
            </div>
          </div>
          <div>
            <h2>Sexe de la personne recherchée</h2>
            <div className="gender">
              <img
                src={genderIcon1}
                alt="genderIcon1"
                className={gender === "Homme" ? "selected" : ""}
                onClick={() => setGender("Homme")}
                style={{
                  border: gender === "Homme" ? "2px solid green" : "",
                }}
              />
              <img
                src={genderIcon2}
                alt="genderIcon2"
                className={gender === "Femme" ? "selected" : ""}
                onClick={() => setGender("Femme")}
                style={{
                  border: gender === "Femme" ? "2px solid green" : "",
                }}
              />
              <img
                src={genderIcon3}
                alt="genderIcon3"
                className={gender === "Les deux"? "selected": ""}
                onClick={() => setGender("Les deux")}
                style={{
                  border: gender === "Les deux" ? "2px solid green" : "",
                }}
              />
            </div>
          </div>
          <div>
            <h2>Distance de recherche</h2>
            <div className="distance">
              <input
                type="range"
                min="1"
                max="500"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                style={{ display: "block" }}
              />
              <span>{distance} km</span>
            </div>
          </div>
          <div>
  <h2>Tranche d'âge</h2>
  <div className="age-range">
    <div className="age-inputs">
      <label htmlFor="min-age">Âge minimum:</label>
      <input
        type="number"
        id="min-age"
        name="min-age"
        value={ageRange[0]}
        onChange={(e) => setAgeRange([e.target.value, ageRange[1]])}
        min="18"
        max="99"
      />
    </div>
    <div className="age-inputs">
      <label htmlFor="max-age">Âge maximum:</label>
      <input
        type="number"
        id="max-age"
        name="max-age"
        value={ageRange[1]}
        onChange={(e) => setAgeRange([ageRange[0], e.target.value])}
        min="18"
        max="99"
      />
    </div>
  </div>
</div>
<div className="subButton">
  <button
    className="subButton2"
            onClick={() => {
              console.log("Paramètres de recherche soumis :", {
                relationship,
                gender,
                distance,
                ageRange,
              });
              axios.post('http://localhost:5000/modifRecherche', {email:email,vegetableSearch :relationship,genderSearch: gender,
               distanceMax:parseInt(distance, 10), minAge : parseInt(ageRange[0],10), maxAge : parseInt(ageRange[1],10)
              })
              .then((response) => { 
                navigate('/singles/'+email);
              })
              .catch((error) => {
                console.log(error);
              });
            }}
          >
            Soumettre
          </button>
</div>
          
        </div>
      </div>
    </div>
    );
}

export default Search;