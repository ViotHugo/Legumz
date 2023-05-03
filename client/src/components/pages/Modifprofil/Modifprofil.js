import React, { useState, useEffect } from 'react';
import './Modifprofil.css';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import Header2 from "./../../Header2/Header2";

import relationshipIcon1 from "../../../images/aubergine.png";
import relationshipIcon2 from "../../../images/carrote.png";
import relationshipIcon3 from "../../../images/piment.png";
import relationshipIcon4 from "../../../images/poivron.png";

import genderIcon1 from "../../../images/homme.png";
import genderIcon2 from "../../../images/femme.png";
import genderIcon3 from "../../../images/bi.png";

function Modifprofil() {
  const { email } = useParams();

  const [user, setUser] = useState({
    firstName: "",
    age: "",
    gender: "",
    adress: "",
    bio: "",
    vegetableChoice: "",
    genderSearch: "",
    profilePicture: ""
  });

useEffect(() => {
  axios.post('http://localhost:5000/recupProfile', { email: email })
    .then((response) => {
      setUser({ ...user, ...response.data }); // Pré-remplir les champs avec les valeurs existantes de l'utilisateur
    })
    .catch((error) => {
      console.log(error);
    });
}, [email]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:5000/modifProfile', user)
      .then((response) => {
        console.log(response.data);
        history.push(`/profil/${email}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Header2 activePage="modifprofil" email={email} />
      <div className="modifprofil">
        <h1>Modifier votre profil</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">Nom :</label>
          <input type="text" id="firstName" name="firstName" value={user.firstName} onChange={handleChange} required />

          <label htmlFor="age">Age :</label>
          <input type="number" id="age" name="age" value={user.age} onChange={handleChange} required />

          <label htmlFor="gender">Genre :</label>
          <select id="gender" name="gender" value={user.gender} onChange={handleChange} required>
            <option value="">Choisir</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Non-binaire">Non-binaire</option>
          </select>

          <label htmlFor="adress">Adresse :</label>
          <input type="text" id="adress" name="adress" value={user.adress} onChange={handleChange} required />

          <label htmlFor="bio">Bio :</label>
          <textarea id="bio" name="bio" value={user.bio} onChange={handleChange} required />

          <label htmlFor="vegetableChoice">Légume préféré :</label>
          <select id="vegetableChoice" name="vegetableChoice" value={user.vegetableChoice} onChange={handleChange} required>
            <option value="">Choisir</option>
            <option value="Aubergine">Aubergine</option>
            <option value="Carotte">Carotte</option>
            <option value="Piment rouge">Piment rouge</option>
            <option value="Poivron jaune">Poivron jaune</option>
          </select>

          <label htmlFor="genderSearch">Recherche :</label>
          <select id="genderSearch" name="genderSearch" value={user.genderSearch} onChange={handleChange} required>
            <option value="">Choisir</option>
            <option value="Homme">Homme</option>
        <option value="Femme">Femme</option>
        <option value="Les deux">Les deux</option>
      </select>

      <label htmlFor="profilePicture">Photo de profil :</label>
      <input type="url" id="profilePicture" name="profilePicture" value={user.profilePicture} onChange={handleChange} required />

      <button type="submit" className="btn-modifier-profil">Enregistrer</button>
    </form>
  </div>
</div>
);
}

export default Modifprofil;
