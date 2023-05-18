import React, { useEffect, useState } from 'react';
import './Matchs.css';
import { useParams } from 'react-router-dom';
import Header2 from "../../Header2/Header2";
import CardMatch from "../CardMatch/CardMatch";
import axios from 'axios';

function Matchs() {
  const { email } = useParams();
  const [matchs, setMatchs] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null); // Ajout de l'état pour le profil sélectionné
  const [user, setUser] = useState({})

  useEffect(() => {
    axios.post('http://localhost:5000/recupProfile', {email: email})
      .then((response) => {
        setUser(response.data);
        console.log(response.data);
        axios.post('http://localhost:5000/recupMatchs', {email: email})
        .then((response) => {
          setMatchs(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [email]);

  // Fonction pour gérer le clic sur un profil
  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  };

  return (
    <div>
      <Header2 activePage="matchs" email={email} />
      <div className="title-container-match">
      <h1 className="page-title">Mes Matchs</h1></div>
      <div className="matchs">
        <div className="matchs-list">
          {matchs.length > 0 ?
            matchs.map((match) => (
              <div className="contact" onClick={() => handleProfileClick(match)}>
                <img className="contact-image" src={match.profilePicture} alt={match.firstName} />
                <div>{match.firstName}</div>
              </div>
            ))
            : <p>Aucun match trouvé</p>
          }
        </div>
        <div className="selected-profile">
          {selectedProfile && (
            // Insérez ici le code pour afficher le profil sélectionné
            // en utilisant les données dans 'selectedProfile'
            <div>
              <CardMatch data={selectedProfile} myhobbies={user.hobbies} user={user}>

              </CardMatch>


            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Matchs;
