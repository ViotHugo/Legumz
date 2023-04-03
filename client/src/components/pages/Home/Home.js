import React from "react";
import "./Home.css";
import image1 from '../../../images/Accueil1.png';
import image2 from '../../../images/Accueil2.png';
import image3 from '../../../images/Accueil3.png';
import Header from "./../../Header/Header";

function Home() {
  return (
    <div>
    <Header />
    <div className="Home">
      <div className="header">
        <h1>Welcum to Legumz</h1>
        <p>
          Legumz est une application de rencontre dédiée aux amateurs de
          légumes. Inscrivez-vous dès aujourd'hui pour rencontrer des personnes
          partageant les mêmes intérêts que vous !
        </p>
      </div>
      <div className="image-container">
        <img
          src={image1}
          alt="Placeholder"
          className="image"
        />
        <img
          src={image2}
          alt="Placeholder"
          className="image"
        />
        <img
          src={image3}
          alt="Placeholder"
          className="image"
        />
      </div>
    </div>
    </div>
  );
}

export default Home;