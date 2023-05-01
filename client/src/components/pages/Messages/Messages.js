import React from 'react';
import './Messages.css';
import { useParams } from 'react-router-dom';
import Header2 from "./../../Header2/Header2";

function Messages() {
  const { email } = useParams();
  // Utilisez 'email' pour récupérer les données spécifiques à cet utilisateur

  return (
    <div>
      <Header2 activePage="messages" email={email} />
      <div className="messages">
        <h1>Messages</h1>
        {/* Votre contenu de page de messages ici */}
      </div>
    </div>
  );
}

export default Messages;