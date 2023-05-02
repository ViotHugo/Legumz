import './Singles.css'
import { useParams } from 'react-router-dom';
import Header2 from "../../Header2/Header2";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MatchCard from "../MatchCard/MatchCard";

function Singles() {
  const { email } = useParams();
  const [match, setMatch] = useState([])
  // Utilisez 'email' pour récupérer les données spécifiques à cet utilisateur
  const [user, setUser] = useState({})
  useEffect(() => {
    axios.post('http://localhost:5000/recupMatchPossible', {email: email})
      .then((response) => {
        setMatch(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  
    axios.post('http://localhost:5000/recupProfile', {email: email})
      .then((response) => {
        setUser(response.data);  
        console.log(response.data); // log the response data instead of the state variable
      })
      .catch((error) => {
        console.log(error);
      });
  }, [email]); // add email as a dependency of useEffect

  return (
    <div>
      <Header2 activePage="singles" email={email} />
      
      <div className="container_matchs">
        <h1>Les célibataires qui vous correspondent</h1>
        <div className='matchs'>
          {match.slice(0, 3).map((matchItem) => (
            <MatchCard data={matchItem} myhobbies={user.hobbies} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Singles;