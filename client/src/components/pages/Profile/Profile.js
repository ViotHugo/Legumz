import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useParams } from "react-router-dom";
import axios from 'axios';
import Header2 from "./../../Header2/Header2";

import relationshipIcon1 from "../../../images/aubergine.png";
import relationshipIcon2 from "../../../images/carrote.png";
import relationshipIcon3 from "../../../images/piment.png";
import relationshipIcon4 from "../../../images/poivron.png";

import genderIcon1 from "../../../images/homme.png";
import genderIcon2 from "../../../images/femme.png";
import genderIcon3 from "../../../images/bi.png";


function Profile() {
    const { email } = useParams();
    
    const [user, setUser] = useState({})
    useEffect(() => {
      axios.post('http://localhost:5000/recupProfile', {email : email})
          .then((response) => {
            setUser(response.data);  
            
          })
          .catch((error) => {
            console.log(error);
      });
  }, [email])

  let vegetableImage;
  console.log(user.vegetableChoice)
  if (user.vegetableChoice === "Piment rouge") {
    vegetableImage = relationshipIcon3;
  } else if (user.vegetableChoice === "Poivron jaune") {
    vegetableImage = relationshipIcon4;
  } else if (user.vegetableChoice === "Carotte") {
    vegetableImage = relationshipIcon2;
  } else if (user.vegetableChoice === "Aubergine") {
    vegetableImage = relationshipIcon1;
  }



  let sexeUsersearch;
  if (user.genderSearch=="Homme"){
    sexeUsersearch=genderIcon1;
  }
  else if (user.genderSearch=="Femme"){
    sexeUsersearch=genderIcon2;
  }
  else if (user.genderSearch=="Les deux"){
    sexeUsersearch=genderIcon3;
  }






  return (
    <div>
      <Header2 activePage="profil" email={email}/>
      <div className="profil">
        <h1>Profil</h1>
        <div className="profile-info">
  <h2>Nom : {user.firstName}</h2>
  <h3>Email : {user.email}</h3>
  <h3>Age : {user.age} ans</h3>
  <h4>Genre: {user.gender}</h4>
  <h5>Adresse: {user.adress}</h5>
  <h6>Bio: {user.bio}</h6>
  
  
  <div className="image-container">
  <h7><img src={sexeUsersearch} alt={user.genderSearch} /></h7>
    
    <h8><img src={vegetableImage} alt={user.vegetableChoice} /></h8>
  </div>
  <img src={user.profilePicture} alt="new" />
  {/* Ajoutez d'autres informations sur le profil ici */}
</div>
      </div>
    </div>
  );
}
export default Profile;
