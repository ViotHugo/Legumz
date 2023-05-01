import React from 'react';
import './Matchs.css';
import { useParams } from 'react-router-dom';
import Header2 from "./../../Header2/Header2";

function Matchs() {
  const { email } = useParams();
  // Utilisez 'email' pour récupérer les données spécifiques à cet utilisateur

  return (
    <div>
      <Header2 activePage="matchs" email={email} />
      <div className="matchs">
        <h1>Matchs</h1>
        {/* Votre contenu de page de messages ici */}
      </div>
    </div>
  );
}

export default Matchs;