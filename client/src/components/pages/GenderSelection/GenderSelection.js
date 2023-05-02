import React from "react";
import GenderCard from "./GenderCard";
import maleImage from "../../../images/homme.png";
import femaleImage from "../../../images/femme.png";
import bothImage from "../../../images/bi.png";
import "./GenderSelection.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "./../../Header/Header";

function GenderSelection() {
  const { vegetableChoice } = useParams();
  return (
    <div>
      <Header />
      <div className="gender-selection-container">
        <h1 className="gender-selection-title">Que recherches tu ?</h1>
        <div className="gender-selection">
          <GenderCard
            title="Homme"
            image={maleImage}
            vegetableChoice={vegetableChoice}
            description="Poireaux forts et robustes..."
          />
          <GenderCard
            title="Femme"
            image={femaleImage}
            vegetableChoice={vegetableChoice}
            description=" Tomates délicieuses et juteuses"
          />
          <GenderCard
            title="Les deux"
            image={bothImage}
            vegetableChoice={vegetableChoice}
            description="Pourquoi choisir entre les deux ?"
          />
        </div>
      </div>
    </div>
  );
}

export default GenderSelection;
