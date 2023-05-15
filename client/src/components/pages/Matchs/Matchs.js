import React, { useEffect, useState } from 'react';
import './Matchs.css';
import { useParams } from 'react-router-dom';
import Header2 from "../../Header2/Header2";
import axios from 'axios';

function Matchs() {
  const { email } = useParams();
  // Utilisez 'email' pour récupérer les données spécifiques à cet utilisateur
  const [matchs, setMatchs] = useState([])
  useEffect(() => {
    axios.post('http://localhost:5000/recupMatchs', {email: email})
    .then((response) => {
      setMatchs(response.data);
    })
    .catch((error) => {
      console.log(error);
    })
  }, []);

  return (
    <div>
      <Header2 activePage="matchs" email={email} />
      <div className="matchs">
        <h1>Mes Matchs</h1>
        {matchs.length > 0 ?
          <table>
            <thead>
              <tr>
              <th>Nom</th>
              <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {matchs.map((match) => (
                <tr >
                <td>{match.firstName}</td>
                <td><img src={match.profilePicture} alt={match.firstName} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          : <p>Aucun match trouvé</p>
        }
      </div>
    </div>
  );
}

export default Matchs;