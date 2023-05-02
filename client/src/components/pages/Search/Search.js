import './Search.css'
import { useParams } from 'react-router-dom';
import Header2 from "../../Header2/Header2";
import React from 'react';

function Search() {
  const { email } = useParams();
  // Utilisez 'email' pour récupérer les données spécifiques à cet utilisateur

  return (
    <div>
      <Header2 activePage="search" email={email} />
      <div className="search">
        <h1>Vos critères de recherche</h1>
        {/* Votre contenu de page de messages ici */}
      </div>
    </div>
  );
}

export default Search;