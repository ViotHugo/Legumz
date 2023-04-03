import React, { useState } from "react";
import "./SignUpForm.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";

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
    profilePicture: "", // not used in the code
  });

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
    setFormData({ ...formData, hobbies: [...formData.hobbies, hobby] });
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

  const [section, setSection] = useState(1);

  return (
    <div className="signup-container">
      {section === 1 && (
        <div>
          <h1>Sign Up</h1>
          <form className="signup-form" onSubmit={handleSubmit}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />

            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select a gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <button type="submit">Next</button>
          </form>
        </div>
      )}

      {section === 2 && (
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
        </div>
      )}

      {section === 3 && (
        <div>
          <h1>Confirm Your Sign Up</h1>
          <p>Please check the following information:</p>
          <ul>
            <li>
              <strong>First Name:</strong> {formData.firstName}
            </li>
            <li>
              <strong>Age:</strong> {formData.age}
            </li>
            <li>
              <strong>Gender:</strong> {formData.gender}
            </li>
            <li>
              <strong>Email:</strong> {formData.email}
            </li>
            <li>
              <strong>Hobbies:</strong>{" "}
              {formData.hobbies.length > 0
                ? formData.hobbies.join(", ")
                : "None"}
            </li>
          </ul>
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
  );
}

export default SignUpForm;
