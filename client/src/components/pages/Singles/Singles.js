import './Singles.css'
import { useParams } from 'react-router-dom';
import Header2 from "../../Header2/Header2";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MatchCard from "../MatchCard/MatchCard";

function Singles() {
  const { email } = useParams();
  const [match, setMatch] = useState([])
  const [loading, setLoading] = useState(true); // Ajoutez une variable d'état pour contrôler le chargement
  const [showMessage, setShowMessage] = useState(false); // Ajoutez une variable d'état pour afficher le message
  const [user, setUser] = useState({})
  
  useEffect(() => {
    axios.post('http://localhost:5000/recupProfile', {email: email})
      .then((response) => {
        setUser(response.data);  
        axios.post('http://localhost:5000/recupMatchPossible', {user: response.data})
        .then((response) => {
          console.log(response.data);
          setMatch(response.data);
          setLoading(false); // Mettez à jour la variable d'état loading
          if (response.data.length === 0) {
            setShowMessage(true); // Mettez à jour la variable d'état showMessage
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false); // Mettez à jour la variable d'état loading en cas d'erreur
          setShowMessage(true); // Affichez le message en cas d'erreur
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Mettez à jour la variable d'état loading en cas d'erreur
        setShowMessage(true); // Affichez le message en cas d'erreur
      });
  }, [email]);

  return (
    <div>
      <Header2 activePage="singles" email={email} />
      
      <div className="container_matchs2">
        <h1>Les célibataires qui vous correspondent</h1>
        {loading ? (
          <p>Chargement...</p>
        ) : showMessage ? (
          <p>Aucun match trouvé.</p>
        ) : (
          <div className='matchs2'>
            {match.slice(0, 2).map((matchItem) => (
              <MatchCard data={matchItem} myhobbies={user.hobbies} user={user}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Singles;
