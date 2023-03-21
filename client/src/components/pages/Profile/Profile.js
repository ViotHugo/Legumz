import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useParams } from "react-router-dom";
import axios from 'axios';

function Profile() {
    const { email } = useParams();
    
    const [user, setUser] = useState({})
      axios.post('http://localhost:5000/recupProfile', {email : email})
          .then((response) => {
            setUser(response.data);
            
          })
          .catch((error) => {
            console.log(error);
          });
    useEffect(() => {

    }, [email])

  // Ici, vous pouvez ajouter des informations sur le profil de l'utilisateur, comme le nom, l'email, l'âge, etc.
  /*
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    age: 28,
    // ... d'autres informations sur le profil
  };
  
  */

  return (
    <div className="profile">
      <h1>Profil</h1>
      <div className="profile-info">
        <h2>Nom : {user.fullName}</h2>
        <h3>Email : {user.email}</h3>
        <h3>Age : {user.age} ans</h3>
        <img src={user.profilePicture} alt="new" />

        {/* Ajoutez d'autres informations sur le profil ici */}
      </div>
    </div>
  );
}
export default Profile;
