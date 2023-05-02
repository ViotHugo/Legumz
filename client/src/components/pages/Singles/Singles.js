import React from 'react';
import './Singles.css';
import { useParams } from 'react-router-dom';
import Header2 from "./../../Header2/Header2";

function Singles() {
  const { email } = useParams();
  // Utilisez 'email' pour récupérer les données spécifiques à cet utilisateur

  return (
    <div>
      <Header2 activePage="singles" email={email} />
      <div className="singles">
        <h1>célibataires</h1>
        {/* Votre contenu de page de messages ici */}
      </div>
    </div>
  );
}

export default Singles;