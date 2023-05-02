import React, { useState } from "react";
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

function Search() {
  const { email } = useParams();

  const [relationship, setRelationship] = useState([]);
  const [gender, setGender] = useState(null);
  const [distance, setDistance] = useState(50);
  const [ageRange, setAgeRange] = useState([25, 45]);

  const toggleRelationship = (value) => {
    if (relationship.includes(value)) {
      setRelationship(relationship.filter((rel) => rel !== value));
    } else {
      setRelationship([...relationship, value]);
    }
  };

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
                className={relationship.includes("1") ? "selected" : ""}
                onClick={() => toggleRelationship("1")}
                style={{
                  border: relationship.includes("1") ? "2px solid green" : "",
                }}
              />
              <img
                src={relationshipIcon2}
                alt="relationshipIcon2"
                className={relationship.includes("2") ? "selected" : ""}
                onClick={() => toggleRelationship("2")}
                style={{
                  border: relationship.includes("2") ? "2px solid green" : "",
                }}
              />
              <img
                src={relationshipIcon3}
                alt="relationshipIcon3"
                className={relationship.includes("3") ? "selected" : ""}
                onClick={() => toggleRelationship("3")}
                style={{
                  border: relationship.includes("3") ? "2px solid green" : "",
                }}
              />
              <img
                src={relationshipIcon4}
                alt="relationshipIcon4"
                className={relationship.includes("4") ? "selected" : ""}
                onClick={() => toggleRelationship("4")}
                style={{
                  border: relationship.includes("4") ? "2px solid green" : "",
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
                className={gender === "1" ? "selected" : ""}
                onClick={() => setGender("1")}
                style={{
                  border: gender === "1" ? "2px solid green" : "",
                }}
              />
              <img
                src={genderIcon2}
                alt="genderIcon2"
                className={gender === "2" ? "selected" : ""}
                onClick={() => setGender("2")}
                style={{
                  border: gender === "2" ? "2px solid green" : "",
                }}
              />
              <img
                src={genderIcon3}
                alt="genderIcon3"
                className={gender === "3"? "selected": ""}
                onClick={() => setGender("3")}
                style={{
                  border: gender === "3" ? "2px solid green" : "",
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
              <input
                type="range"
                min="18"
                max="99"
                value={ageRange[0]}
                onChange={(e) => setAgeRange([e.target.value, ageRange[1]])}
              />
              <input
                type="range"
                min="18"
                max="99"
                value={ageRange[1]}
                onChange={(e) => setAgeRange([ageRange[0], e.target.value])}
              />
              <span>
                {ageRange[0]} - {ageRange[1]} ans
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              console.log("Paramètres de recherche soumis :", {
                relationship,
                gender,
                distance,
                ageRange,
              });
            }}
          >
            Soumettre
          </button>
        </div>
      </div>
    </div>
    );
}

export default Search;