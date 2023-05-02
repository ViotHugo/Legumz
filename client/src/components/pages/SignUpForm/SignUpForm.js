import React, { useState } from "react";
import "./SignUpForm.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import Header from "./../../Header/Header";

function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: "", // changed fullName to firstName
    prenom: "", // not used in the code
    email: "",
    password: "", // not used in the code
    age: "",
    gender: "",
    city: "", // not used in the code
    bio: "", // not used in the code
    interests: "", // not used in the code
    hobbies: [], // changed hobbies to an empty array
    lookingFor: "", // not used in the code
    profilePictures: [], // not used in the code
  });

  const [customHobby, setCustomHobby] = useState("");

  const hobbiesList = [
    "Lecture",
    "Cinéma",
    "Jeux vidéo",
    "Voyages",
    "Cuisine",
    "Randonnée",
    "Jardinage",
    "Peinture",
    "Danse",
    "Photographie",
    "Sport",
    "Musique",
    "Bricolage",
    "Yoga",
  ];

  const handleAddCustomHobby = () => {
    if (customHobby && !formData.hobbies.includes(customHobby)) {
      setFormData({ ...formData, hobbies: [...formData.hobbies, customHobby] });
      setCustomHobby("");
    }
  };

  const onDragStart = (e, hobby) => {
    e.dataTransfer.setData("hobby", hobby);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDragStartFromDropzone = (e, hobby) => {
    e.dataTransfer.setData("hobbyToRemove", hobby);
  };

  const onDropToRemove = (e) => {
    const hobbyToRemove = e.dataTransfer.getData("hobbyToRemove");
    setFormData({
      ...formData,
      hobbies: formData.hobbies.filter((hobby) => hobby !== hobbyToRemove),
    });
  };

  const onDrop = (e) => {
    const hobby = e.dataTransfer.getData("hobby");

    // Vérifie si le hobby n'est pas déjà présent dans formData.hobbies
    if (!formData.hobbies.includes(hobby)) {
      setFormData({ ...formData, hobbies: [...formData.hobbies, hobby] });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.firstName &&
      formData.age &&
      formData.gender &&
      formData.email
    ) {
      if (formData.age >= 18) {
        setSection(2);
        console.log("Section changed to 2");
        axios
          .post("http://localhost:5000/inscription", {
            ...formData,
            vegetableChoice,
            genreSearch: genre,
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        alert("Tu dois être majeur pour t'inscrire");
      }
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    if (
      formData.firstName &&
      formData.age &&
      formData.gender &&
      formData.email
    ) {
      axios
        .post("http://localhost:5000/inscription", {
          ...formData,
          vegetableChoice,
          genreSearch: genre,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            profilePictures: prevFormData.profilePictures.concat(reader.result),
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const [section, setSection] = useState(1);

  return (
    <div>
      <Header />
      <div className="signup-container">
        {section === 1 && (
          <div>
            <h1>Inscription</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

              <div className="form-row">
                <div>
                  <label htmlFor="age">Âge</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="gender">Genre</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner un genre</option>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="input-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <label htmlFor="city">Ville</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <button type="submit">Suivant</button>
            </form>
          </div>
        )}
        {section === 2 && (
          <div>
            <h1>Dis nous en un peu plus sur toi</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
              <label htmlFor="bio">Description/Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
              />
              <div className="input-group">
                <label htmlFor="profilePicture">Photo de profil</label>
                <input
                  type="file"
                  id="profilePictures"
                  name="profilePictures"
                  onChange={handleFileChange}
                  multiple
                  required
                />
              </div>

              <div className="button-container">
                <button
                  type="button"
                  className="section-button"
                  onClick={() => setSection(1)}
                >
                  Précédent
                </button>
                <button
                  type="button"
                  className="section-button"
                  onClick={() => setSection(3)}
                >
                  Suivant
                </button>
              </div>
            </form>
          </div>
        )}
        {section === 3 && (
          <div>
            <h1>Sélectionnez vos hobbies</h1>
            <p>
              Faites glisser et déposez les hobbies dans la boîte ci-dessous :
            </p>
            <div className="hobbies-container">
              {hobbiesList.map((hobby, index) => (
                <div
                  key={index}
                  className="hobby-item"
                  draggable="true"
                  onDragStart={(e) => onDragStart(e, hobby)}
                >
                  {hobby}
                </div>
              ))}
            </div>
            <div className="dropzone-container">
              <div
                className="dropzone"
                onDragOver={(e) => onDragOver(e)}
                onDrop={(e) => onDrop(e)}
              >
                {formData.hobbies.map((hobby, index) => (
                  <div
                    key={index}
                    className="hobby-item"
                    draggable="true"
                    onDragStart={(e) => onDragStartFromDropzone(e, hobby)}
                  >
                    {hobby}
                  </div>
                ))}
              </div>
            </div>
            <label htmlFor="customHobby">Créer un hobby personnalisé :</label>
            <input
              type="text"
              class="customHobby-input"
              id="customHobby"
              name="customHobby"
              value={customHobby}
              onChange={(e) => setCustomHobby(e.target.value)}
            />
            <div class="customHobby-button-container">
              <button class="customHobby-button" onClick={handleAddCustomHobby}>
                Ajouter
              </button>
            </div>
            <div className="remove-hobbies-container">
              <p>Faites glisser les hobbies ici pour les enlever :</p>
              <div
                className="dropzone-remove"
                onDragOver={(e) => onDragOver(e)}
                onDrop={(e) => onDropToRemove(e)}
              ></div>
            </div>
            <div className="button-container">
              <button
                type="button"
                className="section-button"
                onClick={() => setSection(2)}
              >
                Précédent
              </button>
              <button
                type="button"
                className="section-button"
                onClick={() => setSection(4)}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {section === 4 && (
          <div>
            <h1>Confirmez votre inscription</h1>
            <p>Vérifiez vos informations :</p>
            <ul>
              <li>
                <strong>Prénom :</strong> {formData.firstName}
              </li>
              <li>
                <strong>Age :</strong> {formData.age}
              </li>
              <li>
                <strong>Genre :</strong> {formData.gender}
              </li>
              <li>
                <strong>Email:</strong> {formData.email}
              </li>
              <li>
                <strong>Description/Bio :</strong> {formData.bio}
              </li>
              <li>
                <strong>Ville :</strong> {formData.city}
              </li>

              <li>
                <strong>Hobbies:</strong>{" "}
                {formData.hobbies.length > 0
                  ? formData.hobbies.join(", ")
                  : "None"}
              </li>
            </ul>
            {formData.profilePictures.length > 0 && (
              <div>
                <p>
                  <strong>Photos de profil :</strong>
                </p>
                {formData.profilePictures.map((picture, index) => (
                  <img
                    key={index}
                    src={picture}
                    alt={`Photo de profil ${index + 1}`}
                    className="profile-picture profile-picture-preview"
                  />
                ))}
              </div>
            )}

            <div className="button-container">
              <button
                type="button"
                className="section-button"
                onClick={() => setSection(3)}
              >
                Précédent
              </button>
              <button
                type="button"
                className="section-button"
                onClick={handleFinalSubmit}
              >
                S'inscrire
              </button>
            </div>
          </div>
        )}

        <div className="social-media-login">
          <i className="fa fa-facebook" aria-hidden="true"></i>
          <i className="fa fa-google" aria-hidden="true"></i>
          <i className="fa fa-twitter" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
